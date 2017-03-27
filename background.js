chrome.webRequest.onCompleted.addListener(function (details) {
    var result = details.url.match("https://catalog.api.onliner.by/search/.*");
    if (result != null) {
        setTimeout(SetupPrices(),3000);
    }

}, {
    urls: ["https://catalog.onliner.by/*", "https://catalog.api.onliner.by/*"],
    types: ["xmlhttprequest"]},["responseHeaders"]
);

function SetupPrices() {
    $(".schema-product__price-value span").each(function(i,e){alert(e.text);});
}