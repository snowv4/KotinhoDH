export interface Resource { value: number | null; max: number }
export type ResourceKey = 'hp' | 'stress' | 'hope' | 'armor';
export interface Trait { name: string; value: number; hint: string }
export interface Spell { name: string; test: string; range: string; effect: string; cost: string; restriction: string }
export interface Card { id: string; name: string; domain: string; level: number; recall: number; spells: Spell[] }
export interface Item { id: string; name: string; quantity: number | null; notes: string }
export interface Character {
  name: string; nickname: string; pronouns: string; age: number; ancestry: string;
  className: string; community: string; level: number; portrait: string;
  traits: Trait[]; evasion: number; proficiency: number; armorScore: number; minor: number; major: number;
  resources: Record<ResourceKey, Resource>; pattern: number | null;
  experiences: {name: string; bonus: number; description: string}[];
  cards: Card[]; abilities: {name: string; description: string}[]; inventory: Item[];
  story: string; notes: string;
}
export interface Backup { version: 1; character: Character }
export const STORAGE_KEY = 'kote.character.v1';
export const MAX_BACKUP_BYTES = 4 * 1024 * 1024;
export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, Math.trunc(value)));
const fail = (): never => { throw new Error('Arquivo inválido. Confira o formato e os limites da ficha.'); };
const obj = (v: unknown): Record<string, unknown> => v !== null && typeof v === 'object' && !Array.isArray(v) ? v as Record<string, unknown> : fail();
const str = (v: unknown, max = 2000): string => typeof v === 'string' && v.length <= max ? v : fail();
const num = (v: unknown, min: number, max: number): number => typeof v === 'number' && Number.isInteger(v) && v >= min && v <= max ? v : fail();
const arr = <T>(v: unknown, max: number, parse: (x: unknown) => T): T[] => Array.isArray(v) && v.length <= max ? v.map(parse) : fail();
export function validateCharacter(input: unknown): Character {
  const c = obj(input); const resources = obj(c['resources']);
  const parseResource = (key: ResourceKey): Resource => {
    const r = obj(resources[key]); const max = num(r['max'], 1, 30);
    return {max, value: key === 'hope' && r['value'] === null ? null : num(r['value'], 0, max)};
  };
  const portrait = str(c['portrait'], 2_000_000);
  if (portrait && !/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(portrait)) fail();
  const traits = arr(c['traits'], 6, x => { const t=obj(x); return {name:str(t['name'],80),value:num(t['value'],-10,20),hint:str(t['hint'],200)}; });
  if (traits.length !== 6) fail();
  const minor=num(c['minor'],1,999); const major=num(c['major'],minor,999);
  const cards = arr(c['cards'], 30, x => {const t=obj(x); return {
    id:str(t['id'],100),name:str(t['name'],150),domain:str(t['domain'],100),level:num(t['level'],1,10),recall:num(t['recall'],0,20),
    spells:arr(t['spells'],20,s => {const p=obj(s);return {name:str(p['name'],150),test:str(p['test']),range:str(p['range']),effect:str(p['effect'],10000),cost:str(p['cost']),restriction:str(p['restriction'],5000)};})
  };});
  const inventory=arr(c['inventory'],200,x=>{const i=obj(x);return {id:str(i['id'],100),name:str(i['name'],200),quantity:i['quantity']===null?null:num(i['quantity'],0,99999),notes:str(i['notes'],5000)};});
  for (const group of [cards, inventory]) if (new Set(group.map(x=>x.id)).size !== group.length) fail();
  return {
    name:str(c['name'],150),nickname:str(c['nickname'],80),pronouns:str(c['pronouns'],80),age:num(c['age'],0,9999),
    ancestry:str(c['ancestry'],150),className:str(c['className'],150),community:str(c['community'],150),level:num(c['level'],1,10),portrait,
    traits,evasion:num(c['evasion'],0,99),proficiency:num(c['proficiency'],1,10),armorScore:num(c['armorScore'],0,30),minor,major,
    resources:{hp:parseResource('hp'),stress:parseResource('stress'),hope:parseResource('hope'),armor:parseResource('armor')},
    pattern:c['pattern']===null?null:num(c['pattern'],1,12),
    experiences:arr(c['experiences'],30,x=>{const e=obj(x);return {name:str(e['name'],200),bonus:num(e['bonus'],-10,20),description:str(e['description'],5000)};}),
    cards,abilities:arr(c['abilities'],50,x=>{const a=obj(x);return {name:str(a['name'],200),description:str(a['description'],10000)};}),
    inventory,story:str(c['story'],50000),notes:str(c['notes'],100000)
  };
}
export function parseBackup(raw: string): Character {
  if (new TextEncoder().encode(raw).length > MAX_BACKUP_BYTES) fail();
  const b=obj(JSON.parse(raw));
  if (b['version'] !== 1) throw new Error('Versão de backup não suportada. A ficha atual foi preservada.');
  return validateCharacter(b['character']);
}
export const serialize = (c: Character): string => JSON.stringify({version:1,character:validateCharacter(c)} satisfies Backup, null, 2);
export function changeResource(c: Character, key: ResourceKey, value: number | null): Character {
  const next=structuredClone(c);
  if (value === null && key !== 'hope') throw new Error('Somente Esperança pode ficar não definida.');
  if (value !== null && !Number.isFinite(value)) throw new Error('Valor inválido.');
  next.resources[key].value=value===null ? null : clamp(value,0,next.resources[key].max);
  return next;
}
export interface StorageLike {getItem(key:string):string|null;setItem(key:string,value:string):void}
export function readSaved(storage: StorageLike): Character | null { const raw=storage.getItem(STORAGE_KEY); return raw===null?null:parseBackup(raw); }
export function writeSaved(storage: StorageLike,c:Character):void {storage.setItem(STORAGE_KEY,serialize(c));}
