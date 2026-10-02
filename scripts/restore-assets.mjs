import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const manifest=JSON.parse(await fs.readFile(path.join(root,'assets/source/manifest.json'),'utf8'));
if(manifest.version!==1||!Array.isArray(manifest.assets))throw new Error('Unsupported source asset manifest');
const sha=data=>crypto.createHash('sha256').update(data).digest('hex');
const safe=relative=>{const p=path.resolve(root,relative);if(!p.startsWith(root+path.sep))throw new Error('Unsafe asset path');return p;};
let restored=0,verified=0;
for(const asset of manifest.assets){
  const destination=safe(asset.path);
  let existing;try{existing=await fs.readFile(destination);}catch(error){if(error.code!=='ENOENT')throw error;}
  if(existing&&existing.length===asset.bytes&&sha(existing)===asset.sha256){verified++;continue;}
  const chunks=[];
  for(const part of asset.parts){const data=await fs.readFile(safe(part.path));if(data.length!==part.bytes||sha(data)!==part.sha256)throw new Error(`Source fragment verification failed: ${part.path}`);chunks.push(data);}
  const data=Buffer.concat(chunks);
  if(data.length!==asset.bytes||sha(data)!==asset.sha256)throw new Error(`Reconstructed asset verification failed: ${asset.path}`);
  await fs.mkdir(path.dirname(destination),{recursive:true});
  const temporary=destination+'.restore-'+process.pid;
  await fs.writeFile(temporary,data);await fs.rename(temporary,destination);restored++;
}
console.log(`Source assets: ${restored} restored, ${verified} already verified (SHA-256)`);
