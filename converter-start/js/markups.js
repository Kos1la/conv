import state from "./state.js";
import { getFullTitle } from "./utils.js";

export const renderResultUsd = ({ code, amount, full }) => {
  return ` <div class="form-results__item-icon icon">
        <img src="images/arrow down.png" alt="" />
        </div>
        <div class="form-result__item-titles">
              <div class="form-result__item-title">${code}</div>
                 <div class="form-result__item-full">
                      ${full}
                       </div>
                      </div>
                      <div class="form-result__item-value">${amount.toFixed(
                        2
                      )}</div>`;
};

export const renderResultEur = ({ code, amount, full }) => {
  return `
         <div class="form-results__item-icon icon">
                              <img src="images/icons8-up-67.png" alt="" />
                            </div>
                            <div class="form-result__item-titles">
                              <div class="form-result__item-title">${code}</div>
                              <div class="form-result__item-full">${full}</div>
                            </div>
                            <div class="form-result__item-value">${amount.toFixed(
                              2
                            )}</div> 
      `;
};

const getCurrencyItemAction = (isBase) => {
  const {
    actions: { remove, change },
  } = state;
  const actionName = isBase ? change : remove;

  return `  <button data-action="${actionName}" class="currency-${actionName}  currency-button">
    ${actionName}
  </button>`;
};

export const renderCurrencyItem = ({ code, base_code: fromCode, rate = 1 }) => {
  const isBase = code === fromCode;
  const action = getCurrencyItemAction(isBase);
  const full = getFullTitle(state.codes, code);
  return `  <div class="currency-item ${
    isBase ? "currency-current" : ""
  }" data-item="${code}">
                <div class="currency-titles">
                <div class="currency-title">${code}</div>
                <div class="currency-full">${full}</div>
                </div>
                <div class="currency-amount">${rate.toFixed(2)}</div>
                <div class="currency-action">${action}
                </div>
            </div>`;
};
