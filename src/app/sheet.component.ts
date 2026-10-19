import { Component, inject, output } from '@angular/core';
import { CharacterStore } from './character.store';
@Component({selector:'app-sheet',standalone:true,template:`
 <div class="section-heading"><div><span class="eyebrow">Um pequeno mago, um mundo inteiro</span><h2>A ficha de {{store.character().nickname}}</h2></div><button class="button subtle" (click)="edit.emit()">✎ Editar ficha</button></div>
 <div class="traits-grid">
 @for(trait of store.character().traits;track $index){
 <article class="trait" [class.knowledge]="$index===5"><h3>{{trait.name}}</h3><strong>{{trait.value>0?'+':''}}{{trait.value}}</strong><p>{{trait.hint}}</p></article>
 }
 </div>
 <div class="sheet-columns">
 <section class="panel defenses"><div class="section-heading"><h3>Defesa & proteção</h3><span class="ornament" aria-hidden="true">◇</span></div>
  <div class="defense-values"><div><strong>{{store.character().evasion}}</strong><span>Evasão</span></div><div><strong>{{store.character().armorScore}}</strong><span>Pontuação de armadura</span></div><div><strong>{{store.character().proficiency}}</strong><span>Proficiência</span></div></div>
  <div class="thresholds"><span>Limiares de dano</span><b>{{store.character().minor}} <span>/</span> {{store.character().major}}</b></div>
  <p class="muted small">Consulte os limiares e marque os recursos manualmente.</p>
 </section>
 <section class="panel"><div class="section-heading"><h3>Experiências</h3><span class="ornament" aria-hidden="true">✳</span></div>
 @for(exp of store.character().experiences;track $index){<div class="experience"><span class="bonus">{{exp.bonus>0?'+':''}}{{exp.bonus}}</span><div><h4>{{exp.name}}</h4><p>{{exp.description}}</p></div></div>}
 </section>
 </div>
 <section class="pattern-banner"><div class="pattern-emblem" aria-hidden="true">✧</div><div><h3>Padrões Estranhos</h3><p>Um número que insiste em aparecer. Uma pequena coincidência… ou não.</p></div><label>Número escolhido<input aria-label="Número de Padrões Estranhos" type="number" min="1" max="12" placeholder="—" [value]="store.character().pattern??''" (change)="pattern($event)"><small>1 a 12 · pode ficar vazio</small></label></section>
 <div class="section-heading abilities-heading"><div><span class="eyebrow">Conhecimento que vai na bagagem</span><h2>Pequenos grandes talentos</h2></div></div>
 <div class="abilities-grid">@for(ability of store.character().abilities;track $index){<details class="ability"><summary>{{ability.name}}<span aria-hidden="true">+</span></summary><p>{{ability.description}}</p></details>}</div>
 <p class="source-note">Habilidades resumidas da ficha fornecida · controle manual durante a sessão.</p>
`})
export class SheetComponent {
 readonly store=inject(CharacterStore);readonly edit=output<void>();
 pattern(event:Event){const el=event.target as HTMLInputElement;const value=el.value===''?null:Number(el.value);if(value!==null&&(!Number.isInteger(value)||value<1||value>12)){this.store.notice.set('Escolha um inteiro de 1 a 12, ou deixe o campo vazio.');el.value=String(this.store.character().pattern??'');return;}this.store.update(c=>{c.pattern=value;});}
}
