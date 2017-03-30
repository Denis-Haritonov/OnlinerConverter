chrome.webRequest.onCompleted.addListener(function (details) {
    var result = details.url.match("https://catalog.api.onliner.by/search/.");
    if (result != null) {
        chrome.tabs.sendMessage(details.tabId, {
            identificador: "Go"
        });
    }
},{
    urls: ["https://catalog.onliner.by/*", "https://catalog.api.onliner.by/*"],
    types: ["xmlhttprequest"]
}, ["responseHeaders"]
);


function checkForValidUrl(tabId, changeInfo, tab) {
    if (tab.url.indexOf('onliner.by') > 0) {
        chrome.pageAction.show(tabId);
    }
};

chrome.tabs.onUpdated.addListener(checkForValidUrl);