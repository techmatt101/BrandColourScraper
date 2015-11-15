chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    var colorCalc = new ColorStylesBuilder({
        'color': 0.8,
        'borderColor': 0.5,
        'backgroundColor': 1
    }, getUserAgentDefaultStyles());

    colorCalc.getColorsFromNode(document.body);

    sendResponse(JSON.stringify({
        colors: colorCalc.getTopColors(),
        grayScaleColors: colorCalc.getTopGrayScaleColors()
    }));
});

function getUserAgentDefaultStyles() {
    var tmp = document.createElement('foo');
    tmp.style.all = 'initial';
    document.body.appendChild(tmp);
    return getComputedStyle(tmp);
}