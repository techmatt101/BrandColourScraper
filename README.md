# Brand Colour Scraper ![Logo](app//icons/icon_48.png) 
Chrome Extension: Find website brand colours

## API Example

``` js
var tabs;

window.addEventListener('brand-pages', function(response){
    tabs = response.detail;
    console.log(tabs);
    var colorRequest = new CustomEvent('brand-request-colors', { detail: { tabId: tabs[0].id }});
    window.dispatchEvent(colorRequest);
});

window.addEventListener('brand-colors', function(response){
    var colors = response.detail;
    console.log(colors);
});

var pagesRequest = new CustomEvent('brand-request-pages');
window.dispatchEvent(pagesRequest);
```