const form = document.querySelector("#converter-form");
const amountInput = document.querySelector("#amount");
const fromSelect = document.querySelector("#from");
const toSelect = document.querySelector("#to");
const swapButton = document.querySelector("#swap");
const status = document.querySelector("#status");
const result = document.querySelector("#result");
const converted = document.querySelector("#converted");
const rate = document.querySelector("#rate");
const convertButton = form.querySelector(".convert");

const API_URL = (window.APP_CONFIG?.API_URL || "").replace(/\/$/, "");

function showError(message) {
  status.textContent = message;
  status.hidden = false;
  result.hidden = true;
}

function clearMessage() {
  status.hidden = true;
  status.textContent = "";
}

function setLoading(button, loading, text = "Converter") {
  button.disabled = loading;
  button.textContent = loading ? "Convertendo..." : text;
}

function createCurrencyOption(currency) {
  const option = document.createElement("option");
  option.value = currency.code;
  option.textContent = `${currency.code} - ${currency.name}`;
  return option;
}

async function loadCurrencies() {
  if (!API_URL) {
    showError("A URL da API ainda não foi configurada.");
    return;
  }

  fromSelect.disabled = true;
  toSelect.disabled = true;
  swapButton.disabled = true;
  convertButton.disabled = true;

  fromSelect.innerHTML = '<option value="">Carregando moedas...</option>';
  toSelect.innerHTML = '<option value="">Carregando moedas...</option>';

  try {
    const response = await fetch(`${API_URL}/api/currencies`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Nenhuma moeda disponível.");
    }

    fromSelect.innerHTML = "";
    toSelect.innerHTML = "";

    data.forEach((currency) => {
      fromSelect.appendChild(createCurrencyOption(currency));
      toSelect.appendChild(createCurrencyOption(currency));
    });

    fromSelect.value = data.some((currency) => currency.code === "BRL")
      ? "BRL"
      : data[0].code;

    toSelect.value = data.some((currency) => currency.code === "USD")
      ? "USD"
      : data[1]?.code || data[0].code;

    fromSelect.disabled = false;
    toSelect.disabled = false;
    swapButton.disabled = false;
    convertButton.disabled = false;
    clearMessage();
  } catch (error) {
    console.error("Erro ao carregar moedas:", error);
    showError(
      "Não foi possível carregar as moedas. Tente novamente mais tarde."
    );
  }
}

swapButton.addEventListener("click", () => {
  const currentFrom = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = currentFrom;
  clearMessage();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearMessage();

  const amount = Number(amountInput.value);
  const from = fromSelect.value;
  const to = toSelect.value;

  if (!amountInput.value || !Number.isFinite(amount) || amount <= 0) {
    showError("Informe um valor maior que zero.");
    return;
  }

  if (!from || !to) {
    showError("Selecione as moedas para realizar a conversão.");
    return;
  }

  if (from === to) {
    showError("Selecione moedas diferentes para realizar a conversão.");
    return;
  }

  if (!API_URL) {
    showError("A URL da API ainda não foi configurada.");
    return;
  }

  setLoading(convertButton, true);

  try {
    const response = await fetch(`${API_URL}/api/convert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, amount }),
    });

    let data;

    try {
      data = await response.json();
    } catch {
      throw new Error("Não foi possível interpretar a resposta do servidor.");
    }

    if (!response.ok) {
      throw new Error(data.message);
    }

    converted.textContent = `${data.amount} ${data.from} = ${data.convertedAmount} ${data.to}`;
    rate.textContent = `1 ${data.from} = ${data.rate} ${data.to}`;
    result.hidden = false;
  } catch (error) {
    console.error("Erro na conversão:", error);

    if (error instanceof TypeError) {
      showError(
        "Não foi possível conectar ao serviço de conversão. Tente novamente mais tarde."
      );
    } else {
      showError(
        error instanceof Error
          ? error.message
          : "Não foi possível realizar a conversão. Tente novamente."
      );
    }
  } finally {
    setLoading(convertButton, false);
  }
});

loadCurrencies();
