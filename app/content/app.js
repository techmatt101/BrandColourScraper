chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    var colorCalc = new ColorCalculator();
    colorCalc.getChildNodeColors(document.body);
    sendResponse(JSON.stringify(colorCalc.getTopVibrantColors().concat(colorCalc.getTopGreyScaleColors())));
});