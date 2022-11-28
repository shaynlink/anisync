console.log('background anisync');

chrome.runtime.onConnect.addListener((port) => {
    console.assert(port.name == 'anisyncRunnerLogin');

    port.onMessage.addListener((msg) => {
        if (port.name != 'anisyncRunnerLogin') {
            return void 0;
        };

        if (!msg.location || !msg.location.startsWith('https://ab53-2001-861-c5-f50-806e-9c6e-5b09-a8ad.eu.ngrok.io/')) {
            console.warn('site not allowed');
            return void 0;
        }

        if (
            msg.user &&
            msg.expires_in &&
            msg.access_token &&
            msg.token_type
        ) {
            chrome.storage.sync.set({
                user: msg.user,
                expires_in: msg.expires_in,
                access_token: msg.access_token,
                token_type: msg.token_type
            }, () => {
                console.log('Value is set to', msg);
                port.postMessage({ farewell: 'done', name: msg.user.name });
            })
        } else {
            port.postMessage({ farewell: 'not done' });
        }
        
    });
});

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (sender.tab.url.startsWith('https://ab53-2001-861-c5-f50-806e-9c6e-5b09-a8ad.eu.ngrok.io')) {
//         console.log(sender.tab);
//         console.log(request);
//         if (
//             request.user &&
//             request.expires_in &&
//             request.access_token &&
//             request.token_type
//         ) {
//             chrome.storage.sync.set(request, () => {
//                 console.log('Value is set to ' + request);
//                 sendResponse({ farewell: 'done' });
//             });
//         } else {
//             sendResponse({ farewell: 'not done' });
//         }
//     }
// });