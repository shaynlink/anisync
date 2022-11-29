/**
 * @file Script load in page
 * @copyright Rayane Guemmoud 2022
 */
'use strict';
/**
 * @kind constant
 * @default
 * @type {number}
 */
const MAX_INTERVAL = 1000;

/**
 * Script executed when DOM loaded
 * @function
 * @name onload
 * @return {void}
 */
window.onload = () => {
    /**
     * Initiate a count.
     * @type {number}
     */
    let intervalCount = 0;

    /**
     * Connect to background.js
     * @kind constant
     * @type {typeof chrome.runtime.connect}
     */
    const port = chrome.runtime.connect({ name: 'anisyncRunnerLogin'  });

    // Ignore if location is not an allowed site
    if (window.location.href.startsWith('https://ab53-2001-861-c5-f50-806e-9c6e-5b09-a8ad.eu.ngrok.io/')) {
        /**
         * Settup interval loop (max @see {MAX_INTERVAL} loop)
         * @constant
         * @type {setInterval}
         */
        const interval = setInterval(() => {
            // Increment interval count
            intervalCount = intervalCount + 1;

            /** If interval count is equal or superior to @see {MAX_INTERVAL} count */
            if (intervalCount >= MAX_INTERVAL) {
                // Clear interval
                clearInterval(interval);
                // Log an error
                console.error('max interval reach');
                // Hide loading
                document.getElementById('loading').classList.toggle('hidden', true);
                // Set error message for client
                document.getElementById('msg-error').innerText = 'Max interval reach, please retry to connect.';
                return void 0;
            }

            /**
             * Get user saved data
             * @constant
             * @type {string | null}
             */
            const userRaw = window.sessionStorage.getItem('user');
            // Ignore if has no data
            if (!userRaw || userRaw == '') {
                return void 0;
            }

            /**
             * Get user saved data
             * @constant
             * @type {string | null}
             */
            const expires_in = window.sessionStorage.getItem('expires_in');
            // Ignore if has no data
            if (!expires_in || expires_in == '') {
                return void 0;
            }

            /**
             * Get user saved data
             * @constant
             * @type {string | null}
             */
            const access_token = window.sessionStorage.getItem('access_token');
            // Ignore if has no data
            if (!access_token || access_token == '') {
                return void 0;
            }

            /**
             * Get user saved data
             * @constant
             * @type {string | null}
             */
            const token_type = window.sessionStorage.getItem('token_type');
            // Ignore if has no data
            if (!token_type || token_type == '') {
                return void 0;
            }

            // Parse raw user saved data to object
            const user = JSON.parse(userRaw);

            // Send data and actual location to background.js 
            port.postMessage({
                user,
                expires_in,
                access_token,
                token_type,
                location: window.location.href
            });
            // Loop each 1 seconde
        }, 1000);

        // Create new listener from background.js
        port.onMessage.addListener((msg) => {
            // If all good background.js send farewell = done
            if (msg.farewell == 'done') {
                // Clear interval
                clearInterval(interval);

                // Inform user
                document.getElementById('success-msg').innerText = `Congrat ${msg?.name ?? '(っ▀¯▀)つ'}`;
                // Hide loading
                document.getElementById('loading').classList.toggle('hidden', true);
                // Show success msg
                document.getElementById('success').classList.remove('hidden');

                /**
                 * Get loading bar element
                 * @kind constant
                 * @type {HTMLElement}
                 */
                const loadBar = document.getElementById('loadStatus');

                // Create timer for 3 secondes
                // Wait 1 seconde
                new Promise((r) => setTimeout(r, 1000))
                    .then(async () => {
                        // Set load bar to 1/3 %
                        loadBar.style.width = `${100 / 3}%`;
                        // Wait 1 seconde
                        await new Promise((r) => setTimeout(r, 1000));
                        // Set load bar to 2/3 %
                        loadBar.style.width = `${(100 / 3) * 2}%`;
                        // Wait 1 seconde
                        await new Promise((r) => setTimeout(r, 1000));
                        // Set load bar to 3/3 %
                        loadBar.style.width = '100%';
                        // Wait 1 seconde
                        await new Promise((r) => setTimeout(r, 1000));
                        // Close tab
                        window.close();
                    })
                return void 0;
            }
        });
    }

    /** 
     * @todo Get episode number
     * and save on anilist user account if
     * actual epsiode is > than anilist episode saved
     */
}