console.log('backgroud is here.');

const chrome = global.chrome;
function initConnect() {
    chrome.runtime.onConnect.addListener(function (port) {
        console.log(`${port.name} on Connected`);
        port.onMessage.addListener(function (msg) {
            console.log('background:' + port.name, msg);
            if (msg.joke === 'Knock knock') {
                port.postMessage({question: "Who's there?"});
            } else if (msg.answer === 'Madame') {
                port.postMessage({question: 'Madame who?'});
            } else if (msg.answer === 'Madame... Bovary') {
                port.postMessage({question: "I don't get it."});
            }
        });
    });
}

function init() {
    initConnect();
}

window.addEventListener('message', msg => {
    console.log('backgroud:message:', msg);
});

init();
