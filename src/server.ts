import http from "node:http";
import { convertCurrency, getCurrencies } from "./converter.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

function sendJson(
  res: http.ServerResponse,
  statusCode: number,
  data: unknown
) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "GET" && req.url === "/api/currencies") {
    try {
      const currencies = await getCurrencies();
      sendJson(res, 200, currencies);
    } catch (error) {
      console.error(error);
      sendJson(res, 500, {
        message: "Não foi possível carregar as moedas.",
      });
    }
    return;
  }

  if (req.method === "POST" && req.url === "/api/convert") {
    try {
      let body = "";

      for await (const chunk of req) {
        body += chunk;
      }

      let data: unknown;

      try {
        data = JSON.parse(body);
      } catch {
        sendJson(res, 400, {
          message: "Os dados enviados são inválidos.",
        });
        return;
      }

      const { from, to, amount } = data as {
        from?: unknown;
        to?: unknown;
        amount?: unknown;
      };

      if (
        typeof from !== "string" ||
        typeof to !== "string" ||
        typeof amount !== "number" ||
        !Number.isFinite(amount) ||
        amount <= 0
      ) {
        sendJson(res, 400, {
          message: "Informe um valor válido e selecione as moedas.",
        });
        return;
      }

      if (from.toUpperCase() === to.toUpperCase()) {
        sendJson(res, 400, {
          message: "Selecione moedas diferentes para realizar a conversão.",
        });
        return;
      }

      const conversion = await convertCurrency(from, to, amount);
      sendJson(res, 200, conversion);
    } catch (error) {
      console.error("Erro na rota /api/convert:", error);
      sendJson(res, 500, {
        message: "Não foi possível realizar a conversão.",
      });
    }
    return;
  }

  sendJson(res, 404, {
    message: "Rota não encontrada.",
  });
});

server.listen(PORT, () => {
  console.log(`API disponível na porta ${PORT}`);
});
