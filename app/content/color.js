function Color(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.hue = 0;
    this.sat = 0;

    var red = this.r / 255;
    var green = this.g / 255;
    var blue = this.b / 255;

    var max = Math.max(red, green, blue);
    var min = Math.min(red, green, blue);

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

Color.prototype.toHex = function() {
    return "#" + ((1 << 24) + (this.r << 16) + (this.g << 8) + this.b).toString(16).slice(1);
};

Color.FromString = function(str) {
    var rgb = str.split("(")[1].split(")")[0].split(",");
    return new Color(parseInt(rgb[0]), parseInt(rgb[1]), parseInt(rgb[2]));
};