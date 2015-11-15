function stringToRGB(str) {
    var rgb = str.split("(")[1].split(")")[0].split(",");
    return { r: parseInt(rgb[0]), g: parseInt(rgb[1]), b: parseInt(rgb[2]) };
}

function rgbToHex(rgbObj) {
    return "#" + ((1 << 24) + (rgbObj.r << 16) + (rgbObj.g << 8) + rgbObj.b).toString(16).slice(1);
}