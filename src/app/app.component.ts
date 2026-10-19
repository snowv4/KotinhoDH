import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CharacterStore } from './character.store';
import { ResourcePanelComponent } from './resource-panel.component';
import { SheetComponent } from './sheet.component';
import { SpellsComponent } from './spells.component';
import { InventoryComponent } from './inventory.component';
import { JournalComponent } from './journal.component';
import { DiceComponent } from './dice.component';
import { freshCharacter } from './initial-data';
import { MAX_BACKUP_BYTES, parseBackup, serialize, type Character, type ResourceKey } from './model';
type Tab = 'sheet'|'spells'|'inventory'|'journal';
@Component({selector:'app-root',standalone:true,imports:[FormsModule,ResourcePanelComponent,SheetComponent,SpellsComponent,InventoryComponent,JournalComponent,DiceComponent],templateUrl:'./app.component.html'})
export class AppComponent {
 readonly store=inject(CharacterStore);readonly tab=signal<Tab>('sheet');readonly draft=signal<Character|null>(null);
 readonly editor=viewChild.required<ElementRef<HTMLDialogElement>>('editor');readonly diceDialog=viewChild.required<ElementRef<HTMLDialogElement>>('diceDialog');readonly dice=viewChild.required(DiceComponent);
 readonly tabs:{key:Tab;label:string;icon:string}[]=[{key:'sheet',label:'Ficha',icon:'◇'},{key:'spells',label:'Magias',icon:'✧'},{key:'inventory',label:'Inventário',icon:'♧'},{key:'journal',label:'História & notas',icon:'✎'}];
 readonly resourceFields:{key:ResourceKey;label:string}[]=[{key:'hp',label:'PV máximos'},{key:'stress',label:'Estresse máximo'},{key:'hope',label:'Capacidade de Esperança'},{key:'armor',label:'Espaços de Armadura'}];
 edit(){this.store.notice.set('');this.draft.set(structuredClone(this.store.character()));this.editor().nativeElement.showModal();}
 closeEditor(){this.editor().nativeElement.close();this.draft.set(null);}
 saveEdit(){const d=this.draft();if(!d)return;
 for(const key of ['hp','stress','hope','armor'] as const){const r=d.resources[key];if(r.value!==null&&Number.isFinite(r.max))r.value=Math.min(r.value,r.max);}
 if(this.store.commit(d)){this.closeEditor();this.store.notice.set('Ficha atualizada.');}}
 openDice(conjuration=false){if(conjuration)this.dice().useKnowledge();this.diceDialog().nativeElement.showModal();}
 goResources(){document.getElementById('resources')?.scrollIntoView({block:'start'});}
 exportBackup(){try{const blob=new Blob([serialize(this.store.character())],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='kote-backup-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);this.store.notice.set('Backup preparado para download.');}catch{this.store.notice.set('Não foi possível exportar. Tente novamente.');}}
 async importBackup(event:Event){const input=event.target as HTMLInputElement;const file=input.files?.[0];input.value='';if(!file)return;
 try {if(file.size>MAX_BACKUP_BYTES)throw new Error('O backup deve ter no máximo 4 MB.');const next=parseBackup(await file.text());
 if(confirm('Substituir a ficha atual pelo backup de '+next.name+'? Exporte a ficha atual antes se quiser preservá-la.')){this.store.replace(next);this.store.notice.set('Backup importado.');}
 }catch(e){this.store.notice.set((e instanceof Error?e.message:'Não foi possível importar.')+' A ficha atual foi preservada.');}}
 reset(){if(confirm('Restaurar a ficha inicial do Kote? Suas alterações, inventário e anotações serão substituídos. Exporte um backup antes de continuar.')){this.store.replace(freshCharacter());this.draft.set(structuredClone(this.store.character()));this.store.notice.set('Ficha inicial restaurada.');}}
 async portrait(event:Event){const input=event.target as HTMLInputElement;const file=input.files?.[0];input.value='';if(!file)return;
 if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>1_400_000){this.store.notice.set('Escolha uma imagem PNG, JPEG ou WebP de até 1,4 MB.');return;}
 try{const data=await new Promise<string>((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result));r.onerror=()=>reject(new Error());r.readAsDataURL(file);});const img=new Image();img.src=data;await img.decode();const d=this.draft();if(d)this.draft.set({...d,portrait:data});}catch{this.store.notice.set('Não foi possível ler essa imagem.');}}
}
