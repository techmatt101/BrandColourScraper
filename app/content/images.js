function Images() {}

Images.getLogos = function() {
    var logos = [];
    var images = document.images;
    for (var i = 0, l = images.length; i < l; i++) {
        var img = images[i].src;
        if (/logo/i.test(img)) {
            logos.push(img);
        }
    }

    var elements = document.getElementsByTagName('*');
    for (i = 0, l = elements.length; i < l; i++) {
        var bgImage = getComputedStyle(elements[i]).backgroundImage;
        if (/logo/i.test(bgImage)) {
            logos.push(/url\(['"]?([^")]+)/.exec(bgImage)[1]);
        }
    }

    return logos;
};