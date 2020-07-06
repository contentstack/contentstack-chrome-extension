/* eslint-disable no-undef */
'use strict';

var _AnalyticsCode = 'UA-169821045-1';

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga')

ga('create', _AnalyticsCode, 'auto'); // Enter your GA identifier
ga('set', 'checkProtocolTask', function(){}); // Removes failing protocol check.
ga('require', 'displayfeatures');

chrome.runtime.onMessage.addListener(
  function(request) {
      if (request.type === 'clicked') {
          ga('send', {
            hitType: 'event',
            eventCategory: 'Quick Edits',
            eventAction: 'Entry Edit',
            eventLabel: `${request.data}`
          });
      }
  }
);

chrome.runtime.onInstalled.addListener(function () {
  chrome.runtime.onMessage.addListener(
    function (request, sender) {
      
      if (request.action == 'active') {
        chrome.pageAction.show(sender.tab.id);
      }
    }
  );
  let optionsUrl = chrome.extension.getURL('options.html');
  chrome.tabs.query({ url: optionsUrl }, function (tabs) {
    if (tabs.length) {
      chrome.tabs.update(tabs[0].id, { active: true });
    } else {
      chrome.tabs.create({ url: optionsUrl });
    }
  });
});
