import { test } from 'node:test';
import assert from 'node:assert/strict';
import { freshCharacter } from '../src/app/initial-data.ts';
import { changeResource, parseBackup, serialize, readSaved, writeSaved, STORAGE_KEY, validateCharacter } from '../src/app/model.ts';
test('ficha inicial conserva os dados corrigidos e os valores não definidos',()=>{
 const c=freshCharacter();assert.equal(c.traits[0].value,-1);assert.equal(c.traits[1].value,0);assert.equal(c.resources.hope.value,null);assert.equal(c.pattern,null);assert.equal(c.cards.length,3);assert.equal(c.cards.flatMap(c=>c.spells).length,7);assert.match(c.story,/Vila Mellâmbar/);
 assert.equal(c.inventory.find(i=>i.id==='ouro')?.quantity,null);
});
test('esperança indefinida e zero sobrevivem ao backup como estados diferentes',()=>{
 const c=freshCharacter();assert.equal(parseBackup(serialize(c)).resources.hope.value,null);
 const zero=changeResource(c,'hope',0);assert.equal(parseBackup(serialize(zero)).resources.hope.value,0);
 assert.equal(changeResource(zero,'hope',null).resources.hope.value,null);assert.equal(c.resources.hope.value,null);
});
test('recursos respeitam todos os limites e não alteram os dados iniciais',()=>{
 for(const key of ['hp','stress','hope','armor'] as const){const c=freshCharacter();assert.equal(changeResource(c,key,-50).resources[key].value,0);assert.equal(changeResource(c,key,100).resources[key].value,c.resources[key].max);assert.throws(()=>changeResource(c,key,NaN));}
 assert.throws(()=>changeResource(freshCharacter(),'hp',null));assert.equal(freshCharacter().resources.hp.value,0);
});
test('round trip preserva textos, inventário e capacidades editadas',()=>{
 const c=freshCharacter();c.notes='Pistas: âmbar, chá e <script>alert(1)</script>';c.inventory.push({id:'custom',name:'Anel',quantity:2,notes:'Presente'});c.resources.hp={max:9,value:7};c.pattern=12;c.traits[5].value=5;
 assert.deepEqual(parseBackup(serialize(c)),c);
});
test('rejeita backups malformados, versões futuras e dados fora dos limites',()=>{
 assert.throws(()=>parseBackup('{'));assert.throws(()=>parseBackup('null'));assert.throws(()=>parseBackup('{"version":2}'));
 const invalid=[
 (c:any)=>c.resources.hp.value=6,(c:any)=>c.resources.hope.value=-1,(c:any)=>c.resources.hp.value=null,
 (c:any)=>c.pattern=0,(c:any)=>c.pattern=13,(c:any)=>c.pattern=1.5,(c:any)=>c.level='1',
 (c:any)=>c.major=1,(c:any)=>c.traits.pop(),(c:any)=>c.inventory[0].quantity=-1,
 (c:any)=>c.inventory[1].id=c.inventory[0].id,(c:any)=>c.cards[0].recall=-1,
 (c:any)=>c.portrait='javascript:alert(1)',(c:any)=>c.resources.armor.max=31,
 (c:any)=>c.cards[0].spells[0].effect=42,(c:any)=>c.notes='a'.repeat(100001)
 ];
 for(const mutate of invalid){const c=freshCharacter();mutate(c);assert.throws(()=>parseBackup(JSON.stringify({version:1,character:c})));}
});
test('validação elimina campos extras e não incorpora propriedades de protótipo',()=>{
 const c={...freshCharacter(),extra:'ignorar'};assert.equal('extra' in validateCharacter(c),false);
 const raw=JSON.stringify({version:1,character:c}).replace('"character":{','"character":{"__proto__":{"polluted":true},');
 parseBackup(raw);assert.equal(({} as any).polluted,undefined);
});
test('persistência confirma escrita e propaga falhas em vez de alegar sucesso',()=>{
 const map=new Map<string,string>();const storage={getItem:(k:string)=>map.get(k)??null,setItem:(k:string,v:string)=>{map.set(k,v);}};
 assert.equal(readSaved(storage),null);const c=freshCharacter();c.notes='Sessão 1';writeSaved(storage,c);assert.deepEqual(readSaved(storage),c);
 const before=map.get(STORAGE_KEY);assert.throws(()=>parseBackup('{"version":1,"character":{}}'));assert.equal(map.get(STORAGE_KEY),before);
 assert.throws(()=>writeSaved({getItem:()=>null,setItem:()=>{throw new Error('QuotaExceeded');}},c));
 assert.throws(()=>readSaved({getItem:()=>'{invalid',setItem:()=>{}}));
});
