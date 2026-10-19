import { Injectable, signal } from '@angular/core';
import { freshCharacter } from './initial-data';
import { changeResource, readSaved, writeSaved, validateCharacter, type Character, type ResourceKey } from './model';
@Injectable({providedIn:'root'})
export class CharacterStore {
 readonly character=signal<Character>(freshCharacter());
 readonly saveStatus=signal('Pronto para sua primeira aventura');
 readonly saveError=signal(false);
 readonly notice=signal('');
 readonly undoResources=signal<Character['resources']|null>(null);
 constructor() {
   try { const saved=readSaved(localStorage); if(saved){this.character.set(saved);this.saveStatus.set('Ficha restaurada deste navegador');} }
   catch {this.saveError.set(true);this.saveStatus.set('Não foi possível ler o salvamento. Exporte um backup antes de continuar.');}
 }
 commit(next:Character, resourceChange=false):boolean {
   try { next=validateCharacter(next); }
   catch(e) {this.notice.set(e instanceof Error?e.message:'Confira os dados.');return false;}
   if(resourceChange)this.undoResources.set(structuredClone(this.character().resources));
   this.character.set(next); this.save(next); return true;
 }
 update(edit:(c:Character)=>void):boolean {const next=structuredClone(this.character());edit(next);return this.commit(next);}
 resource(key:ResourceKey,value:number|null):void {this.commit(changeResource(this.character(),key,value),true);}
 undo():void {
   const previous=this.undoResources(); if(!previous)return;
   const next=structuredClone(this.character());
   for (const key of ['hp','stress','hope','armor'] as const) {
     const old=previous[key].value;next.resources[key].value=old===null?null:Math.min(old,next.resources[key].max);
   }
   this.commit(next);this.undoResources.set(null);this.notice.set('Última alteração de recursos desfeita.');
 }
 replace(next:Character):boolean {if(!this.commit(next))return false;this.undoResources.set(null);return true;}
 private save(c:Character):void {
   try {writeSaved(localStorage,c);this.saveError.set(false);this.saveStatus.set('Salvo neste navegador');}
   catch {if(!this.saveError())this.notice.set('Não foi possível salvar no navegador. Exporte um backup antes de fechar a página.');this.saveError.set(true);this.saveStatus.set('Não foi salvo no navegador. Exporte um backup para guardar suas alterações.');}
 }
}
