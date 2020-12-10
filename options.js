/* eslint-disable no-useless-escape */
/* eslint-disable no-undef */
let validationFlag = false;
var port = chrome.extension.connect({
    name: "Sample Communication"
});
// if (port.postMessage("share previuos version")) {
port.onMessage.addListener(function (msg) {

    if (msg.split('version=')[1] <= "1.1.4") {
        chrome.storage.sync.get({
            stack: ''
            , dom: ''
            , btn: '#5a20b9'
            , btnPos: 'right'
            , region: []
        , }, (prev) => {
            if (!prev.stack[0].apiKey) {

                let stack = prev.region.map((el, idx) => {
                    return {
                        uid: create_UUID()
                        , apiKey: prev.stack[idx]
                        , domain: prev.dom[idx]
                        , region: el
                    }
                })
                let next = {
                    stack
                    , btnColor: prev.btn
                    , btnPos: prev.btnPos
                }
                chrome.storage.sync.set({
                    stack: next.stack
                    , btnColor: next.btnColor
                    , btnPos: next.btnPos
                , }, () => {
                    createFields(next);
                })
            } else {
                createFields({
                    stack: prev.stack
                    , btnColor: prev.btn
                    , btnPos: prev.btnPos
                });
            }
        })

    } else if (chrome.runtime.getManifest()
        .version > '1.1.4') {
        // document.addEventListener('DOMContentLoaded', restoreOptions);
        restoreOptions()
    }
});


function focusEvent(evt) {
    evt.target.parentNode.childNodes[1].style.display = 'block';
    evt.target.style.cssText = 'border: 1px solid #24c2a3; box-sizing: border-box; border-radius: 1px; background: #f7fbfd;';
}

function blurEvent(evt) {
    evt.target.parentNode.childNodes[1].style.display = 'none';
    evt.target.style.cssText = 'border: 1px solid #dfe2ea; box-sizing: border-box; border-radius: 1px; background: transparent;';
}

function dynamicFocusEvent(evt) {
    evt.target.parentNode.childNodes[0].style.display = 'block';
    evt.target.style.cssText = 'border: 1px solid #24c2a3; box-sizing: border-box; border-radius: 1px; background: #f7fbfd;';
}

function dynamicBlurEvent(evt) {
    evt.target.parentNode.childNodes[0].style.display = 'none';
    evt.target.style.cssText = 'border: 1px solid #dfe2ea; box-sizing: border-box; border-radius: 1px; background: transparent;';
}

/**
 * Function provide delete option to remove unwanted stack block
 **/
function removeApikey(evt) {
    const blockArray = Array.from(document.getElementsByClassName('apikey-block'));
    if (blockArray.length > 1) {
        evt.target.parentNode.parentNode.remove();
        const newBlock = Array.from(document.getElementsByClassName('apikey-block'));
        if (newBlock.length === 1) {
            if (newBlock[0].childNodes[0].nodeName === 'DIV') {
                newBlock[0].childNodes[0].childNodes[0].style.display = 'none';
            } else {
                newBlock[0].childNodes[1].childNodes[0].style.display = 'none';
            }
        }
    }
}

function regionSelection(evt) {
    if (evt.target.value === 'CR') {
        evt.target.parentNode.style = 'top:16px';
        evt.target.parentNode.parentNode.style = 'height:398px';
        if (evt.target.parentNode.childNodes[2].nodeName === 'DIV') {
            evt.target.parentNode.childNodes[2].style = 'display:block';
        } else {
            evt.target.parentNode.childNodes[5].style = 'display:block';
        }
    } else {
        evt.target.parentNode.style = 'top:22px';
        evt.target.parentNode.parentNode.style = 'height:334px';
        if (evt.target.parentNode.childNodes[2].nodeName === 'DIV') {
            evt.target.parentNode.childNodes[2].style = 'display:none';
        } else {
            evt.target.parentNode.childNodes[5].style = 'display:none';
        }
    }
}

/**
 * Function creates region section
 * containing dropdown as well as input fields for custom url
 */

function createsRegionSetting() {
    const regionMainDiv = document.createElement('div');
    regionMainDiv.className = 'region-setting';
    const rgnMainLabel = document.createElement('Label');
    rgnMainLabel.for = 'region';
    rgnMainLabel.className = 'region-select-label';
    rgnMainLabel.innerText = 'Region';

    const selectTag = document.createElement('select');
    selectTag.className = 'regionSelect';
    selectTag.addEventListener('change', regionSelection);
    const op1 = document.createElement('option');
    op1.value = 'app.contentstack.com';
    op1.innerText = 'North America';

    const op2 = document.createElement('option');
    op2.value = 'eu-app.contentstack.com';
    op2.innerText = 'Europe';

    const op3 = document.createElement('option');
    op3.value = 'CR';
    op3.innerText = 'Other';

    selectTag.appendChild(op1);
    selectTag.appendChild(op2);
    selectTag.appendChild(op3);

    const containerDiv = document.createElement('div');
    containerDiv.className = 'container';
    containerDiv.classList.add('rgn-setting-cnt');
    const containerSpan = document.createElement('span');
    containerSpan.className = 'container-bar';
    containerSpan.classList.add('custom-bar');
    const containerLabel = document.createElement('Label');
    containerLabel.for = 'region';
    containerLabel.className = 'region-label';
    containerLabel.innerText = '';
    const inputFiled = document.createElement('input');
    (inputFiled.name = 'region'), (inputFiled.className = 'region-inp');
    inputFiled.value = '';
    inputFiled.placeholder = 'private-cloud.contentstack.com';
    inputFiled.addEventListener('focus', dynamicFocusEvent);
    inputFiled.addEventListener('blur', dynamicBlurEvent);
    containerDiv.appendChild(containerSpan);
    containerDiv.appendChild(containerLabel);
    containerDiv.appendChild(inputFiled);

    regionMainDiv.appendChild(rgnMainLabel);
    regionMainDiv.appendChild(selectTag);
    regionMainDiv.appendChild(containerDiv);
    return regionMainDiv;
}
/**
 * Function creates block containing apikey domain and region fields
 **/
function addApikey() {
    let lbl;
    let ipt;

    lbl = {
        for: 'stackId'
        , class: 'stack-label'
        , text: 'Stack API Key'
    };
    ipt = {
        name: 'stackId'
        , class: 'stackId'
        , holder: 'API key'
        , title: 'Enter your stack API key'
    , };
    const borderDiv = document.createElement('div');
    borderDiv.className = 'apikey-block';
    const stackDetails = createApiBlock(lbl, ipt);
    let cntDiv = document.createElement('div');
    cntDiv.className = 'container';
    let spanBar = document.createElement('span');
    spanBar.className = 'container-bar';
    const cntRemove = document.createElement('div');
    cntRemove.className = 'remove-btn-div';
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    cntRemove.appendChild(removeBtn);

    cntDiv.appendChild(spanBar);
    cntDiv.appendChild(stackDetails[0]);
    cntDiv.appendChild(stackDetails[1]);

    stackDetails[1].addEventListener('focus', dynamicFocusEvent);
    stackDetails[1].addEventListener('blur', dynamicBlurEvent);
    borderDiv.appendChild(cntRemove);
    borderDiv.appendChild(cntDiv);
    lbl = {
        for: 'domains'
        , class: 'domain-label'
        , text: 'Domain Name or Host'
    , };
    ipt = {
        name: 'domains'
        , class: 'domains'
        , holder: 'example.com, localhost:3000'
        , title: 'Enter your domain names seprated by ,'
    , };
    const domainsDetails = createApiBlock(lbl, ipt);
    cntDiv = document.createElement('div');
    cntDiv.className = 'container';
    spanBar = document.createElement('span');
    spanBar.className = 'container-bar';
    cntDiv.appendChild(spanBar);
    cntDiv.appendChild(domainsDetails[0]);
    cntDiv.appendChild(domainsDetails[1]);
    domainsDetails[1].addEventListener('focus', dynamicFocusEvent);
    domainsDetails[1].addEventListener('blur', dynamicBlurEvent);
    borderDiv.appendChild(cntDiv);
    borderDiv.appendChild(createsRegionSetting());
    document
        .getElementById('apikey-div')
        .insertBefore(borderDiv, document.getElementById('stack-api-btn'));
    document.querySelectorAll('.remove-btn')
        .forEach((item) => {
            item.style.display = 'block';
            item.addEventListener('click', removeApikey);
        });
}

/**
 * Function creates field in stack block
 * @param {*lbl obj contains required data for label field} lbl
 * @param {*ipt obj contains required data for input field} ipt
 **/
function createApiBlock(lbl, ipt) {
    const label = document.createElement('Label');
    Object.assign(label, {
        for: lbl.for
        , innerText: lbl.text
        , className: lbl.class
    , });
    const input = document.createElement('input');
    Object.assign(input, {
        name: ipt.name
        , className: ipt.class
        , placeholder: ipt.holder
        , title: ipt.title
    , });
    return [label, input];
}

/**
 * Function validates url fields in stack block
 * @param {*urls from field} domain
 * @param {*position of stack block} idx
 **/

function domainCheck(domain, idx) {
    const domainList = domain.split(',');
    const dExp = new RegExp(
        /^((?!-))(xn--)?[a-z0-9][a-z0-9-_]{0,61}[a-z0-9]{0,1}\.(xn--)?([a-z0-9\-]{1,61}|[a-z0-9-]{1,30}\.[a-z]{2,})$/
    );
    const localExp = /(\.\w+)*(:[0-9]+)$/;
    return domainList.map((domain) => {
        if (domain.includes('http') || domain.includes('https')) {
            return true;
        }
        if (dExp.test(domain.trim())) {
            return true;
        }
        if (localExp.test(domain.trim())) {
            return true;
        }
        document.getElementsByClassName('domains')[idx].style.borderColor = 'red';
        return false;
    });
}

/**
 * Function checkes for apikey fields in stack block
 * @param {*apikey from field} stack
 * @param {*position of stack block} idx
 **/

function stackCheck(stack, idx) {
    if (!stack) {
        document.getElementsByClassName('stackId')[idx].style.borderColor = 'red';
        return false;
    }
    return true;
}

/**
 * Function checkes for region fields in stack block
 * @param {*region url from field} region
 * @param {*position of stack block} idx
 * * @param {*value from dropdown in region field} select
 */

function regionCheck(region, idx, select) {
    const dExp = new RegExp(
        /^((?!-))(xn--)?[a-z0-9][a-z0-9-_]{0,61}[a-z0-9]{0,1}\.(xn--)?([a-z0-9\-]{1,61}|[a-z0-9-]{1,30}\.[a-z]{2,})$/
    );

    if (select === 'CR') {
        if (region.includes('https') || region.includes('http')) {
            return true;
        }
        if (dExp.test(region)) {
            return true;
        }
        document.getElementsByClassName('region-inp')[idx].style.borderColor = 'red';
        return false;
    }
    return true;
}

/**
 * Function validates fields in stack block
 * @param {*stack is an array of obj which contains apiKey domain and region value} stack
 */

function fieldValidation(stack) {
    const checkArr = stack.map((obj, index) => {
        const dr = domainCheck(obj.domain, index);
        const rr = regionCheck(obj.region.customUrl, index, obj.region.select);
        const sr = stackCheck(obj.apiKey, index);
        return (dr.every((dm) => dm === true) == rr) == sr;
    });
    validationFlag = checkArr.every((el) => el == true);
}

function create_UUID() {
    var dt = new Date()
        .getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8))
            .toString(16);
    });
    return uuid;
}

/**
 * Function is fetches all the contents from fields and returns an Object containing all data
 */

function fetchFieldContents() {
    const btnColor = document.getElementById('btnColor')
        .value;
    const btnPos = document.getElementById('btnPos')[
        document.getElementById('btnPos')
        .selectedIndex
    ].value;
    let stackId = Array.from(document.getElementsByClassName('stackId'));
    let regions = Array.from(document.getElementsByClassName('regionSelect'));
    let domains = Array.from(document.getElementsByClassName('domains'));
    let stack = regions.map((item, idx) => {
        let regionObj = {};
        regionObj.select = item.value;
        if (item.nextElementSibling.childNodes[2].nodeName === 'INPUT') {
            regionObj.customUrl = item.nextElementSibling.childNodes[2].value;
            return {
                uid: create_UUID()
                , apiKey: stackId[idx].value
                , domain: domains[idx].value
                , region: regionObj
            }
        } else {
            regionObj.customUrl = item.nextElementSibling.childNodes[5].value;
            return {
                uid: create_UUID()
                , apiKey: stackId[idx].value
                , domain: domains[idx].value
                , region: regionObj
            }
        }
    })
    return {
        btnColor
        , btnPos
        , stack
    }
}

/**
 * Function is triggerd after save btn is clicked
 * Function saves all fields data as well as validates all field parameters
 */
function saveOptions() {

    const items = fetchFieldContents();

    fieldValidation(items.stack);

    if (validationFlag) {
        chrome.storage.sync.set({
                stack: items.stack
                , btnColor: items.btnColor
                , btnPos: items.btnPos
            , }
            , () => {
                document.getElementById('errorIcon')
                    .style.display = 'none';
                const status = document.getElementById('displayStatusRemark');
                status.textContent = 'Settings saved successfully';
                status.style.color = '#24c2a3';
                setTimeout(() => {
                    window.close();
                }, 750);
            }
        );
        chrome.storage.sync.get({
                stack: []
                , btn: '#5a20b9'
                , btnPos: 'right'
            , }
            , (getItems) => {
                if (getItems.stack.length != items.stack.length) {
                    const index = Math.abs(getItems.stack.length - items.stack.length)
                    const newApikey = index != 0 ? getItems.filter(prevVal => !items.find(curVal => prevVal.uid === curVal.uid)) : [];
                    newApikey ? newApikey.forEach(stack => {
                        ga('send', {
                            hitType: 'event'
                            , eventCategory: 'Api Key'
                            , eventAction: 'Saved'
                            , eventLabel: `${stack.apiKey}`
                        , });
                    }) : null
                } else {
                    ga('send', {
                        hitType: 'event'
                        , eventCategory: 'Api Key'
                        , eventAction: 'Saved'
                        , eventLabel: `${items.stack[items.stack.length-1].apiKey}`
                    , });
                }
            }
        );
    } else {
        const status = document.getElementById('displayStatusRemark');
        status.textContent = 'Please enter valid inputs';
        status.style.color = '#e44952';
        document.getElementById('errorIcon')
            .style.display = 'inline-block';
    }
}

/**
 * Function creates stack block containing all input fields
 */

function createFields(items) {
    items.stack.forEach((stack, idx) => {
        idx != 0 ? addApikey() : null
        Array.from(document.getElementsByClassName('stackId'))[idx].value = stack.apiKey;
        Array.from(document.getElementsByClassName('domains'))[idx].value = stack.domain;
        const region = Array.from(document.getElementsByClassName('regionSelect'))[idx]
        region.value = stack.region.select;
        if (stack.region.select === 'CR') {
            region.nextElementSibling.style.display = 'block';
            region.parentNode.style.top = '16px';
            region.parentNode.parentNode.style.height = '398px';
            if (
                region.nextElementSibling.childNodes[2].nodeName === 'INPUT'
            ) {
                region.nextElementSibling.childNodes[2].value = stack.region.customUrl;
            } else {
                region.nextElementSibling.childNodes[5].value = stack.region.customUrl;
            }
        }
    })
    document.getElementById('btnColor')
        .value = items.btnColor;
    document.getElementById('btnPos')
        .value = items.btnPos;
}




/**
 * Function is automatically tiggered after everytime option page is open
 * It restores all field content from chrome localstorage
 */

function restoreOptions() {

    chrome.storage.sync.get({
            stack: []
            , btnColor: '#5a20b9'
            , btnPos: 'right'
        , }
        , (items) => {
            createFields(items)
        }
    );
}

/**
 * ImportConfig is triggered after import btn is clicked
 * It call sub-functions which reades imported files
 */
function importConfig(event) {
    const input = event.target
    if ('files' in input && input.files.length > 0) {
        placeFileContent(input.files[0])
    }
}

function placeFileContent(file) {

    readFileContent(file)
        .then(cont => {
            let content = JSON.parse(cont);
            const items = fetchFieldContents();
            let stack = content.stack.concat(items.stack)

            stack = stack.filter(
                (element, idx, arr) =>
                idx === arr.findIndex((elm) => elm.uid === element.uid || element.domain === elm.domain)
            );
            Array.from(document.getElementsByClassName('apikey-block'))
                .forEach((el, idx) => idx != 0 ? el.remove() : null)
            createFields({
                btnColor: content.btnColor
                , btnPos: content.btnPos == 'right' || content.btnPos == 'left' ? content.btnPos : 'right'
                , stack
            });

            let importfile = document.getElementsByClassName('displayExportStatus')[0];
            importfile.style.display = 'block'
            importfile.innerText = 'Imported File Successfully'

            document.getElementsByClassName('dd-menu')[0].style.display = "none"
            setTimeout(function () {
                document.getElementsByClassName('displayExportStatus')[0].style.display = "none"
            }, 5000)
        })
        .catch(error => console.log(error))
}

function readFileContent(file) {
    const reader = new FileReader()
    return new Promise((resolve, reject) => {
        reader.onload = event => resolve(event.target.result)
        reader.onerror = error => reject(error)
        reader.readAsText(file)
    })
}

/**
 * exportConfig is triggered after export btn is clicked
 * It exports contents from chrome storage and create a config.json file
 */

function exportConfig() {
    const items = fetchFieldContents();
    const result = JSON.stringify(items);
    var url = 'data:application/json;base64,' + btoa(result);
    chrome.downloads.download({
        url: url
        , filename: 'contentstack-configuration.json'
    });

    let exportfile = document.getElementsByClassName('displayExportStatus')[0];
    exportfile.style.display = 'block'
    exportfile.innerText = 'Exported File Successfully'

    document.getElementsByClassName('dd-menu')[0].style.display = "none"
    setTimeout(function () {
        document.getElementsByClassName('displayExportStatus')[0].style.display = "none"
    }, 5000)
}

function disableDropdown() {
    document.getElementsByClassName('dd-menu')[0].style.display = "block"
}
document.querySelector('.dd-button')
    .addEventListener('click', disableDropdown)
// 
document.getElementById('save')
    .addEventListener('click', saveOptions);
document.getElementById('stack-api-btn')
    .addEventListener('click', addApikey);
document.getElementById('slt-rgn')
    .addEventListener('change', regionSelection);
document.getElementById('importBtn')
    .addEventListener('change', importConfig);
document.getElementById('exportBtn')
    .addEventListener('click', exportConfig);
document.querySelectorAll('input')
    .forEach((element) => {
        if (element.name !== 'btnColor') {
            element.addEventListener('focus', focusEvent);
        }
    });
document.querySelectorAll('input')
    .forEach((element) => {
        if (element.name !== 'btnColor') {
            element.addEventListener('blur', blurEvent);
        }
    });
