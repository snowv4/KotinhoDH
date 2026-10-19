import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CharacterStore } from './character.store';
interface Roll { id:number;hope:number;fear:number;modifier:number;total:number;physical:boolean }
@Component({selector:'app-dice',standalone:true,imports:[FormsModule],template:`
 <p class="muted">Dois dados, uma história para contar.</p>
 <div class="dice-pair" [class.rolling]="rolling()"><div class="die hope-die"><span>Esperança</span><strong>{{last()?.hope??'?'}}</strong><small>d12</small></div><span class="dice-plus">+</span><div class="die fear-die"><span>Medo</span><strong>{{last()?.fear??'?'}}</strong><small>d12</small></div></div>
 <div class="dice-controls"><label>Modificador<input type="number" min="-30" max="50" [(ngModel)]="modifier"></label><button class="text-button" (click)="useKnowledge()">Usar Conhecimento ({{store.character().traits[5].value}})</button></div>
 <button class="button primary full-width" (click)="roll()">◇ Rolar os dois d12</button>
 @if(last();as result){<div class="roll-result" role="status"><span>Total</span><strong>{{result.total}}</strong><small>{{result.hope}} + {{result.fear}} {{result.modifier>=0?'+':'−'}} {{abs(result.modifier)}}</small></div>}
 <details class="physical-dice"><summary>Estou usando dados físicos</summary><div class="form-grid"><label>Esperança (1–12)<input type="number" min="1" max="12" [(ngModel)]="physicalHope"></label><label>Medo (1–12)<input type="number" min="1" max="12" [(ngModel)]="physicalFear"></label></div><button class="button subtle" (click)="recordPhysical()">Registrar resultado</button></details>
 @if(error()){<p role="alert" class="error-text">{{error()}}</p>}
 <p class="small muted">As rolagens não aplicam dano, cura ou mudanças de recursos. Histórico desta visita, até 8 rolagens.</p>
 @if(history().length){<div class="roll-history"><h3>Últimas rolagens</h3>@for(r of history();track r.id){<div><span>☀ {{r.hope}} <span class="dot">·</span> ◇ {{r.fear}} <span class="dot">·</span> {{r.modifier>=0?'+':''}}{{r.modifier}} @if(r.physical){<small>físicos</small>}</span><strong>{{r.total}}</strong></div>}</div>}
`})
export class DiceComponent {
 readonly store=inject(CharacterStore);readonly history=signal<Roll[]>([]);readonly last=signal<Roll|null>(null);readonly rolling=signal(false);readonly error=signal('');
 modifier=this.store.character().traits[5].value;physicalHope:number|null=null;physicalFear:number|null=null;abs=Math.abs;private sequence=0;
 useKnowledge(){this.modifier=this.store.character().traits[5].value;}
 private d12(){const n=new Uint32Array(1);do{crypto.getRandomValues(n);}while(n[0]>=4294967292);return n[0]%12+1;}
 private record(hope:number,fear:number,physical:boolean){
 if(!Number.isInteger(this.modifier)||this.modifier< -30||this.modifier>50){this.error.set('Use um modificador inteiro entre −30 e 50.');return;}
 this.error.set('');const r={id:++this.sequence,hope,fear,modifier:this.modifier,total:hope+fear+this.modifier,physical};this.last.set(r);this.history.update(h=>[r,...h].slice(0,8));
 this.rolling.set(false);setTimeout(()=>this.rolling.set(true));setTimeout(()=>this.rolling.set(false),380);
 }
 roll(){this.record(this.d12(),this.d12(),false);}
 recordPhysical(){if(this.physicalHope===null||this.physicalFear===null||![this.physicalHope,this.physicalFear].every(x=>Number.isInteger(x)&&x>=1&&x<=12)){this.error.set('Preencha os dois dados com inteiros de 1 a 12.');return;}this.record(this.physicalHope,this.physicalFear,true);}
}
