# Frontend — GitHub Pages

Este frontend é estático e pode ser publicado no GitHub Pages.

## Configuração

Edite `config.js` com a URL pública do backend:

```js
window.APP_CONFIG = {
  API_URL: "https://seu-backend.onrender.com"
};
```

Não coloque a `API_KEY` aqui.

O frontend carrega automaticamente todas as moedas disponibilizadas pela API através de:

```text
GET /api/currencies
```

As mensagens exibidas ao usuário são apresentadas em português. Detalhes técnicos continuam sendo enviados ao console para facilitar a manutenção.

## GitHub Pages

O repositório pode usar GitHub Actions para publicar somente a pasta `frontend/`.
