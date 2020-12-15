/* global chrome */

console.log('contentscript is here.');

const chrome = global.chrome;

const startContent = () => {
    const port = chrome.runtime.connect({name: 'contentScript'});

    port.postMessage({joke: 'Knock knock'});
    port.onMessage.addListener(function (msg) {
        console.log('contentScript:' + port.name, msg);
        if (msg.question == "Who's there?") {
            port.postMessage({answer: 'Madame'});
        } else if (msg.question == 'Madame who?') {
            port.postMessage({answer: 'Madame... Bovary'});
        }
    });
};

setTimeout(startContent, 2000);

function injectCustomJs(jsPath) {
    jsPath = jsPath || 'js/inject.js';
    var temp = document.createElement('script');
    temp.setAttribute('type', 'text/javascript');
    // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
    temp.src = chrome.extension.getURL(jsPath);
    temp.onload = function () {
        // 放在页面不好看，执行完后移除掉
        this.parentNode.removeChild(this);
    };
    document.head.appendChild(temp);
}

setTimeout(() => {
    injectCustomJs('js/inject.js');

    window.postMessage('hello', '*');
}, 1000);
