import { Component, inject } from '@angular/core';
import { CharacterStore } from './character.store';
import type { ResourceKey } from './model';
@Component({selector:'app-resources',standalone:true,template:`
 <section class="resource-panel" aria-labelledby="resources-title">
  <div class="section-heading"><div><span class="eyebrow">Durante a aventura</span><h2 id="resources-title">Seus recursos</h2></div>
  <button class="text-button" (click)="store.undo()" [disabled]="!store.undoResources()" title="Desfazer última alteração de recursos">↶ Desfazer</button></div>
  <div class="resources-grid">
  @for (item of definitions; track item.key) {
   @let r=store.character().resources[item.key];
   <div class="resource" [class]="'resource '+item.key">
    <div class="resource-label"><span><span class="resource-symbol" aria-hidden="true">{{item.symbol}}</span> {{item.name}}</span><span class="resource-count">{{r.value === null ? '—' : r.value}} <small>/ {{r.max}}</small></span></div>
    <div class="pips">
     <button class="step" [attr.aria-label]="'Diminuir '+item.name" [disabled]="r.value===0" (click)="store.resource(item.key,(r.value??0)-1)">−</button>
     <div class="pip-group" [attr.aria-label]="item.name">
      @for (pip of slots(r.max); track pip) {
       <button class="pip" [class.marked]="r.value!==null && pip<=r.value" [attr.aria-pressed]="r.value!==null && pip<=r.value" [attr.aria-label]="item.name+': '+pip+' de '+r.max" (click)="store.resource(item.key,r.value===pip?pip-1:pip)"><span aria-hidden="true">{{r.value!==null && pip<=r.value?'✦':''}}</span></button>
      }
     </div>
     <button class="step" [attr.aria-label]="'Aumentar '+item.name" [disabled]="r.value===r.max" (click)="store.resource(item.key,(r.value??0)+1)">+</button>
    </div>
    <p class="resource-help">{{item.key==='hope' && r.value===null ? 'Não definida · escolha uma quantidade' : item.help}}</p>
    @if(item.key==='hope') {<div class="hope-options"><button class="text-button tiny" (click)="store.resource('hope',0)">Definir zero</button><button class="text-button tiny" (click)="store.resource('hope',null)" [disabled]="r.value===null">Deixar indefinida</button></div>}
   </div>
  }
  </div>
 </section>`})
export class ResourcePanelComponent {
 readonly store=inject(CharacterStore);
 readonly definitions:{key:ResourceKey;name:string;symbol:string;help:string}[]=[
 {key:'hp',name:'PV',symbol:'♡',help:'Espaços de dano marcados'},
 {key:'stress',name:'Estresse',symbol:'ϟ',help:'Espaços de estresse marcados'},
 {key:'hope',name:'Esperança',symbol:'✧',help:'Esperança disponível'},
 {key:'armor',name:'Armadura',symbol:'⬡',help:'Espaços de armadura usados'}];
 slots(max:number){return Array.from({length:max},(_,i)=>i+1);}
}
