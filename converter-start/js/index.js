import variables from "./variables.js";
import state from "./state.js";
import { handleChange } from "./convert.js";
import { fetchLatest } from "./single.js";

const { selects, success, tabs } = variables;

const renderCodeList = () => {
  selects.forEach((select) => {
    const selectType = select.getAttribute("data-select-type");
    state.codes.forEach(([code]) => {
      const element = document.createElement("option");
      element.selected = code === state.pair[selectType];
      element.value = code;
      element.innerText = code;
      select.insertAdjacentElement("beforeend", element);
    });

    const name = select.getAttribute("name");
    name && select.addEventListener("change", handleChange);
  });
};

export const fetchCodes = async () => {
  try {
    const response = await fetch(`${state.url}/codes`);
    const data = await response.json();
    // Деструкторизация, нужно выбрать 3 валюты
    if (data.result === success) {
      state.codes = data.supported_codes.filter((codeData) => {
        return ["USD", "RUB", "THB"].includes(codeData[0]);
      });

      renderCodeList();
      fetchLatest();
    }
  } catch (err) {
    console.log(err);
  }
};

export const handleTabClick = ({ currentTarget: target }) => {
  const { tab } = target.dataset;
  const children = document.querySelectorAll(".content");

  if (!tab || tab === state.currentTab) return;

  tabs.forEach((item) => item.classList.remove("active"));
  target.classList.add("active");

  for (const child of children) {
    if (child.dataset.child === tab) child.classList.add("show");
    else child.classList.remove("show");
  }

  state.currentTab = tab;
};

// if (number < 1) else number * 1.1
// if (number > 1) else number * 0.9
