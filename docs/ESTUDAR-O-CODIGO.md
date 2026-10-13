# Um caminho para estudar este código

Não é preciso estudar todos os arquivos de uma vez. Leia um pequeno trecho, explique com suas palavras e faça uma alteração reversível em uma branch de estudo.

## 1. Estrutura do HTML

Abra `index.html`. Procure `header`, `nav`, `main`, `section` e `footer`. Identifique qual conteúdo pertence a cada parte. Depois acompanhe a relação entre um link `href="#projetos"` e a seção com `id="projetos"`.

Exercício: mudar uma chamada textual em uma cópia de estudo, sem alterar classes ou IDs. Conferir a leitura no navegador.

## 2. Identidade no CSS

Abra `styles.css` e procure `:root`. Veja como `var(--ink)` e os outros tokens evitam repetir valores. Compare `grid-template-columns` com as media queries de 850 px e 600 px.

Exercício: alterar uma margem em uma branch, comparar desktop/mobile e desfazer se prejudicar a leitura. Não misturar esse estudo com o deploy.

## 3. JavaScript e o navegador

Em `script.js`, comece pelos seletores `$` e `$$`. Depois acompanhe `setTheme()` e o evento `click` do botão de tema. Estude só esse bloco antes de seguir para menu, filtros e galeria.

Perguntas: de onde vem o elemento? Qual evento dispara? Qual estado muda? O que fica visível para o usuário?

## 4. Formulário e dados

Procure `briefing-form`, `FormData` e `encodeURIComponent`. Siga um nome de campo do HTML até a montagem da mensagem. O formulário não envia dados para um servidor: ele prepara um texto para o visitante confirmar no WhatsApp.

Não publicar dados de clientes em exemplos, prints, testes ou commits.

## 5. Git e GitHub

Git registra versões; GitHub hospeda o repositório e facilita revisão e compartilhamento. Um commit deve representar uma alteração que você consiga explicar. Não é necessário alterar a página inteira para fazer um bom commit.

Exemplos de mensagens futuras:

- `Melhora o texto de apresentação do estúdio`
- `Ajusta o espaçamento do menu no celular`
- `Documenta o funcionamento do briefing`

Esses são exemplos, não commits já realizados.

## 6. Antes de publicar uma alteração

Execute `node --check script.js` e `node scripts/check.mjs .`. Depois confira no navegador: imagens, links, formulário, menu móvel, tema, filtros e galeria. Verifique o resultado no celular; um comando que passa não prova sozinho a qualidade da interface.
