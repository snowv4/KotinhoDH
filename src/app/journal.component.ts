import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CharacterStore } from './character.store';
@Component({selector:'app-journal',standalone:true,imports:[FormsModule],template:`
 <div class="section-heading"><div><span class="eyebrow">Sete raízes à direita da entrada</span><h2>De onde vim. Por onde andei.</h2></div></div>
 <div class="journal-columns"><section class="panel story-panel"><div class="section-heading"><h3>Um endereço que virou nome</h3><button class="text-button" (click)="toggleStory()">{{editing?'Cancelar':'✎ Editar'}}</button></div>
 @if(editing){<label>Sua história<textarea rows="20" [(ngModel)]="storyDraft" maxlength="50000"></textarea></label><button class="button primary" (click)="saveStory()">Salvar história</button>}
 @else{<div class="story-text">{{store.character().story}}</div>}
 <blockquote>“Sete raízes à direita da entrada. Se chegou no poço, passou. Pode aparecer pra um chá.”</blockquote></section>
 <section class="panel notes-panel"><span class="eyebrow">Ainda há páginas em branco</span><h3>Anotações da sessão</h3><p class="muted small">Pistas do âmbar, nomes pelo caminho e coisas que merecem uma olhadinha.</p><label class="sr-only" for="session-notes">Anotações da sessão</label><textarea id="session-notes" class="notebook" rows="20" maxlength="100000" placeholder="A aventura de hoje começou assim…" [ngModel]="store.character().notes" (ngModelChange)="notes($event)"></textarea><span class="small muted">As anotações são salvas enquanto você escreve.</span></section></div>
`})
export class JournalComponent {
 readonly store=inject(CharacterStore);editing=false;storyDraft='';
 toggleStory(){this.editing=!this.editing;this.storyDraft=this.store.character().story;}
 saveStory(){if(this.store.update(c=>{c.story=this.storyDraft;}))this.editing=false;}
 notes(value:string){this.store.update(c=>{c.notes=value;});}
}
