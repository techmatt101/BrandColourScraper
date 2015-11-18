function ColorStylesBuilder(weights, defaultElementStyles) {
    this.colorScores = [];
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
    var color = Color.fromString(colorValue);
    var colorField = this.colorScores[color.hex];
    if (typeof colorField === 'undefined') {
        if (typeof colorField === 'undefined') {
            colorField = { color: color, score: 0 };
            this.colorScores[color.hex] = colorField;
            this.colorScores.push(colorField);
        }
    }
    colorField.score += weight;
};

ColorStylesBuilder.prototype.optimizeResults = function() {
    this.colorScores = this.colorScores.sort(function(a, b) {
        return b.score - a.score;
    });

    var i = this.colorScores.length - 1;
    while(i > 0) {
        for (var j = 0; j < this.colorScores.length; j++) {
            if(i === j) return;
            if(Color.isSimilar(this.colorScores[i].color, this.colorScores[j].color)) {
                this.colorScores[j].score += this.colorScores[i].score;
                this.colorScores.splice(i, 1);
                i--;
                break;
            }
        }
        i--;
    }
};

ColorStylesBuilder.prototype.getTopColors = function() {
    return this.colorScores
        .filter(function(x) {
            return x.color.sat > 0.1;
        })
        .splice(0, 10)
        .map(function(x) {
            return x.color;
        });
};

ColorStylesBuilder.prototype.getTopGrayScaleColors = function() {
    return this.colorScores
        .filter(function(x) {
            return x.color.sat <= 0.1;
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