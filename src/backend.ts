console.log('Backend is here.');

window.addEventListener('message', msg => {
    console.log('backend:message:', msg);
});