import assert from 'node:assert/strict';
import {Battle,TYPES,STAGES,validPlacement,costOf,loadFormationPlan} from '../dist/battle.mjs';
let tests=0;function check(name,fn){fn();tests++;console.log('PASS',name);}
function line(type,n,team){return Array.from({length:n},(_,i)=>({type,team,x:team===0?-5:5,z:(i-(n-1)/2)*1.5}));}
function run(units,seed=42){const b=new Battle(units,seed);for(let i=0;i<10810&&b.winner===null;i++)b.update(1/60);assert.notEqual(b.winner,null);assert.ok(b.units.every(u=>Number.isFinite(u.hp)&&Number.isFinite(u.x)&&Number.isFinite(u.z)));return b;}
check('eight distinct playable unit archetypes',()=>assert.equal(Object.keys(TYPES).length,8));
check('placement rejects invalid side, overlap, NaN and budget',()=>{for(const p of [{type:'swordsman',team:0,x:1,z:0},{type:'swordsman',team:0,x:NaN,z:0}])assert.equal(validPlacement(p,[]).ok,false);assert.equal(validPlacement({type:'giant',team:0,x:-5,z:0},[],600).ok,false);assert.equal(validPlacement({type:'swordsman',team:0,x:-5,z:0},line('swordsman',1,0)).ok,false);});
check('valid placement and exact-budget placement succeed',()=>assert.equal(validPlacement({type:'guardian',team:0,x:-5,z:0},[],140).ok,true));
check('healers cannot indefinitely stalemate',()=>assert.equal(run([...line('healer',2,0),...line('healer',2,1)]).winner,2));
check('numerical advantage produces result',()=>assert.equal(run([...line('swordsman',9,0),...line('swordsman',1,1)]).winner,0));
check('ranged projectiles hit and resolve battles',()=>{let b=run([...line('archer',5,0),...line('swordsman',3,1)]);assert.ok(b.units.some(u=>!u.alive));});
check('giant attack causes multiple casualties',()=>{let b=run([...line('giant',1,0),...line('swordsman',8,1)]);assert.ok(b.units.filter(u=>!u.alive).length>=3);});
check('heal restores allied hitpoints',()=>{const b=new Battle([...line('guardian',1,0),{type:'healer',team:0,x:-7,z:0},...line('guardian',1,1)]);b.units[0].hp=30;for(let i=0;i<80;i++)b.update(1/60);assert.ok(b.units[0].hp>30);});
check('fixed seed is reproducible',()=>{const units=[...line('berserker',3,0),...line('guardian',5,1)];assert.deepEqual(run(units).snapshot(),run(units).snapshot());});
check('nine stage presets stay within stated budget',()=>{for(const s of STAGES){let cost=s.starter.reduce((n,[t,c])=>n+TYPES[t].cost*c,0);assert.ok(cost<=s.budget,s.name+' overspent '+cost);}});
check('160-unit sandbox terminates, stays finite and within bounds',()=>{let units=[];for(let team=0;team<2;team++)for(let i=0;i<80;i++)units.push({type:Object.keys(TYPES)[i%8],team,x:(team===0?-1:1)*(3+Math.floor(i/10)*1.4),z:(i%10-4.5)*1.7});const start=performance.now();const b=run(units);console.log('  160-unit simulation:',(performance.now()-start).toFixed(0),'ms;',b.time.toFixed(1),'game seconds');assert.ok(b.units.every(u=>Math.abs(u.x)<18&&Math.abs(u.z)<12));});
console.log(`${tests} simulation checks passed`);

check('saved plans preserve opponents, mirror sides and validate the complete budget transaction',()=>{const enemy=line('archer',1,1),own=line('swordsman',2,0),existing=[...own,...enemy],before=JSON.stringify(existing),plan=own.map(({type,x,z})=>({type,x,z}));const ok=loadFormationPlan(plan,0,existing,160);assert.equal(ok.ok,true);assert.deepEqual(ok.placements.filter(p=>p.team===1),enemy);assert.equal(loadFormationPlan(plan,0,existing,159).ok,false);assert.equal(JSON.stringify(existing),before);const red=loadFormationPlan(plan,1,own,160);assert.equal(red.ok,true);assert.ok(red.placements.filter(p=>p.team===1).every(p=>p.x>0));for(const bad of [null,[],[null],[{type:'unknown',x:2,z:0}],[{type:'giant',x:NaN,z:0}]])assert.equal(loadFormationPlan(bad,0,[],Infinity).ok,false);});
