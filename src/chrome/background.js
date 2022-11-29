/**
 * @file Service-Worker file
 * @copyright Rayane Guemmoud 2022
 */
'use script';

// Execute script when chrome's runtime is connected.
chrome.runtime.onConnect.addListener((port) => {
    // Execute script when received a message.
    port.onMessage.addListener((msg) => {
        // Ignore if name is not anisyncRunnerLogin.
        if (port.name != 'anisyncRunnerLogin') {
            return void 0;
        };

        // Ignore if location is not an allowed site.
        if (!msg.location || !msg.location.startsWith('https://ab53-2001-861-c5-f50-806e-9c6e-5b09-a8ad.eu.ngrok.io/')) {
            console.warn('site not allowed');
            return void 0;
        }

        // Check if all data available.
        if (
            msg.user &&
            msg.expires_in &&
            msg.access_token &&
            msg.token_type
        ) {
            // Save all data on google online storage.
            chrome.storage.sync.set({
                user: msg.user,
                expires_in: msg.expires_in,
                access_token: msg.access_token,
                token_type: msg.token_type
            }, () => {
                // If done send positive message to page.js
                port.postMessage({ farewell: 'done', name: msg.user.name });
            })
        } else {
            // If not done send negative message to page.js
            port.postMessage({ farewell: 'not done' });
        }
        
    });
});