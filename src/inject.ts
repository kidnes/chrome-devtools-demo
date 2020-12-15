console.log('inject is here.');

window.addEventListener('message', msg => {
    console.log('inject:message:', msg);
});