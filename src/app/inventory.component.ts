import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CharacterStore } from './character.store';
import type { Item } from './model';
@Component({selector:'app-inventory',standalone:true,imports:[FormsModule],template:`
 <div class="section-heading"><div><span class="eyebrow">O que veio de casa. O que veio do caminho.</span><h2>Na bagagem</h2></div><button class="button primary" (click)="add()">+ Adicionar item</button></div>
 <label class="search-field"><span aria-hidden="true">⌕</span><input type="search" aria-label="Buscar item" placeholder="Procurar na bagagem…" [ngModel]="query()" (ngModelChange)="query.set($event)"></label>
 @if(draft){<form class="panel item-editor" (ngSubmit)="save()"><h3>{{isNew?'Um novo achado':'Editar item'}}</h3><div class="form-grid"><label>Nome<input name="itemName" [(ngModel)]="draft.name" maxlength="200" required></label><label>Quantidade (opcional)<input name="quantity" type="number" min="0" max="99999" [(ngModel)]="draft.quantity" placeholder="Não definida"></label></div><label>Observações<textarea name="itemNotes" rows="3" [(ngModel)]="draft.notes" maxlength="5000"></textarea></label><div class="actions"><button class="button primary" type="submit">Salvar item</button><button class="button subtle" type="button" (click)="draft=null">Cancelar</button></div></form>}
 <div class="inventory-list">@for(item of filtered();track item.id){<article class="inventory-item"><span class="item-mark" aria-hidden="true">◇</span><div class="item-copy"><h3>{{item.name}}</h3>@if(item.notes){<p>{{item.notes}}</p>}</div><span class="quantity" [attr.aria-label]="'Quantidade: '+(item.quantity??'não definida')">{{item.quantity===null?'—':'×'+item.quantity}}</span><div class="item-actions"><button class="icon-button" [attr.aria-label]="'Editar '+item.name" (click)="edit(item)">✎</button><button class="icon-button" [attr.aria-label]="'Remover '+item.name" (click)="remove(item)">×</button></div></article>}
 @empty{<div class="empty-state"><span>◇</span><h3>{{query()?'Não encontrei esse achado':'A bagagem está leve'}}</h3><p>{{query()?'Tente outra palavra.':'Adicione seu primeiro item para começar.'}}</p></div>}</div>
`})
export class InventoryComponent {
 readonly store=inject(CharacterStore);readonly query=signal('');draft:Item|null=null;isNew=false;
 readonly filtered=computed(()=>this.store.character().inventory.filter(i=>(i.name+' '+i.notes).toLocaleLowerCase('pt-BR').includes(this.query().toLocaleLowerCase('pt-BR'))));
 add(){this.isNew=true;this.draft={id:crypto.randomUUID(),name:'',quantity:null,notes:''};}
 edit(item:Item){this.isNew=false;this.draft=structuredClone(item);setTimeout(()=>document.querySelector('.item-editor')?.scrollIntoView({block:'center'}));}
 save(){if(!this.draft?.name.trim()){this.store.notice.set('Dê um nome ao item.');return;}const item=structuredClone(this.draft);if(this.store.update(c=>{if(this.isNew)c.inventory.push(item);else c.inventory=c.inventory.map(i=>i.id===item.id?item:i);}))this.draft=null;}
 remove(item:Item){if(confirm('Remover “'+item.name+'” da bagagem?'))this.store.update(c=>{c.inventory=c.inventory.filter(i=>i.id!==item.id);});}
}
