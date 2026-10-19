import { Component, computed, inject, signal, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CharacterStore } from './character.store';
import type { Card } from './model';
@Component({selector:'app-spells',standalone:true,imports:[FormsModule],template:`
 <div class="section-heading"><div><span class="eyebrow">Madeira, âmbar e um pouco de magia</span><h2>O grimório na barba</h2></div><span class="count-tag">{{store.character().cards.length}} cartas · {{spellCount()}} magias</span></div>
 <p class="section-intro">Cada conta guarda uma fórmula. Passe os dedos, encontre a lembrança.</p>
 <label class="search-field"><span aria-hidden="true">⌕</span><input type="search" aria-label="Buscar magia" placeholder="Encontrar uma magia…" [ngModel]="query()" (ngModelChange)="query.set($event)"></label>
 <div class="spell-cards">
 @for(card of filtered();track card.id){
 <details class="spell-card" [open]="!!query()">
 <summary><div class="book-emblem" aria-hidden="true">{{card.domain.startsWith('Esplendor')?'✺':'✧'}}</div><div><span class="eyebrow">{{card.domain}} · nível {{card.level}}</span><h3>{{card.name}}</h3><span class="small">{{card.spells.length}} {{card.spells.length===1?'magia':'magias'}} <span class="dot">·</span> Custo de troca {{card.recall}}</span></div><span class="expand-sign" aria-hidden="true">+</span></summary>
 <div class="spell-content">
 @for(spell of card.spells;track $index){<article class="spell"><div class="spell-title"><h4>{{spell.name}}</h4>@if(spell.cost){<span class="cost-tag">{{spell.cost}}</span>}</div>
 <dl>@if(spell.test){<div><dt>Teste</dt><dd>{{spell.test}}</dd></div>}@if(spell.range){<div><dt>Alcance</dt><dd>{{spell.range}}</dd></div>}</dl>
 <p>{{spell.effect}}</p>@if(spell.restriction){<p class="restriction">{{spell.restriction}}</p>}
 @if(spell.test){<button class="text-button" (click)="roll.emit()">◇ Abrir rolagem de Conjuração</button>}</article>}
 <button class="text-button card-edit" (click)="startEdit(card)">✎ Editar esta carta</button>
 </div></details>}
 @empty{<div class="empty-state"><span>⌕</span><h3>Nenhuma conta por aqui</h3><p>Tente o nome da carta ou uma palavra da magia.</p></div>}
 </div>
 <aside class="quiet-note">O custo de troca pertence à carta; não é o custo para conjurar. Consultar magias não altera seus recursos. Os textos são resumos da ficha, editáveis e referentes ao nível 1.</aside>
 @if(draft){<div class="inline-editor panel"><div class="section-heading"><h3>Editar carta</h3><button class="text-button" (click)="draft=null">Cancelar</button></div>
 <div class="form-grid"><label>Nome da carta<input [(ngModel)]="draft.name" maxlength="150"></label><label>Domínio<input [(ngModel)]="draft.domain" maxlength="100"></label><label>Nível<input type="number" min="1" max="10" [(ngModel)]="draft.level"></label><label>Custo de troca<input type="number" min="0" max="20" [(ngModel)]="draft.recall"></label></div>
 @for(spell of draft.spells;track $index){<fieldset><legend>Magia {{$index+1}}</legend><label>Nome<input [(ngModel)]="spell.name" maxlength="150"></label><div class="form-grid"><label>Teste<input [(ngModel)]="spell.test"></label><label>Alcance<input [(ngModel)]="spell.range"></label><label>Custo explícito<input [(ngModel)]="spell.cost"></label><label>Restrições<input [(ngModel)]="spell.restriction"></label></div><label>Efeito<textarea rows="3" [(ngModel)]="spell.effect"></textarea></label></fieldset>}
 <button class="button primary" (click)="save()">Salvar carta</button></div>}
`})
export class SpellsComponent {
 readonly store=inject(CharacterStore);readonly roll=output<void>();readonly query=signal('');draft:Card|null=null;
 readonly spellCount=computed(()=>this.store.character().cards.reduce((n,c)=>n+c.spells.length,0));
 readonly filtered=computed(()=>{const q=this.query().toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g,'');return this.store.character().cards.filter(c=>JSON.stringify(c).toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes(q));});
 startEdit(card:Card){this.draft=structuredClone(card);setTimeout(()=>document.querySelector('.inline-editor')?.scrollIntoView({block:'start'}));}
 save(){if(!this.draft)return;const draft=structuredClone(this.draft);if(this.store.update(c=>{c.cards=c.cards.map(x=>x.id===draft.id?draft:x);})) {this.draft=null;this.store.notice.set('Carta atualizada.');}}
}
