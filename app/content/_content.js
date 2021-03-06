var plugin = new Plugin();

plugin.message('ready');

plugin.on('pages', function(request, reply) {
    chrome.runtime.sendMessage({ type: 'tabs' }, function(tabs) {
        reply({
            tabs: tabs
        });
    });
});

plugin.on('colors', function(request, reply) {
    chrome.runtime.sendMessage({ type: 'colors', tabId: request.tabId }, function(response) {
        reply(response);
    });
});

plugin.on('logos', function(request, reply) {
    chrome.runtime.sendMessage({ type: 'logos', tabId: request.tabId }, function(response) {
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
            colorCalc.optimizeResults();
            sendResponse({
                colorScores: colorCalc.getTopColors(),
                grayScaleColors: colorCalc.getTopGrayScaleColors()
            });
            break;

        case 'logos':
            sendResponse({
                logos: Images.getLogos().slice(0, 10)
            });
            break;
    }
});