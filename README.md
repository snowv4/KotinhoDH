# Kote • Caderno de viagem

Ficha pessoal de Kvothe (Kote) Sete-Raízes em **Angular 21 + TypeScript**, com componentes standalone, signals e atualização sem Zone.js. Funciona localmente, sem conta, backend ou serviço pago.

## Abrir no Windows

Dê dois cliques em **Iniciar Kote.cmd** nesta pasta. O script usa o Node.js portátil em `.tools`, inicia o Angular e abre o navegador em **http://127.0.0.1:4200**. Mantenha o terminal aberto enquanto joga; Ctrl+C encerra o servidor.

Alternativa no PowerShell:

```powershell
.\iniciar.ps1
```

Se a política do PowerShell bloquear o arquivo, use o atalho `Iniciar Kote.cmd`, que aplica a opção de execução apenas àquele processo.

## Instalação em outro computador

Instale Node.js 24 LTS e, na pasta do projeto, execute:

```powershell
npm.cmd ci
npm.cmd start -- --open
```

As dependências estão fixadas em `package-lock.json`. A compatibilidade foi conferida na [documentação oficial do Angular](https://angular.dev/reference/versions); o ambiente desta entrega usa Node.js 24.22.0. No Linux/macOS, use `npm` no lugar de `npm.cmd`.

## Durante a sessão

- **Ficha:** atributos, defesas, experiências e habilidades. Use **Editar ficha** para mudar os valores, nome, retrato e capacidades.
- **Recursos:** PV e Estresse são espaços **marcados**, Armadura são espaços **usados**, Esperança é a quantidade **disponível**. Use os marcadores, + e −. **Desfazer** reverte a última alteração de recursos.
- **Esperança** começa não definida, diferente de zero. **Padrões Estranhos** começa vazio e aceita inteiros de 1 a 12.
- **Magias:** três cartas com sete magias. Busque, expanda e edite os textos. O custo de troca está separado do custo de cada magia.
- **Inventário:** adicione, edite e remova itens; quantidade pode ficar em branco.
- **História & notas:** história editável e anotações salvas enquanto você escreve.
- **Rolagens:** dois d12 distintos, modificador editável, entrada de dados físicos e histórico das oito últimas rolagens da visita. Abrir Conjuração lê o Conhecimento atual. Resultados não aplicam efeitos automaticamente.

## Salvamento e backup

As alterações ficam no `localStorage` deste navegador e origem (endereço + porta). Use sempre o mesmo endereço para encontrar a mesma ficha. Não há sincronização entre dispositivos, perfis, navegadores ou abas.

O rodapé informa o resultado real do salvamento. Se o armazenamento estiver indisponível ou cheio, os dados continuam na memória da página e **você precisa exportar um backup antes de fechar ou recarregar**.

**Exportar backup** baixa um JSON de formato versão 1. **Importar** valida todo o conteúdo antes de pedir confirmação para substituir a ficha. Um arquivo inválido não substitui a sessão. Limite: 4 MB. O retrato personalizado é incluído no backup; o original acompanha o site.

Para usar outro computador, exporte o JSON e importe na outra instalação. Não limpe os dados do navegador antes de guardar o backup. Abrir outra porta não apaga os dados antigos, mas cria uma origem diferente.

## Organização

- `src/app/initial-data.ts`: dados iniciais, história e cartas, separados da sessão.
- `src/app/model.ts`: tipos, limites, validação de backup e operações de recursos.
- `src/app/character.store.ts`: estado central, persistência e desfazer.
- `src/app/*component.ts`: ficha, recursos, magias, inventário, diário e dados.
- `src/styles.css`: visual responsivo e animações com `prefers-reduced-motion`.
- `public/kote-original.png`: retrato extraído sem alteração da ficha PDF fornecida.
- `tests/`: verificações de estado e fluxos no navegador.

## Verificações

```powershell
npm.cmd run build
npm.cmd test
npm.cmd run test:browser
```

Os testes de navegador usam Microsoft Edge instalado e um servidor temporário em 127.0.0.1:4173, encerrado ao concluir. Execute o build antes deles. As capturas ficam em `test-results/`.

Se usar o Node portátil manualmente no terminal:

```powershell
$env:Path = (Join-Path $PWD '.tools\node-v24.22.0-win-x64') + ';' + $env:Path
npm.cmd run build
npm.cmd test
npm.cmd run test:browser
```

A versão compilada fica em `dist/kote/browser` e precisa de um servidor HTTP; não abra `index.html` diretamente pelo sistema de arquivos. Para servir o build local:

```powershell
node scripts/serve.mjs
```

## Fontes e limites

História e atributos: **Resumo kotinho.pdf**. Experiências, inventário, resumos de habilidades e retrato: **Kvothe_Sete_Raizes_Ficha.pdf**. Escopo e organização: **Kote_Instrucoes_Codex_Angular.md**. Agilidade −1 e Força 0 seguem o resumo mais recente.

Os textos das cartas são resumos fornecidos pelo jogador, não transcrições oficiais conferidas. Não há automação de dano, cura, descanso, habilidades, progressão ou custos de magia. Confira as cartas ou o [SRD oficial](https://www.daggerheart.com/srd/) ao resolver regras. Alterar o nível não atualiza automaticamente os efeitos escritos para nível 1.

O histórico de dados é temporário; ficha, cartas, inventário, história e notas são persistentes. Excluir itens e restaurar os dados iniciais pedem confirmação. Reduzir uma capacidade limita os espaços marcados à nova capacidade.

Entrega local; nenhuma publicação ou contratação de serviço foi feita.

## Resultado da validação desta entrega

Verificado em 19/10/2026:

- Build de produção concluído sem erros.
- 7 testes de modelo/persistência e 7 testes de navegador aprovados.
- Layout conferido em larguras de 320, 390, 768 e 1440 px, sem overflow horizontal nos fluxos testados.
- Edição, desfazer, recarregamento, cartas, inventário, anotações, backups e armazenamento indisponível verificados no Edge.
- Navegação inicial por teclado e preferência por movimento reduzido verificadas.
- `npm start` validado: HTTP 200, ficha renderizada e alteração de PV sem erros no navegador.
- Contraste da tinta secundária sobre o papel: 4,67:1; do âmbar usado em texto: 5,11:1.
- Os servidores de verificação foram encerrados. Use **Iniciar Kote.cmd** para abrir sua sessão.
