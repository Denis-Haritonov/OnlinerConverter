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
                    var dollarPrice = parseFloat(match.toString().replace(',', '.')) / options.currencyRate;
                    newText = newText.replace("xxx", dollarPrice.toFixed(2));
                }
            } while (match);

            $(priceTextElement).empty().append($("<span>" + priceText + "</span>" + "<br>" + "<span>" + newText + "</span>"))
        });
    })
}

function setup() {
    $("#schema-filter .schema-filter__fieldset:eq(2)").append($('<div class="schema-filter__group" style="margin-top:10px"><div class="schema-filter-control schema-filter-control_input"><input class="schema-filter-control__item schema-filter__number-input schema-filter__number-input_price" id ="dollarSelectMinPrice" type="number" placeholder="\u043E\u0442 $"><span class="schema-filter-control__shadow"></span></div><div class="schema-filter-control schema-filter-control_input"><input class="schema-filter-control__item schema-filter__number-input schema-filter__number-input_price" id ="dollarSelectMaxPrice" type="number" placeholder="\u0434\u043E $"><span class="schema-filter-control__shadow"></span></div></div>'));
    $("#dollarSelectMinPrice").change(function () {
        if ($(this).val()) {
            var valueInRouble = (parseFloat($(this).val()) * options.currencyRate).toFixed(2).replace(".", ",")
            $("#schema-filter .schema-filter__fieldset:eq(2) .schema-filter__number-input_price:eq(0)").val(valueInRouble);
        }
        else {
            $("#schema-filter .schema-filter__fieldset:eq(2) .schema-filter__number-input_price:eq(0)").val('');
        }
    });

    $("#dollarSelectMaxPrice").change(function () {
        if ($(this).val()) {
            var valueInRouble = (parseFloat($(this).val()) * options.currencyRate).toFixed(2).replace(".", ",")
            $("#schema-filter .schema-filter__fieldset:eq(2) .schema-filter__number-input_price:eq(1)").val(valueInRouble);
        }
        else {
            $("#schema-filter .schema-filter__fieldset:eq(2) .schema-filter__number-input_price:eq(1)").val('');
        }
    });
}

$(function () {
    setup();
    setupPrices();
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        setupPrices();
    });
});