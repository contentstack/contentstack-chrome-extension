/* eslint-disable no-useless-escape */
/* eslint-disable no-undef */
let editBtn = document.getElementsByClassName("ext__cms__edit");

chrome.storage.sync.get(
    ["stack", "type", "btnColor", "btnPos", "watch", "delay"]
    , (items) => {
        checkDomain(items.stack, items.btnColor, items.btnPos);
    }
);

/**
 * Function fetches attributes from body tag and returns realtive data
 */
function fetchAttributes() {
    let dataAttributes = Array.from(
        document.querySelectorAll("[data-contenttype]")
    );
    let dataLocale = document.querySelector("[name=locale]");
    dataLocale = dataLocale ? dataLocale.getAttribute("value") : "en-us";
    dataAttributes = dataAttributes.map((element) => {
        return {
            contentType: element.dataset.contenttype
            , entryUID: element.dataset.pageref
            , title: element.dataset.contenttype_title ?
                dataset.contenttype_title : undefined
            , default: element.dataset.setDefault ? true : false
        , };
    });
    dataAttributes = dataAttributes.filter(
        (element, idx, arr) =>
        idx === arr.findIndex((elm) => elm.entryUID === element.entryUID)
    );
    return dataAttributes.length > 0 ? {
        dataAttributes
        , dataLocale
    } : false;
}

/**
 * Function compares url provided in stack block with active tab
 * if true it create navigation button on webpage
 */

function checkDomain(stacks, btnColor, btnPos) {
    stacks.forEach((stack) => {
        let domains, csHost;
        const {
            host
        } = window.location;

        if (stack.region.select === "CR") {
            csHost = stack.region.customUrl;
            if (csHost.includes("http") || csHost.includes("https")) {
                csHost = new URL(csHost)
                    .host;
            }
        } else {
            csHost = stack.region.select;
        }
        domains = stack.domain.split(",");
        domains.forEach((domain) => {
            let domainURL = domain.includes("http") || domain.includes("https") ?
                new URL(domain.trim())
                .host : domain.trim();
            const hostRX = new RegExp(`^${domainURL}$`);
            if (hostRX.test(host) && window.location.host.includes(host)) {
                let bodyAttr = fetchAttributes();
                if (bodyAttr) {
                    const checkAttr = setInterval(() => {
                        bodyAttr = fetchAttributes();
                        if (bodyAttr) {
                            clearInterval(checkAttr);
                            buildBtn(csHost, stack, btnColor, btnPos, bodyAttr);
                        } else if (editBtn.length != 0) {
                            editBtn[0].remove;
                        }
                    }, 2000);
                } else {
                    buildBtn(csHost, stack, btnColor, btnPos, bodyAttr);
                }
                return;
            }
        });
    });
}

/**
 * Function is triggered everytime when navigation button is clicked
 * It send apikey associated with active tab to background.js
 */

function editContent(stack) {
    chrome.runtime.sendMessage({
        type: "clicked"
        , data: stack
    , });
}

function listSelect(evt) {
    const atag = document.getElementsByClassName('ext__cms__edit')[0];
    atag.href = evt.target.dataset.setUrl;
    document.getElementsByClassName('csExListUL')[0].style.display = 'none';
}

/**
 * Function builds button on webpage
 */

function buildBtn(csHost, stack, btnColor, btnPos, entryList) {
    if (editBtn.length == 0) {
        const editElement = document.createElement('div')
        let defaultEdit = entryList.dataAttributes.find(elm => elm.default === true)
        if (defaultEdit) {
            chrome.runtime.sendMessage('', {
                type: 'notification'
                , options: {
                    title: 'Contentstack Extension Notification'
                    , message: `Default edit entry would be "${defaultEdit.contentType}"`
                    , iconUrl: '/images/logo16.png'
                    , type: 'basic'
                }
            });
        } else {
            defaultEdit = entryList.dataAttributes[0];
            chrome.runtime.sendMessage('', {
                type: 'notification'
                , options: {
                    title: 'Contentstack Extension Notification'
                    , message: `No Default edit entry found. So default entry would be "${defaultEdit.contentType}"`
                    , iconUrl: '/images/logo16.png'
                    , type: 'basic'
                }
            });
        }
        const aTag = document.createElement('a')
        aTag.addEventListener("click", () => {
            editContent(stack);
        });

        aTag.style.backgroundColor = btnColor;
        aTag.setAttribute("target", "blank");
        aTag.className = 'csExEdit csExEditBtn ext__cms__edit'
        aTag.href = `https://${csHost}/#!/stack/${stack.apiKey}/content-type/${defaultEdit.contentType}/${entryList.dataLocale}/entry/${defaultEdit.entryUID}/edit`;
        editElement.appendChild(aTag);
        const listElement = document.createElement('div');
        listElement.className = 'csExDropdown'
        const dropdownBtn = document.createElement('button');
        dropdownBtn.classList = 'csExEdit csExBtnDropDown'
        dropdownBtn.style.borderLeft = '0.5px solid white';
        dropdownBtn.style.backgroundColor = btnColor;
        const dropdownUl = document.createElement('ul');
        dropdownUl.classList = 'csExListUL'
        // dropdownUl.onmouseout= function(){dropdownUl.style.display=='none'}
        dropdownBtn.addEventListener('click', function () {
            dropdownUl.style.display = dropdownUl.style.display === 'block' ? 'none' : 'block'
            // dropdownUl.style.display=='block'
        })
        entryList.dataAttributes.forEach(list => {
            let element = document.createElement('li');
            element.innerText = list.title;
            element.className = 'contenttypeList'
            element.addEventListener('click', listSelect)
            element.dataset.setUrl = `https://${csHost}/#!/stack/${stack.apiKey}/content-type/${list.contentType}/${entryList.dataLocale}/entry/${list.entryUID}/edit`
            dropdownUl.appendChild(element)
        });
        listElement.appendChild(dropdownBtn);
        listElement.appendChild(dropdownUl);
        editElement.appendChild(listElement);
        document.body.appendChild(editElement);

        const style = document.createElement('style');
        style.innerHTML = `
        .csExEditBtn{background-image:url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'%3e%3cpath d='M17.6 35.8l16.2-16.2 6.3 6.3C34.8 31.3 29.4 36.7 24 42.1c-2.1-2-4.3-4.2-6.4-6.3zM41.9 24.3l-6.4-6.4.9-.9c.7-.6 1.3-1.3 2-1.9 1.1-1 2.7-1 3.8 0 1 1 2.1 2 3.1 3.1.8.9.8 2.1-.1 3-1.1 1-2.1 2-3.3 3.1.1-.1.1-.1 0 0zM15.8 37.6l6.4 6.4c-.5.1-1.1.3-1.6.4-1.8.4-3.5.9-5.3 1.3-.7.2-1.2-.2-1-1 .5-2.4 1-4.7 1.5-7.1 0 .1 0 0 0 0z' fill='%23fff'/%3e%3c/svg%3e");background-size:50px 50px;background-position:center;${btnPos}:120px;width:60px;}.csExEdit{color:white;padding:16px;font-size:16px;border:none;outline:none;position:fixed;bottom:30px;height:60px;z-index:99;text-indent:-9999px;}.csExBtnDropDown{background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAAbElEQVRIie2SOQ6AIBAA+ZchFD7Z0hAa/zW2BGFhBRuz0wIzXM4Zxn8ANuAELmBfLT54MhcSxHMhhVgXAjwQO5I4OMeXctWi0c3kgRbiselcpxRQPVwrVAtMfb0ylA8kILwVV0IBSKt8hvExN/uryO/uv/Z1AAAAAElFTkSuQmCC');background-repeat:no-repeat;padding:18px background-size:20px 20px;background-position:center;padding:20px}.csExDropdown{position:absolute;display:inline-block;${btnPos}:120px;}.csExListUL{display:none;position:fixed;background-color:#f1f1f1;border-left:1px solid #0d8bf2 min-width:160px;z-index:9999;bottom:80px;}.csExListUL li{color:black;padding:12px 16px;text-decoration:none;display:block;margin-left:-40px;}.csExListUL li:hover{background-color:#ddd}.csExEditBtn:hover,.csExDropdown:hover .csExEditBtn{background-color:#0b7dda;}
        `
        document.head.appendChild(style);
        chrome.runtime.sendMessage({
            action: "active"
        , });
    }
}

/**
 * Function checks for mutation and try to create button based on changed value
 */
observer = new MutationObserver(function () {
    let bodyAttr = fetchAttributes();
    if (!bodyAttr) {
        editBtn[0].remove();
    } else {
        chrome.storage.sync.get(
            ["stack", "type", "btnColor", "btnPos", "watch", "delay"]
            , (items) => {
                checkDomain(items.stack, items.btnColor, items.btnPos);
            }
        );
    }
});

observer.observe(document.body, {
    attributes: true
    , attributeFilter: ["data-contenttype"]
, });