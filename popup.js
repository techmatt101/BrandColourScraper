document.addEventListener('DOMContentLoaded', function() {
    chrome.tabs.getSelected(null, function(tab) {
      chrome.tabs.sendMessage(tab.id, {text: 'report_back'}, displayResults);
    });
}, false);

function displayResults(colors) {
    renderColors(JSON.parse(colors));
}

function renderColors(colors) {
    var docfrag = document.createDocumentFragment();
    for (var i = 0; i < colors.length; i++) {
        docfrag.appendChild(createColor(colors[i]));
    }
    document.body.appendChild(docfrag);
}

function createColor(color) {
    var hex = rgbToHex(color);
    var element = document.createElement('div');

    element.className = "color";
    element.style.backgroundColor = hex;
    element.style.color = contrast(color);
    element.textContent = hex;

    element.addEventListener('click', function(event) {  
      try { 
        var range = document.createRange();  
        range.selectNode(element);  
        window.getSelection().addRange(range);  
        document.execCommand('copy');
        window.getSelection().removeAllRanges();  
      } catch(err) {}  
    });

    return element;
}

function contrast(rgbObj) {
    var brightness;
    brightness = (rgbObj.r * 299) + (rgbObj.g * 587) + (rgbObj.b * 114);
    brightness = brightness / 255000;
    return (brightness >= 0.5) ?  "#000000" : "#ffffff";
}

function rgbToHex(rgbObj) {
    return "#" + ((1 << 24) + (rgbObj.r << 16) + (rgbObj.g << 8) + rgbObj.b).toString(16).slice(1);
}