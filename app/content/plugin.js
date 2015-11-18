function Plugin() {}

Plugin.prototype.on = function(event, action) {
    var _self = this;
    window.addEventListener("brand-request-" + event, function(request) {
        action(request.detail, function(data) {
            _self.message(event, data);
        });
    });
};

Plugin.prototype.message = function (event, data) {
    window.dispatchEvent(new CustomEvent('brand-' + event, { detail: data }));
};