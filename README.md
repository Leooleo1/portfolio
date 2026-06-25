# Portfólio — Leonardo Lucena

Portfólio estático com `index.html`, `projeto.html`, CSS modular e dados centralizados em `js/projects.js`.

Sem build. Sem dependências de front-end. Pronto para GitHub e Railway.

## Estrutura

```text
.
├─ index.html
├─ projeto.html
├─ server.js
├─ railway.json
├─ css/
├─ js/
├─ assets/
├─ Projeto 1 Finance auditor/
├─ Projeto 2 Central Commander/
├─ Projeto 3 - Personal Ai/
├─ Projeto 4 Data by BI/
└─ projeto 5 fotos/
```

## Rodar local

```bash
npm start
```

Abre em `http://localhost:3000`.

## Editar conteúdo

Edite `js/projects.js`.

Esse arquivo controla:

- perfil
- links
- lista de projetos
- capas
- textos dos estudos de caso
- rodapé

## Subir para GitHub

```bash
git init
git add .
git commit -m "chore: prepare portfolio for github and railway"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git
git push -u origin main
```

## Publicar no Railway

1. Crie um projeto no Railway.
2. Conecte o repositório do GitHub.
3. O Railway vai usar `npm start`.
4. Depois do deploy, defina o domínio público.

## Observações

- Não precisa instalar dependência.
- O servidor Node existe só para servir os arquivos estáticos no Railway.
- Imagens com espaços e acentos continuam funcionando.
