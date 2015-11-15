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