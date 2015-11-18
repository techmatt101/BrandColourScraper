function ColorStylesBuilder(weights, defaultElementStyles) {
    this.colors = [];
    this.weights = weights;
    this.defaultElementStyles = defaultElementStyles;
}

ColorStylesBuilder.prototype.getColorsFromNode = function(node) {
    var styles = getComputedStyle(node);

    for(var style in this.weights) {
        if(styles[style] !== this.defaultElementStyles[style]) {
            this._scoreColor(styles[style], this.weights[style]);
        }
    }

    for (var n = 0, l = node.children.length; n < l; n++) {
        this.getColorsFromNode(node.children[n]);
    }
};

ColorStylesBuilder.prototype._scoreColor = function(colorValue, weight) {
    var color = Color.FromString(colorValue);
    var colorField = this.colors[color.hex];
    if (typeof colorField === 'undefined') {
        colorField = { color: color, score: 0 };
        this.colors[color.hex] = colorField;
        this.colors.push(colorField);
    }
    colorField.score += weight;
};

ColorStylesBuilder.prototype.getTopColors = function() {
    return this.colors
        .filter(function(x) {
            return x.color.sat > 0.1;
        })
        .sort(function(a, b) {
            return b.score - a.score;
        })
        .splice(0, 10)
        .map(function(x) {
            return x.color;
        });
};

ColorStylesBuilder.prototype.getTopGrayScaleColors = function() {
    return this.colors
        .filter(function(x) {
            return x.color.sat <= 0.1;
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

ColorStylesBuilder.getUserAgentDefaultStyles = function() {
    var tmp = document.createElement('default');
    tmp.style.all = 'initial';
    document.body.appendChild(tmp);
    return getComputedStyle(tmp);
};