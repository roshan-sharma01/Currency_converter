const BASE_URL = "Your api key";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns
for (let select of dropdowns) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;

        if (select.name === "from" && currCode === "USD") {
            newOption.selected = true;
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = true;
        }

        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
        updateExchangeRate();
    });
}

// Update flag
function updateFlag(element) {
    let currCode = element.value;
    let countryCode = countryList[currCode];

    let img = element.parentElement.querySelector("img");
    img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
}

// Fetch and display exchange rate
async function updateExchangeRate() {
    let amount = document.querySelector(".amount input");
    let amtVal = Number(amount.value);

    if (amtVal === "" || amtVal < 1 || isNaN(amtVal)) {
        amtVal = 1;
        amount.value = "1";
    }

    const from = fromCurr.value;
    const to = toCurr.value;

    const URL = `${BASE_URL}/${from}/${to}`;

    try {
        const response = await fetch(URL);

        if (!response.ok) {
            throw new Error("Failed to fetch exchange rate.");
        }

        const data = await response.json();

        const rate = data.rate;
        const finalAmount = (amtVal * rate).toFixed(2);

        msg.innerText = `${amtVal} ${from} = ${finalAmount} ${to}`;

    } catch (error) {
        console.error(error);
        msg.innerText = "Unable to fetch exchange rate.";
    }
}

// Button click
btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

// Run once when page loads
window.addEventListener("load", () => {
    updateExchangeRate();
});