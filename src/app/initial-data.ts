import type { Character } from './model';
export const initialCharacter: Character = {
 name:'Kvothe Sete-Raízes',nickname:'Kote',pronouns:'ele/dele',age:128,ancestry:'Halfling',className:'Mago • Escola do Conhecimento',community:'Silvestre / Wildborne',level:1,portrait:'',
 traits:[
 {name:'Agilidade',value:-1,hint:'Correr · Saltar · Manobrar'},
 {name:'Força',value:0,hint:'Erguer · Golpear · Agarrar'},
 {name:'Finesse',value:0,hint:'Controlar · Esconder · Criar'},
 {name:'Instinto',value:1,hint:'Perceber · Sentir · Navegar'},
 {name:'Presença',value:1,hint:'Encantar · Atuar · Enganar'},
 {name:'Conhecimento',value:2,hint:'Lembrar · Analisar · Compreender'}],
 evasion:11,proficiency:1,armorScore:3,minor:7,major:14,
 resources:{hp:{value:0,max:5},stress:{value:0,max:6},hope:{value:null,max:6},armor:{value:0,max:3}},pattern:null,
 experiences:[
 {name:'Já caí nessa conversa',bonus:2,description:'Perceber golpes, inconsistências e tentativas de manipulação.'},
 {name:'Isso merece uma olhadinha…',bonus:2,description:'Investigar objetos, inscrições e fenômenos mágicos.'}],
 cards:[
 {id:'tyfar',name:'Livro de Tyfar',domain:'Códice / Codex',level:1,recall:2,spells:[
 {name:'Chama Selvagem',test:'Conjuração contra os alvos',range:'Corpo a corpo',effect:'Até três adversários. Cada alvo atingido sofre 2d6 de dano mágico e marca 1 Estresse.',cost:'',restriction:''},
 {name:'Mão Arcana',test:'',range:'Distante',effect:'Uma mão mágica com a força e o tamanho da sua própria mão.',cost:'',restriction:''},
 {name:'Névoa Misteriosa',test:'Conjuração (13)',range:'Muito próximo',effect:'Uma névoa temporária torna uma área fixa fortemente obscurecida.',cost:'',restriction:''}]},
 {id:'ava',name:'Livro de Ava',domain:'Códice / Codex',level:1,recall:2,spells:[
 {name:'Empurrão Mágico',test:'Conjuração contra o alvo',range:'Corpo a corpo → distante',effect:'No acerto, empurra o alvo até alcance distante e causa 1d10+2 de dano mágico neste nível.',cost:'',restriction:''},
 {name:'Armadura de Tava',test:'',range:'Toque',effect:'O alvo ganha +1 na pontuação de Armadura.',cost:'1 Esperança',restriction:'Até o próximo descanso do alvo ou até uma nova conjuração desta magia.'},
 {name:'Espinho de Gelo',test:'Conjuração (12) para criar; dificuldade do alvo para atacar',range:'Distante',effect:'Cria um grande espinho de gelo. Um ataque bem-sucedido causa 1d6 de dano físico neste nível.',cost:'',restriction:''}]},
 {id:'restaurador',name:'Toque Restaurador',domain:'Esplendor / Splendor',level:1,recall:1,spells:[
 {name:'Toque Restaurador',test:'',range:'Toque',effect:'Dedique alguns minutos ao cuidado de uma criatura para limpar 1 PV ou 1 Estresse. Ao aprender algo sobre ela ou revelar algo sobre si durante o cuidado, pode limpar 2 PV ou 2 Estresse em vez disso.',cost:'2 Esperança',restriction:'A melhora para 2 espaços pode ser usada uma vez por descanso longo.'}]}],
 abilities:[
 {name:'Prestidigitação',description:'Efeitos sutis e inofensivos à vontade, como luz, aromas e pequenos consertos.'},
 {name:'Não Dessa Vez',description:'Gastar 3 Esperança para um adversário distante ou mais próximo rerrolar ataque ou dano.'},
 {name:'Padrões Estranhos',description:'Ao tirar o número escolhido num dado de Dualidade, ganhar 1 Esperança ou limpar 1 Estresse. O número pode mudar no descanso longo.'},
 {name:'Talismã da Sorte',description:'Todo o grupo ganha 1 Esperança no início da sessão.'},
 {name:'Senso de Direção',description:'Pode rerrolar um 1 no dado de Esperança.'},
 {name:'Pés Leves',description:'Vantagem para mover-se sem ser ouvido.'},
 {name:'Promissor',description:'A carta adicional já está incluída nas três cartas iniciais.'},
 {name:'Adepto',description:'Ao usar uma Experiência, pode marcar 1 Estresse em vez de gastar Esperança, dobrando seu bônus para +4 naquela rolagem.'}],
 inventory:[
 {id:'cajado',name:'Conta-Mãe / Cajado',quantity:1,notes:'Cajado grande • Conhecimento • Muito distante • Duas mãos. 1d6 mágico. Poderoso: no acerto, rolar um dado extra e descartar o menor; no nível 1, 2d6 e ficar com o maior. O âmbar na ponta é narrativo, sem bônus adicional.'},
 {id:'couro',name:'Armadura de couro',quantity:1,notes:'Pontuação 3 • Limiares 7 / 14 no nível 1.'},
 {id:'tocha',name:'Tocha',quantity:1,notes:''},
 {id:'corda',name:'Corda',quantity:1,notes:'30 metros.'},
 {id:'suprimentos',name:'Suprimentos básicos',quantity:null,notes:''},
 {id:'ouro',name:'Um punhado de ouro',quantity:null,notes:'Para uma cama, um chá e talvez uma curiosidade.'},
 {id:'pocao',name:'Poção menor de cura',quantity:1,notes:''},
 {id:'contas',name:'Contas de feitiço',quantity:null,notes:'Madeira e âmbar. Símbolos e fórmulas gravados formam o grimório na barba.'},
 {id:'livro',name:'Livro antigo em tradução',quantity:1,notes:'“A importância do âmbar mágico nos hábitos de acasalamento do Draccus comum”. Pelo menos, Kote acha que é isso.'},
 {id:'adornos',name:'Chinelos e pequenos adornos',quantity:null,notes:'Brinco enorme, anéis e um jeito próprio de caminhar pelo mundo.'}],
 story:'Kote passou quase toda a vida na Vila Mellâmbar, dentro de uma árvore gigantesca. As moradias sobem cerca de 30 metros e descem outros 20 entre as raízes. A comunidade guardava uma reserva de âmbar mágico acumulada por gerações.\n\nJá velho, foi enganado por visitantes que descobriram o tesouro por meio de sua curiosidade. Recebidos amigavelmente, eles atacaram a vila à noite, roubaram o âmbar e fugiram. Houve poucas mortes, mas muita destruição. Kote foi responsabilizado e expulso. Alguns moradores acreditam nele; outros ainda o culpam.\n\nComeçou a estudar magia e procurar os ladrões. Já atrapalhou alguns de seus planos, mas é um mago iniciante e não consegue enfrentá-los sozinho. Faz bicos, busca informações e volta ocasionalmente para ajudar na reconstrução. Também passa tempo demais evitando sua casa e seus problemas. Quer recuperar o âmbar, limpar seu nome e aprender a aceitar ajuda.\n\nExtremamente curioso, inteligente, engraçado e acolhedor. Sua alegria é sincera, embora carregue um passado triste. Um chapéu enorme esconde seus olhos, e a barba branca vai até os pés. Ele percorre as contas com os dedos para lembrar as magias; o fragmento de âmbar no cajado brilha como mel.\n\nO sobrenome é um endereço: contando as grandes raízes em sentido horário a partir da entrada, a sétima leva à região onde a família mora. Mesmo exilado, continua se apresentando com o endereço de casa.',
 notes:''
};
export const freshCharacter = (): Character => structuredClone(initialCharacter);
