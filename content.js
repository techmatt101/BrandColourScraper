function stringToRGB(str) {
  var rgb = str.split("(")[1].split(")")[0].split(",");
    return { r: parseInt(rgb[0]), g: parseInt(rgb[1]), b: parseInt(rgb[2]) };
}

function rgbToHex(rgbObj) {
    return "#" + ((1 << 24) + (rgbObj.r << 16) + (rgbObj.g << 8) + rgbObj.b).toString(16).slice(1);
}

function Color(rgbObj) {
    this.r = rgbObj.r;
    this.g = rgbObj.g;
    this.b = rgbObj.b;
    this.hue = 0;
    this.sat = 0;

    var red = this.r / 255;
    var green = this.g / 255;
    var blue = this.b / 255;

    var max = Math.max.apply(Math, [red, green, blue]);
    var min = Math.min.apply(Math, [red, green, blue]);

    this.chr = max - min;
    this.val = max;

    if (this.val > 0) {
        this.sat = this.chr / this.val;
        if (this.sat > 0) {
            if (red == max) {
                this.hue = 60 * (((green - min) - (blue - min)) / this.chr);
                if (this.hue < 0) {
                    this.hue += 360;
                }
            } else if (green == max) {
                this.hue = 120 + 60 * (((blue - min) - (red - min)) / this.chr);
            } else if (blue == max) {
                this.hue = 240 + 60 * (((red - min) - (green - min)) / this.chr);
            }
        }
    }
}

function ColorCalculator() {
    this.colors = [];
    this.colorsTable = {};
}

ColorCalculator.prototype.getChildNodeColors = function(node) {
    var styles = getComputedStyle(node);
    this._scoreColor(styles.backgroundColor, 1);
    this._scoreColor(styles.borderColor, 0.5);
    this._scoreColor(styles.color, 0.8);

    for(var i = 0, l = node.children.length; i < l; i++) {
        this.getChildNodeColors(node.children[i]);
    }
}

ColorCalculator.prototype._scoreColor = function(color, weight) {
    if(color === "rgba(0, 0, 0, 0)") return; // filter out default no style

    var rgbColor = stringToRGB(color);
    var hexColor = rgbToHex(rgbColor);

    var colorField = this.colorsTable[hexColor];
    if(typeof colorField === 'undefined') {
        colorField = { color: new Color(rgbColor), score: 0 };
        this.colorsTable[hexColor] = colorField;
        this.colors.push(colorField);
    }

    colorField.score += weight;
}

ColorCalculator.prototype.getTopVibrantColors = function() {
    return this.colors
        .filter(function(x) { return x.color.sat > 0.2; })
        .sort(function(a,b) { return b.score - a.score; })
        .splice(0, 10)
        .map(function(x) { return x.color; });
}

ColorCalculator.prototype.getTopGreyScaleColors = function() {
    return this.colors
        .filter(function(x) { return x.color.sat <= 0.2; })
        .sort(function(a,b) { return b.score - a.score; })
        .splice(0, 10)
        .sort(function(a,b) { return a.color.luma - b.color.luma; })
        .map(function(x) { return x.color; });
}

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    var colorCalc = new ColorCalculator();
    colorCalc.getChildNodeColors(document.body);
    sendResponse(JSON.stringify(colorCalc.getTopVibrantColors().concat(colorCalc.getTopGreyScaleColors())));
});