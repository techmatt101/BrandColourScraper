document.addEventListener('DOMContentLoaded', function() {
    chrome.tabs.getSelected(null, function(tab) {
      chrome.tabs.sendMessage(tab.id, { type: 'colors' }, displayColors);
      chrome.tabs.sendMessage(tab.id, { type: 'logos' }, displayImages);
    });
}, false);

function displayImages(response) {
    var docfrag = document.createDocumentFragment();
    for (var i = 0; i < response.logos.length; i++) {
        var img = new Image();
        img.src = response.logos[i];
        img.className = 'img';
        docfrag.appendChild(img);
    }
    document.body.appendChild(docfrag);
}

function displayColors(response) {
    renderColors(response.colors.concat(response.grayScaleColors));
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

    element.addEventListener('click', function() {
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

function contrast(color) {
    var brightness;
    brightness = (color.r * 299) + (color.g * 587) + (color.b * 114);
    brightness = brightness / 255000;
    return (brightness >= 0.5) ?  "#000000" : "#ffffff";
}

function rgbToHex(color) {
    return "#" + ((1 << 24) + (color.r << 16) + (color.g << 8) + color.b).toString(16).slice(1);
}