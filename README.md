# Conversor de Moedas

Aplicação de conversão de moedas usando **TypeScript**, **Node.js** e **ExchangeRate-API**.

O projeto possui um backend HTTP e um frontend estático que pode ser publicado no GitHub Pages.

## 🌐 Projeto online

Acesse o conversor de moedas:

https://edmilson18.github.io/Conversor-de-Moedas/

## Funcionalidades

* Conversão entre as moedas disponíveis na ExchangeRate-API.
* Lista de moedas carregada dinamicamente pela API.
* Troca rápida entre moeda de origem e destino.
* Tratamento de erros com mensagens em português no frontend.
* API Key mantida somente no backend.

## Estrutura

* `src/` — backend/API em TypeScript.
* `frontend/` — frontend estático para GitHub Pages.
* `.env` — chave da ExchangeRate-API. Nunca publique esse arquivo.

## Rodando localmente

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env`:

```env
API_KEY=SUA_CHAVE_DA_EXCHANGERATE_API
```

Inicie o backend:

```bash
npm run dev
```

A API ficará disponível em:

```text
http://localhost:3000
```

No `frontend/config.js`, use:

```js
window.APP_CONFIG = {
    API_URL: "http://localhost:3000"
};
```

Depois abra o frontend usando um servidor local.

## Endpoints

### Listar moedas

```text
GET /api/currencies
```

Retorna as moedas suportadas pela ExchangeRate-API.

### Converter

```text
POST /api/convert
```

Exemplo de corpo:

```json
{
    "from": "BRL",
    "to": "USD",
    "amount": 100
}
```

## Hospedagem

O backend pode ser hospedado no Render e o frontend no GitHub Pages.

Depois de publicar o backend, altere `frontend/config.js`:

```js
window.APP_CONFIG = {
    API_URL: "https://seu-backend.onrender.com"
};
```

Não coloque a `API_KEY` no frontend. Ela deve permanecer somente como variável de ambiente no backend.

## Segurança

O arquivo `.env` está no `.gitignore` e não deve ser enviado ao GitHub.

Se uma API Key real tiver sido publicada ou compartilhada acidentalmente, gere uma nova chave na ExchangeRate-API.
