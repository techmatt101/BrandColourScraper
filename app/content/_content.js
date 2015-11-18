var plugin = new Plugin();

plugin.message('ready');

plugin.on('pages', function(request, reply) {
    chrome.runtime.sendMessage({ type: 'tabs' }, function(tabs) {
        reply(tabs);
    });
});

plugin.on('colors', function(request, reply) {
    console.log(request);
    chrome.runtime.sendMessage({ type: 'colors', tabId: request.tabId }, function(response) {
        reply(response);
    });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(!request.type) return;
    switch(request.type.toLowerCase()) {
        case 'colors':
            var colorCalc = new ColorStylesBuilder({
                'color': 0.8,
                'borderColor': 0.5,
                'backgroundColor': 1
            }, ColorStylesBuilder.getUserAgentDefaultStyles());

            colorCalc.getColorsFromNode(document.body);
            sendResponse({
                colors: colorCalc.getTopColors(),
                grayScaleColors: colorCalc.getTopGrayScaleColors()
            });
            break;
    }
});