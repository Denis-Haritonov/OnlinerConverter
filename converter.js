var options = {
    priceElements: [
        { selector: ".schema-product__price span", format: "\u043E\u0442 xxx $" },
        { selector: ".offers-description__price_primary", format: "xxx - xxx $" },
        { selector: ".offers-description__price_secondary a", format: "xxx $" },
        { selector: ".product-aside__price--primary", format: "xxx $" },
        { selector: ".cart-product__price-value.cart-product__price-value_primary", format: "xxx $" },

        { selector: ".price.price-primary a", format: "xxx $" },
        { selector: ".product-summary__price-value.product-summary__price-value_primary", format: "xxx $" }

    ],
    currentPriceRegex: /[0-9]*,[0-9]{2,4}/g,
    currencyCurseElementId: "#currency-informer a",
    currencyRate: null,
    currencyCurseGetUrl: "",
    currencyCurseGetResponseOption: "",
};

function setupCurrencyRate() {
    if (options.currencyRate == null) {
        options.currencyRate = parseFloat(options.currentPriceRegex.exec($(options.currencyCurseElementId).text()).toString().replace(',', '.'));
        options.currentPriceRegex.lastIndex = 0;
    }
}

function setupPrices() {
    setupCurrencyRate();

    var elements = options.priceElements;
    elements.forEach(function (priceElement, i, elements) {
        var priceTextArray = $(priceElement.selector)
        priceTextArray.each(function (i, priceTextElement) {
            var priceText = $(priceTextElement).text();
            var newText = priceElement.format;
            do {
                var match = options.currentPriceRegex.exec(priceText);
                if (match) {
                    var dollarPrice = parseFloat(match.toString().replace(',', '.')) /options.currencyRate;
                    newText = newText.replace("xxx", dollarPrice.toFixed(2));
                }
            } while (match);

            $(priceTextElement).empty().append($("<span>" + priceText + "</span>" + "<br>" + "<span>" + newText + "</span>"))
        });

    }
    )
}


$(function () {
    setupPrices();
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        setupPrices();
    });
});