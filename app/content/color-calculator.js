function ColorCalculator() {
    this.colors = [];
    this.colorsTable = {};
}

ColorCalculator.prototype.getChildNodeColors = function(node) {
    var styles = getComputedStyle(node);
    this._scoreColor(styles.backgroundColor, 1);
    this._scoreColor(styles.borderColor, 0.5);
    this._scoreColor(styles.color, 0.8);

    for (var i = 0, l = node.children.length; i < l; i++) {
        this.getChildNodeColors(node.children[i]);
    }
};

ColorCalculator.prototype._scoreColor = function(color, weight) {
    if (color === "rgba(0, 0, 0, 0)") return; // filter out default no style

    var rgbColor = stringToRGB(color);
    var hexColor = rgbToHex(rgbColor);

    var colorField = this.colorsTable[hexColor];
    if (typeof colorField === 'undefined') {
        colorField = { color: new Color(rgbColor), score: 0 };
        this.colorsTable[hexColor] = colorField;
        this.colors.push(colorField);
    }

    colorField.score += weight;
};

ColorCalculator.prototype.getTopVibrantColors = function() {
    return this.colors
        .filter(function(x) {
            return x.color.sat > 0.2;
        })
        .sort(function(a, b) {
            return b.score - a.score;
        })
        .splice(0, 10)
        .map(function(x) {
            return x.color;
        });
};

ColorCalculator.prototype.getTopGreyScaleColors = function() {
    return this.colors
        .filter(function(x) {
            return x.color.sat <= 0.2;
        })
        .sort(function(a, b) {
            return b.score - a.score;
        })
        .splice(0, 5)
        .sort(function(a, b) {
            return a.color.luma - b.color.luma;
        })
        .map(function(x) {
            return x.color;
        });
};