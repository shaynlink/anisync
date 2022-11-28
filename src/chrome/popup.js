// Main thread of extension (popup)
function main(pages) {
    // Getting anilist credential
    chrome.storage.sync.get(['user', 'expires_in', 'access_token', 'token_type'], (result) => {
        if (
            !result.user ||
            !result.expires_in ||
            !result.access_token ||
            !result.token_type
        ) {
            pages.disableLoad();
            pages.goTo('main', 15);
            document.getElementById('unlogged').classList.remove('hidden');
            return void 0;
        }

        const disconnectbtn = document.getElementById('disconnect');
        disconnectbtn.classList.remove('hidden');
        disconnectbtn.onclick = async function() {
            pages.enableLoad();
            await chrome.storage.sync.clear().then(() => {
                this.classList.toggle('hidden', true);
                main(pages);
            });
        }

        pages.disableLoad();
    });
}

window.onload = () => {
    const settingBtn = document.getElementById('setting');
    const arrowBackbtn = document.getElementById('back_arrow');
    const mainLoading = document.getElementById('main_loading');

    const pages = {
        sections: {
            main: document.getElementById('main_page'),
            setting: document.getElementById('setting_page'),
            loading: mainLoading
        },
        goTo: function(page, dimension = 0) {
            if (!(page in this.sections)) {
                console.warn('page %s not referred', page);
                return this;
            }
            
            if (dimension > 0) {
                document.body.style.height = dimension + 'rem';
            }

            for (const section of Object.values(this.sections)) {
                section.classList.toggle('hidden', true);
            }
            this.sections[page].classList.remove('hidden');

            return this;
        },
        enableLoad: function() {
            this.goTo('loading', 15);
        },
        disableLoad: () => {
            mainLoading.classList.toggle('hidden', true);
        }
    };

    settingBtn.onclick = function() {
        pages.goTo('setting', 20);
        this.classList.toggle('hidden', true);
        arrowBackbtn.classList.remove('hidden');
    };

    arrowBackbtn.onclick = function() {
        pages.goTo('main', 15);
        this.classList.toggle('hidden', true);
        settingBtn.classList.remove('hidden');
    };

    main(pages);
}
