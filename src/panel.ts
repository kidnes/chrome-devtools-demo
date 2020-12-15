console.log('panel is here.');

// const chrome = global.chrome;
function initConnect() {
    const tabId = chrome.devtools.inspectedWindow.tabId;

    const port = chrome.runtime.connect({name: String(tabId)});

    port.postMessage({joke: 'Knock knock'});
    port.onMessage.addListener(function (msg) {
        console.log('panel:', msg);
        if (msg.question == "Who's there?") {
            port.postMessage({answer: 'Madame'});
        } else if (msg.question == 'Madame who?') {
            port.postMessage({answer: 'Madame... Bovary'});
        }
    });
};

function init() {
    initConnect();
}

setTimeout(init, 2000);

