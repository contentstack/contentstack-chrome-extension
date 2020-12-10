/* eslint-disable no-undef */
const _AnalyticsCode = 'UA-169821045-1';

(function (i, s, o, g, r, a, m) {
    i.GoogleAnalyticsObject = r;
    i[r] = i[r] || function () {
        (i[r].q = i[r].q || [])
        .push(arguments);
    }, i[r].l = 1 * new Date();
    a = s.createElement(o)
        , m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m);
}(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga'));

ga('create', _AnalyticsCode, 'auto'); // Enter your GA identifier
ga('set', 'checkProtocolTask', () => {}); // Removes failing protocol check.
ga('require', 'displayfeatures');

chrome.runtime.onMessage.addListener(
    (request) => {
        if (request.type === 'clicked') {
            ga('send', {
                hitType: 'event'
                , eventCategory: 'Quick Edits'
                , eventAction: 'Entry Edit'
                , eventLabel: `${request.data}`
            , });
        }
    }
);

chrome.runtime.onInstalled.addListener((details) => {
    chrome.runtime.onMessage.addListener(
        (request, sender) => {
            if (request.action == 'active') {
                chrome.pageAction.show(sender.tab.id);
            }
        }
    );
    if (details.reason == 'install') {
        // call a function to handle a first install
        const {
            version
        } = chrome.runtime.getManifest();

        
        // chrome.extension.sendMessage({prevVersion:details.previousVersion})
        // chrome.runtime.onMessage.addListener(function (port) {
        //     port.postMessage(`version=${details.previousVersion}`);
        // })
        ga('send', {
            hitType: 'event'
            , eventCategory: 'Extension Installation'
            , eventAction: 'Installed'
            , eventLabel: `Version: v${version}`
        , });

        //        chrome.runtime.onMessage.addListener(function () {
        //     // port.postMessage(`version=${details.previousVersion}`);
        //     chrome.runtime.sendMessage({
        //         msg: "version check", 
        //         data: {
        //             preVersion: details.previousVersion
        //         }
        //     });
        // })
        // chrome.runtime.sendMessage('', {
        //     content: "mapping"
        // });
    } else if (details.reason == 'update') {
        // call a function to handle an update
        const {
            version
        } = chrome.runtime.getManifest();
               chrome.runtime.onMessage.addListener(function () {
            // port.postMessage(`version=${details.previousVersion}`);
            chrome.runtime.sendMessage({
                msg: "version check", 
                data: {
                    preVersion: details.previousVersion
                }
            });
        })

       

        // chrome.extension.onConnect.addListener(function (port) {
        //     port.postMessage(`version=${details.previousVersion}`);
        // })

        ga('send', {
            hitType: 'event'
            , eventCategory: 'Extension Updation'
            , eventAction: 'Updated'
            , eventLabel: `Version: from v${details.previousVersion} to v${version}`
        , });
    }
    const optionsUrl = chrome.extension.getURL('options.html');
    chrome.tabs.query({
        url: optionsUrl
    }, (tabs) => {
        if (tabs.length) {
            chrome.tabs.update(tabs[0].id, {
                active: true
            });
        } else {
            chrome.tabs.create({
                url: optionsUrl
            });
        }
    });
});
