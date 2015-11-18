chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(!request.type) return;
    switch(request.type.toLowerCase()) {
        case 'tabs':
            chrome.tabs.getAllInWindow(null, function(tabs) {
                sendResponse(tabs.map(function(tab) {
                    return {
                        id: tab.id,
                        title: tab.title,
                        favIconUrl: tab.favIconUrl
                    };
                }));
            });
            return true;

        case 'colors':
            chrome.tabs.sendMessage(request.tabId, { type: 'colors' }, function(response) {
                sendResponse(response);
            });
            return true;
    }
});