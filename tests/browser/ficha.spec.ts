import { test, expect } from '@playwright/test';
const key='kote.character.v1';
const saved=async(page:any)=>page.evaluate((key:string)=>JSON.parse(localStorage.getItem(key)||'null')?.character,key);
test('ficha, recursos, desfazer e persistência após recarregar',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/');
 await expect(page.getByRole('heading',{name:'Kvothe Sete-Raízes',exact:true})).toBeVisible();
 await expect(page.locator('.hope .resource-help')).toContainText('Não definida');
 await expect(page.getByLabel('Número de Padrões Estranhos')).toHaveValue('');
 await expect(page.locator('.trait').first()).toContainText('-1');
 await page.getByRole('button',{name:'Aumentar PV',exact:true}).click();
 expect((await saved(page)).resources.hp.value).toBe(1);
 await page.getByRole('button',{name:'↶ Desfazer'}).click();expect((await saved(page)).resources.hp.value).toBe(0);
 await page.getByRole('button',{name:'Definir zero',exact:true}).click();await page.reload();
 await expect(page.locator('.hope .resource-count')).toContainText('0');
 expect((await saved(page)).resources.hope.value).toBe(0);
 await page.getByRole('button',{name:'Deixar indefinida'}).click();
 await page.getByRole('button',{name:'PV: 5 de 5',exact:true}).click();
 await expect(page.getByRole('button',{name:'Aumentar PV',exact:true})).toBeDisabled();
 await page.getByLabel('Número de Padrões Estranhos').fill('9');await page.getByLabel('Número de Padrões Estranhos').press('Tab');
 await page.reload();expect((await saved(page)).resources.hp.value).toBe(5);await expect(page.getByLabel('Número de Padrões Estranhos')).toHaveValue('9');
 expect(errors).toEqual([]);
});
test('edição explícita, imagem original e conjuração usa conhecimento atual',async({page})=>{
 await page.goto('/');expect(await page.locator('.portrait-frame img').evaluate((i:HTMLImageElement)=>i.complete&&i.naturalWidth>0)).toBeTruthy();
 await page.getByRole('button',{name:'Editar ficha',exact:false}).click();
 const editor=page.locator('.editor-dialog');await expect(editor).toBeVisible();
 await editor.getByLabel('Conhecimento',{exact:true}).fill('5');await editor.getByLabel('Evasão',{exact:true}).fill('13');
 await editor.getByRole('button',{name:'Salvar alterações'}).click();await expect(editor).not.toBeVisible();
 await page.getByRole('button',{name:'Magias',exact:true}).click();
 await page.locator('.spell-card summary').first().click();
 const before=await saved(page);await page.getByRole('button',{name:'Abrir rolagem de Conjuração'}).first().click();
 await expect(page.getByLabel('Modificador',{exact:true})).toHaveValue('5');
 await page.getByRole('button',{name:'Rolar os dois d12'}).click();await expect(page.locator('.roll-result')).toBeVisible();
 expect((await saved(page)).resources).toEqual(before.resources);
 await page.locator('.physical-dice summary').click();
 await page.getByLabel('Esperança (1–12)').fill('10');await page.getByLabel('Medo (1–12)').fill('4');
 await page.getByRole('button',{name:'Registrar resultado'}).click();await expect(page.locator('.roll-result strong')).toHaveText('19');
});
test('três cartas, sete magias, busca e edição sem consumir recursos',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Definir zero',exact:true}).click();const before=await saved(page);
 await page.getByRole('button',{name:'Magias',exact:true}).click();await expect(page.locator('.spell-card')).toHaveCount(3);
 for(const summary of await page.locator('.spell-card>summary').all())await summary.click();
 await expect(page.locator('.spell')).toHaveCount(7);expect((await saved(page)).resources).toEqual(before.resources);
 await page.getByLabel('Buscar magia').fill('gelo');await expect(page.locator('.spell-card')).toHaveCount(1);
 await page.getByRole('button',{name:'Editar esta carta'}).click();
 await page.getByLabel('Nome da carta',{exact:true}).fill('Livro de Ava anotado');
 await page.getByRole('button',{name:'Salvar carta'}).click();await page.reload();await page.getByRole('button',{name:'Magias',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Livro de Ava anotado'})).toBeVisible();
});
test('inventário, confirmação de exclusão e anotações persistem',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Inventário',exact:true}).click();
 await page.getByRole('button',{name:'Adicionar item'}).click();await page.getByLabel('Nome',{exact:true}).fill('Mapa de âmbar');
 await page.getByLabel('Quantidade (opcional)').fill('2');await page.getByLabel('Observações',{exact:true}).fill('Encontrado na estrada.');
 await page.getByRole('button',{name:'Salvar item'}).click();await expect(page.getByRole('heading',{name:'Mapa de âmbar'})).toBeVisible();
 page.once('dialog',d=>d.dismiss());await page.getByRole('button',{name:'Remover Mapa de âmbar',exact:true}).click();await expect(page.getByRole('heading',{name:'Mapa de âmbar'})).toBeVisible();
 await page.getByRole('button',{name:'História & notas',exact:true}).click();
 await page.getByLabel('Anotações da sessão',{exact:true}).fill('Procurar o mercador na sétima raiz.');
 await page.reload();await page.getByRole('button',{name:'História & notas',exact:true}).click();await expect(page.getByLabel('Anotações da sessão')).toHaveValue('Procurar o mercador na sétima raiz.');
});
test('backup válido, backup inválido e cancelamento preservam a ficha',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Aumentar Estresse',exact:true}).click();const before=await saved(page);
 const download=page.waitForEvent('download');await page.getByRole('button',{name:'Exportar backup'}).click();expect((await download).suggestedFilename()).toMatch(/kote-backup.*json/);
 const file=page.locator('input[type=file][accept=".json,application/json"]');
 await file.setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from('{"version":1,"character":{}}')});
 await expect(page.locator('.toast')).toContainText('preservada');expect(await saved(page)).toEqual(before);
 const c=structuredClone(before);c.nickname='Kotinho';const valid={name:'backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({version:1,character:c}))};
 page.once('dialog',d=>d.dismiss());await file.setInputFiles(valid);expect((await saved(page)).nickname).toBe(before.nickname);
 page.once('dialog',d=>d.accept());await file.setInputFiles(valid);expect((await saved(page)).nickname).toBe('Kotinho');
 await page.reload();await expect(page.locator('.nickname')).toContainText('Kotinho');
});
test('falha de armazenamento é visível e mantém dados em memória',async({page})=>{
 await page.addInitScript(()=>{Storage.prototype.setItem=function(){throw new DOMException('Quota','QuotaExceededError');};});
 await page.goto('/');await page.getByRole('button',{name:'Aumentar PV',exact:true}).click();
 await expect(page.locator('.hp .resource-count')).toContainText('1');await expect(page.locator('.save-state')).toContainText('Não foi salvo');
});
test('layout responsivo, movimento reduzido e navegação por teclado',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 await page.keyboard.press('Tab');await expect(page.getByRole('link',{name:'Pular para a ficha'})).toBeFocused();
 for(const width of [320,390,768,1440]){
 await page.setViewportSize({width,height:900});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();
 await page.getByRole('button',{name:'Magias',exact:true}).click();await page.locator('.spell-card summary').first().click();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();
 await page.getByRole('button',{name:'Ficha',exact:true}).click();
 }
 await page.evaluate(()=>{(document.activeElement as HTMLElement)?.blur();window.scrollTo(0,0);});
 await page.screenshot({path:'test-results/kote-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:'test-results/kote-mobile.png',fullPage:true});
 expect(await page.locator('.page-content').evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
});
