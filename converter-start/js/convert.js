import { renderResultEur, renderResultUsd } from "./markups.js";
import state from "./state.js";
import { convertTime, formatToCurrency, getFullTitle } from "./utils.js";
import variables from "./variables.js";

const { success, formResults, rateConversion, rateLast, toSelect, fromSelect } =
  variables;

export const handleChange = ({ target: { value, name } }) => {
  state.pair = {
    ...state.pair,
    [name]: value,
  };
};

export const handleInput = ({ target: { value, name } }) => {
  state[name] = Number(value);
};

const insertResults = (
  amount,
  {
    base_code: fromCode,
    target_code: toCode,
    conversion_rate: rate,
    time_last_update_utc: time,
  }
) => {
  const resultRate = rate > 1 ? rate * 1.05 : rate * 0.95;
  const result = rate * amount;
  const from = {
    code: fromCode,
    amount: state.amount,
    full: getFullTitle(state.codes, fromCode),
  };
  const to = {
    code: toCode,
    amount: resultRate * amount,
    full: getFullTitle(state.codes, toCode),
  };

  resultFrom.innerHTML = renderResultUsd(from);
  resultTo.innerHTML = renderResultEur(to);

  const fromValue = formatToCurrency(fromCode, 1);
  const toValue = formatToCurrency(toCode, resultRate);

  rateConversion.innerText = `${fromValue} = ${toValue}`;
  rateLast.innerText = `Обновлен ${convertTime(time)}`;

  formResults.classList.add("show");
};

export const handleSubmit = async (e) => {
  e?.preventDefault();

  const {
    url,
    amount,
    pair: { from, to },
  } = state;

  state.loading = true;

  if (!amount || !from || !to) return;

  try {
    const response = await fetch(`${url}/pair/${from}/${to}`);
    const data = await response.json();

    if (data.result === success) insertResults(amount, data);

    state.loading = false;
  } catch (err) {
    console.log(err);
  }
};

export const switchCurrencies = () => {
  const {
    pair: { to, from },
  } = state;
  if (!to || !from) return;

  state.pair = {
    to: from,
    from: to,
  };

  toSelect.value = from;
  fromSelect.value = to;
};
