/**
 * @file Javascript file used for popup.html
 * @copyright Rayane Guemmoud 2022
 */
'use strict';

/**
 * Pages list
 * @typedef {('main' | 'setting' | 'loading')} PagesList
 */

/**
 * Mini toolbox
 * @typedef {Object} Pages
 * @property {Sections} sections - Pages list
 * @property {goTo} goTo - Change page
 * @property {enableLoad} enableLoad - Show loading page
 * @property {disableLoad} disableLoad - Hide loading page
 */

/**
 * Pages list object
 * @typedef {Object} Sections
 * @property {HTMLElement} main
 * @property {HTMLElement} setting
 * @property {HTMLElement} loading
 */

/**
 * Main thread of extension (popup)
 * @function
 * @name main
 * @param {Pages} pages - Mini toolbox
 * @return {void}
 */
function main(pages) {
    // Get anilist credential
    chrome.storage.sync.get(['user', 'expires_in', 'access_token', 'token_type'], (result) => {
        // Verify if all data available
        if (
            !result.user ||
            !result.expires_in ||
            !result.access_token ||
            !result.token_type
        ) {
            // Disable load page
            pages.disableLoad();
            // Load main page for display login button
            pages.goTo('main', 15);
            // Display login button
            document.getElementById('unlogged').classList.remove('hidden');
            // Stop script here for non-loggin
            return void 0;
        }

        /**
         * Get disconnect btn element
         * @kind constant
         * @type {HTMLElement}
         */
        const disconnectbtn = document.getElementById('disconnect');
        // If connected, display disconnect btn
        disconnectbtn.classList.remove('hidden');
        /**
         * Setup script for clear data, and reload script
         * @function
         * @name onclick
         * @async
         * @return {void}
         */
        disconnectbtn.onclick = async function() {
            // Show loading page
            pages.enableLoad();
            // Clear all credential data
            await chrome.storage.sync.clear().then(() => {
                // Hiden disconnect button
                this.classList.toggle('hidden', true);
                // Reload script
                main(pages);
            });
        }

        // Hide load page if connected.
        pages.disableLoad();
    });
}

/**
 * Script executed when DOM loaded
 * @function
 * @name onload
 * @return {void}
 */
window.onload = () => {
    // Getting some elements
    /**
     * Get setting btn element
     * @kind constant
     * @type {HTMLElement}
     */
    const settingBtn = document.getElementById('setting');
    /**
     * Get arrow back (on setting page) element
     * @kind constant
     * @type {HTMLElement}
     */
    const arrowBackbtn = document.getElementById('back_arrow');
    /**
     * Get main page element
     * @kind constant
     * @type {HTMLElement}
     */
    const mainLoading = document.getElementById('main_loading');

    /**
     * Create mini tools for repeat some task (like change page)
     * @namespace Pages
     * @type {Pages}
     */
    const pages = {
        // Reference all pages
        sections: {
            // Main page
            main: document.getElementById('main_page'),
            // Setting page
            setting: document.getElementById('setting_page'),
            // Load page
            loading: mainLoading
        },
        /**
         * Function for change page and redimensionnate popup
         * @function
         * @name goTo
         * @param {PagesList} page - Page to display
         * @param {number} [dimension=0] - Redimensionnate page (0 = ignore redimension)
         * @example
         * pages.goTo('main', 15);
         * pages.goTo('setting');
         * pages.goTo('loading', 0);
         * @return {this}
         */
        goTo: function(page, dimension = 0) {
            // Check if page exist
            if (!(page in this.sections)) {
                // Just log warn if not exist
                console.warn('page %s not referred', page);
                // Return this for make other action
                return this;
            }
            
            // Redimensionnate popup
            if (dimension > 0) {
                document.body.style.height = dimension + 'rem';
            }

            // Toggle hidden class for all page
            for (const section of Object.values(this.sections)) {
                section.classList.toggle('hidden', true);
            }

            // Remove toggle for the desired page
            this.sections[page].classList.remove('hidden');

            // Return this for make other action
            return this;
        },
        /**
         * Display loading page
         * @function
         * @name enableLoad
         * @example
         * pages.enableLoad();
         * @return {this}
         */
        enableLoad: function() {
            // Change page for loading page
            this.goTo('loading', 15);
            // Return this for make other action
            return this;
        },
        /**
         * Remove loading page
         * Must be used with .go
         * @function
         * @name disableLoad
         * @example
         * pages.disableLoad().goTo('main');
         * @returns 
         */
        disableLoad: () => {
            // Hide loading page
            mainLoading.classList.toggle('hidden', true);
            // Return this for make other action
            return this;
        }
    };

    /**
     * When setting btn clicked, change page for setting
     * @function
     * @name onclick
     * @return {void}
     */
    settingBtn.onclick = function() {
        // Change page for setting, and redimensionnate to 20px height
        pages.goTo('setting', 20);
        // Hide setting btn
        this.classList.toggle('hidden', true);
        // Show back arrow btn
        arrowBackbtn.classList.remove('hidden');
    };

    /**
     * When arrow back clicked, change page for main
     * @function
     * @name onclick
     * @return {void}
     */
    arrowBackbtn.onclick = function() {
        // Change page for main, and redimensionnate to 15px height
        pages.goTo('main', 15);
        // Hide back arrow btn
        this.classList.toggle('hidden', true);
        // Show setting arrow btn
        settingBtn.classList.remove('hidden');
    };

    // Execute main thread when all html <-> js function are created
    main(pages);
}
