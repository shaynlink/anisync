const MAX_INTERVAL = 1000;

console.log('?');

window.onload = () => {
    let intervalCount = 0;
    console.log('on loaded');
    const port = chrome.runtime.connect({ name: 'anisyncRunnerLogin'  });

    if (window.location.href.startsWith('https://ab53-2001-861-c5-f50-806e-9c6e-5b09-a8ad.eu.ngrok.io/')) {
        const interval = setInterval(() => {
            intervalCount = intervalCount + 1;
            console.log('interval %s', intervalCount);
            if (intervalCount >= MAX_INTERVAL) {
                clearInterval(interval);
                console.error('max interval reach');
                document.getElementById('loading').classList.toggle('hidden', true);
                document.getElementById('msg-error').innerText = 'Max interval reach, please retry to connect.';
                clearInterval(interval);
                return;
            }

            const userRaw = window.sessionStorage.getItem('user');

            if (!userRaw || userRaw == '') {
                return void 0;
            }

            const expires_in = window.sessionStorage.getItem('expires_in');

            if (!expires_in || expires_in == '') {
                return void 0;
            }

            const access_token = window.sessionStorage.getItem('access_token');

            if (!access_token || access_token == '') {
                return void 0;
            }

            const token_type = window.sessionStorage.getItem('token_type');

            if (!token_type || token_type == '') {
                return void 0;
            }

            const user = JSON.parse(userRaw);

            port.postMessage({
                user,
                expires_in,
                access_token,
                token_type,
                location: window.location.href
            });
        }, 1000);

        port.onMessage.addListener((msg) => {
            if (msg.farewell == 'done') {
                clearInterval(interval);

                document.getElementById('success-msg').innerText = `Congrat ${msg?.name ?? '(っ▀¯▀)つ'}`;
                document.getElementById('loading').classList.toggle('hidden', true);
                document.getElementById('success').classList.remove('hidden');

                const loadBar = document.getElementById('loadStatus');

                new Promise((r) => setTimeout(r, 1000))
                    .then(async () => {
                        loadBar.style.width = `${100 / 3}%`;
                        await new Promise((r) => setTimeout(r, 1000));
                        loadBar.style.width = `${(100 / 3) * 2}%`;
                        await new Promise((r) => setTimeout(r, 1000));
                        loadBar.style.width = '100%';
                        await new Promise((r) => setTimeout(r, 1000));
                        window.close();
                    })
                return void 0;
            }
        });
    }

    // next
}