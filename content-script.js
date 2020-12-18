/* eslint-disable no-useless-escape */
/* eslint-disable no-undef */
let editBtn = document.getElementsByClassName('ext__cms__edit');

chrome.storage.sync.get(
    ['stack', 'type', 'btnColor', 'btnPos', 'watch', 'delay']
    , (items) => {
        checkDomain(items.stack, items.btnColor, items.btnPos);
    }
);

/**
 * Function fetches attributes from body tag and returns realtive data
 */
function fetchAttributes() {
    const pageref = document.body.getAttribute('data-pageref');
    const contentType = document.body.getAttribute('data-contenttype');
    const locale = document.body.getAttribute('data-locale');
    if (pageref && contentType && locale) {
        return [pageref, contentType, locale]
    } else {
        const nodeAttr = document.querySelector('[data-contenttype]')
        return nodeAttr ? [nodeAttr.getAttribute('data-pageref'), nodeAttr.getAttribute('data-contenttype'), nodeAttr.getAttribute('data-locale')] : ''
    }

}

/**
 * Function compares url provided in stack block with active tab
 * if true it create navigation button on webpage
 */
function checkDomain(stack, btn, btnPos) {
    let domains;
    domains = stack.map(el => {
        const domArr = el.domain.split(',');
        return domArr.map((elms) => {
            if (elms.includes('http') || elms.includes('https')) {
                const newDomain = elms.trim();
                return new URL(newDomain).host;
            }

            return elms.trim();
        })
    })

    const {
        host
    } = window.location;

    const stacks = stack;
    if (stacks.length > 1) {
        stacks.forEach((stack, idx) => {
            const domain = domains[idx].map((d) => d.toString().replace(/[`~!@#$%^&*()|+\=?;'",<>\{\}\[\]\\\/]/gi, ''));
            let csHost;

            if (stack.region.select === 'CR') {
                csHost = stack.region.customUrl;
                if (csHost.includes('http') || csHost.includes('https')) {
                    csHost = new URL(csHost).host;
                }
            } else {
                csHost = stack.region.select;
            }
            for (let x = 0; x < domain.length; x++) {
                const hostRX = new RegExp(`^${domain[x]}$`);
                if (hostRX.test(host) && window.location.host.includes(host)) {
                    let bodyAttr = fetchAttributes();
                    if (!bodyAttr[0] || !bodyAttr[1] || !bodyAttr[2]) {
                        const checkAttr = setInterval(() => {
                            bodyAttr = fetchAttributes();
                            if (bodyAttr[0] && bodyAttr[1] && bodyAttr[2]) {
                                clearInterval(checkAttr);
                                buildBtn(csHost, stack, btn, btnPos, bodyAttr);
                            } else if (editBtn.length != 0) {
                                editBtn[0].remove
                            }
                        }, 2000);
                    } else {
                        buildBtn(csHost, stack, btn, btnPos, bodyAttr);
                    }
                    return;
                }
            }
        });
    } else {
        const domain = domains[0].map((d) => d.toString().replace(/[`~!@#$%^&*()|+\=?;'",<>\{\}\[\]\\\/]/gi, ''));
        let csHost;
        if (stack[0].region.select === 'CR') {
            csHost = stack[0].region.customUrl;
            if (csHost.includes('http') || csHost.includes('https')) {
                csHost = new URL(csHost).host;
            }
        } else {
            csHost = stack[0].region.select;
        }
        for (let x = 0; x < domain.length; x++) {
            const hostRX = new RegExp(`^${domain[x]}$`);
            if (hostRX.test(host)) {
                let bodyAttr = fetchAttributes();
                if (!bodyAttr[0] || !bodyAttr[1] || !bodyAttr[2]) {
                    const checkAttr = setInterval(() => {
                        bodyAttr = fetchAttributes();
                        if (bodyAttr[0] && bodyAttr[1] && bodyAttr[2]) {
                            clearInterval(checkAttr);
                            buildBtn(csHost, stack[0], btn, btnPos, bodyAttr);
                        } else if (editBtn.length != 0) {
                            editBtn[0].remove
                        }
                    }, 2000);
                } else {
                    buildBtn(csHost, stack[0], btn, btnPos, bodyAttr);
                }

                return;
            }
        }
    }
}

/**
 * Function is triggered everytime when navigation button is clicked
 * It send apikey associated with active tab to background.js
 */

function editContent(stack) {
    chrome.runtime.sendMessage({
        type: 'clicked'
        , data: stack
    });
}

/**
 * Function builds button on webpage
 */

function buildBtn(csHost, stack, btn, btnPos, bodyAttr) {
    if (stack && bodyAttr[0] && bodyAttr[1] && bodyAttr[2] && editBtn.length == 0) {
        const a = document.createElement('a');
        a.className = 'ext__cms__edit';
        a.innerHTML = 'Edit';
        a.addEventListener('click', () => {
            editContent(stack);
        });
        a.style.backgroundColor = btn;
        a.setAttribute('target', 'blank');
        a.href = `https://${
      csHost
    }/#!/stack/${
      stack.apiKey
    }/content-type/${
      bodyAttr[1]
    }/${
      bodyAttr[2]
    }/entry/${
      bodyAttr[0]
    }/edit`;
        document.body.appendChild(a);

        const b = document.createElement('style');
        b.innerHTML = `.ext__cms__edit{position:fixed;${
      btnPos
    }:30px;bottom:30px;width:60px;height:60px;z-index: 99;border-radius:30px;background-color:#5a20b9;box-shadow:0 5px 20px 0px rgba(0,0,0,0.5);text-indent:-9999px;background-image:url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'%3e%3cpath d='M17.6 35.8l16.2-16.2 6.3 6.3C34.8 31.3 29.4 36.7 24 42.1c-2.1-2-4.3-4.2-6.4-6.3zM41.9 24.3l-6.4-6.4.9-.9c.7-.6 1.3-1.3 2-1.9 1.1-1 2.7-1 3.8 0 1 1 2.1 2 3.1 3.1.8.9.8 2.1-.1 3-1.1 1-2.1 2-3.3 3.1.1-.1.1-.1 0 0zM15.8 37.6l6.4 6.4c-.5.1-1.1.3-1.6.4-1.8.4-3.5.9-5.3 1.3-.7.2-1.2-.2-1-1 .5-2.4 1-4.7 1.5-7.1 0 .1 0 0 0 0z' fill='%23fff'/%3e%3c/svg%3e");background-size:50px 50px;background-position:center center}`;
        document.head.appendChild(b);

        chrome.runtime.sendMessage({
            action: 'active'
        });
    }
}

/**
 * Function checks for mutation and try to create button based on changed value
 */
observer = new MutationObserver(function () {
    let bodyAttr = fetchAttributes();
    if (!bodyAttr[0] || !bodyAttr[1] || !bodyAttr[2]) {
        editBtn[0].remove();
    } else {
        chrome.storage.sync.get(
            ['stack', 'type', 'btnColor', 'btnPos', 'watch', 'delay']
            , (items) => {
                checkDomain(items.stack, items.btnColor, items.btnPos);
            }
        );
    }
});

observer.observe(document.body, {
    attributes: true
    , attributeFilter: ['data-contenttype']
});