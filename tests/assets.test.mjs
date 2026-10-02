import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'../dist');
for(const file of ['index.html','style.css','game.mjs','battle.mjs','assets/ATTRIBUTION.txt','assets/vendor/three.module.js','assets/vendor/three.core.js','assets/vendor/GLTFLoader.js','assets/vendor/utils/SkeletonUtils.js','assets/vendor/utils/BufferGeometryUtils.js'])assert.ok(fs.statSync(path.join(root,file)).size>0,file);
const html=fs.readFileSync(path.join(root,'index.html'),'utf8'),css=fs.readFileSync(path.join(root,'style.css'),'utf8');assert.match(html,/lang="zh-CN"/);assert.match(html,/name="viewport"/);assert.match(html,/aria-live="polite"/);assert.match(css,/@media\(max-width:480px\)/);assert.match(css,/prefers-reduced-motion/);
for(const p of ['menu.ogg','battle.mp3',...['Metal_medium','Punch_heavy','Wood_medium','Soft_heavy'].flatMap(k=>[0,1,2].map(i=>`impact${k}_00${i}.ogg`))])assert.ok(fs.statSync(path.join(root,'assets/audio',p)).size>1000,p);
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);assert.equal(ids.length,new Set(ids).size,'Unique HTML IDs');
let missing=[];const js=fs.readFileSync(path.join(root,'game.mjs'),'utf8');for(const m of js.matchAll(/\$\('#([a-z0-9-]+)'\)/g))if(!ids.includes(m[1]))missing.push(m[1]);assert.deepEqual(missing,[],'Every direct DOM selector exists');
console.log('PASS HTML, UI selectors, responsive rules, audio, model and module asset references');
