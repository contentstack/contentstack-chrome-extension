/* eslint-disable no-undef */
var storeApikey=[]

chrome.runtime.onMessage.addListener(
  function(request) {
      if (request.type === 'clicked') {
          _gaq.push(['_trackEvent','Quick Edits', 'Entry Edit', `${request.data}`]);
      }
  }
);

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

function removeApikey(evt) {
  let blockArray = Array.from(document.getElementsByClassName('apikey-block'));
  if (blockArray.length > 1) {
    evt.target.parentNode.parentNode.remove();
    let newBlock = Array.from(document.getElementsByClassName('apikey-block'));
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

function createsRegionSetting() {
  let regionMainDiv = document.createElement('div');
  regionMainDiv.className = 'region-setting';
  let rgnMainLabel = document.createElement('Label');
  rgnMainLabel.for = 'region';
  rgnMainLabel.className = 'region-select-label';
  rgnMainLabel.innerText = 'Region';

  let selectTag = document.createElement('select');
  selectTag.className = 'regionSelect';
  selectTag.addEventListener('change', regionSelection);
  let op1 = document.createElement('option');
  op1.value = 'app.contentstack.com';
  op1.innerText = 'North America';

  let op2 = document.createElement('option');
  op2.value = 'eu-app.contentstack.com';
  op2.innerText = 'Europe';

  let op3 = document.createElement('option');
  op3.value = 'CR';
  op3.innerText = 'Other';

  selectTag.appendChild(op1);
  selectTag.appendChild(op2);
  selectTag.appendChild(op3);

  let containerDiv = document.createElement('div');
  containerDiv.className = 'container';
  containerDiv.classList.add('rgn-setting-cnt');
  let containerSpan = document.createElement('span');
  containerSpan.className = 'container-bar';
  containerSpan.classList.add('custom-bar');
  let containerLabel = document.createElement('Label');
  containerLabel.for = 'region';
  containerLabel.className = 'region-label';
  containerLabel.innerText = '';
  let inputFiled = document.createElement('input');
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

function addApikey() {
  let lbl;
  let ipt;

  lbl = { for: 'stackId', class: 'stack-label', text: 'Stack API Key' };
  ipt = { name: 'stackId', class: 'stackId', holder: 'API key', title:'Enter your stack API key' };
  let borderDiv = document.createElement('div');
  borderDiv.className = 'apikey-block';
  let stackDetails = createApiBlock(lbl, ipt);
  let cntDiv = document.createElement('div');
  cntDiv.className = 'container';
  let spanBar = document.createElement('span');
  spanBar.className = 'container-bar';
  let cntRemove = document.createElement('div');
  cntRemove.className = 'remove-btn-div';
  let removeBtn = document.createElement('button');
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
    for: 'domains',
    class: 'domain-label',
    text: 'Domain Name or Host'
  };
  ipt = {
    name: 'domains',
    class: 'domains',
    holder: 'example.com, localhost:3000',
    title: 'Enter your domain names seprated by ,'
  };
  let domainsDetails = createApiBlock(lbl, ipt);
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
  document.querySelectorAll('.remove-btn').forEach((item) => {
    item.style.display = 'block';
    item.addEventListener('click', removeApikey);
  });
}
function createApiBlock(lbl, ipt) {
  let label = document.createElement('Label');
  Object.assign(label, {
    for: lbl.for,
    innerText: lbl.text,
    className: lbl.class
  });
  let input = document.createElement('input');
  Object.assign(input, {
    name: ipt.name,
    className: ipt.class,
    placeholder: ipt.holder,
    title: ipt.title
  });
  return [label, input];
}

function saveOptions() {
  let stackId = Array.from(document.getElementsByClassName('stackId'));
  stackId = stackId.map((el) => el.value);
  let btnColor = document.getElementById('btnColor').value;
  let btnPos = document.getElementById('btnPos')[
    document.getElementById('btnPos').selectedIndex
  ].value;
  let regions = Array.from(document.getElementsByClassName('regionSelect'));
  let newArr = [];
  regions.forEach((regionValue) => {
    let obj = {};
    obj.select = regionValue.value;
    if (regionValue.nextElementSibling.childNodes[2].nodeName === 'INPUT') {
      obj.customData = regionValue.nextElementSibling.childNodes[2].value;
    } else {
      obj.customData = regionValue.nextElementSibling.childNodes[5].value;
    }

    newArr.push(obj);
  });
  regions = newArr;

  let domains = Array.from(document.getElementsByClassName('domains'));
  domains = domains.map((el) => el.value);
  chrome.storage.sync.set(
    {
      stack: stackId,
      btn: btnColor,
      btnPos: btnPos,
      dom: domains,
      region: regions,

    },
    function () {
      let status = document.getElementById('status');
      status.textContent = 'Settings saved successfully';
      setTimeout(function () {
        window.close();
      }, 750);
    }
  );
 
  stackId.forEach((el)=>{
    if (!storeApikey.includes(el)) {
      _gaq.push(['_trackEvent','Api Key', 'Saved', `${el}`])
    }
  })  
  
}

function restoreOptions() {
  chrome.storage.sync.get(
    {
      stack: '',
      dom: '',
      btn: '#5a20b9',
      btnPos: 'right',
      region: ''
    },
    function (items) {
      if (items.stack.length > 1) {
        for (let i = 1; i < items.stack.length; i++) {
          addApikey();
        }
        storeApikey = items.stack;
        Array.from(document.getElementsByClassName('stackId')).forEach(
          (element, idx) => {
            element.value = items.stack[idx];
          }
        );
        Array.from(document.getElementsByClassName('domains')).forEach(
          (element, idx) => {
            element.value = items.dom[idx];
          }
        );
        Array.from(document.getElementsByClassName('regionSelect')).forEach(
          (element, idx) => {
            element.value = items.region[idx].select;
            if (items.region[idx].select === 'CR') {
              element.nextElementSibling.style.display = 'block';
              element.parentNode.style.top = '16px';
              element.parentNode.parentNode.style.height = '398px';
              if (
                element.nextElementSibling.childNodes[2].nodeName === 'INPUT'
              ) {
                element.nextElementSibling.childNodes[2].value = items.region[idx].customData;
              } else {
                element.nextElementSibling.childNodes[5].value = items.region[idx].customData;
              }
            }
          }
        );
      } else if (items.stack[0]) {
        document.getElementById('stackKeyId').value = items.stack[0];
        document.getElementById('domainKeyId').value = items.dom[0];
        document.getElementById('slt-rgn').value = items.region[0].select;
        if (items.region[0].select === 'CR') {
          document.getElementById('region-div').style.display= 'block';
          document.getElementById('regionSetting').style.top= '16px';
          document.getElementById('apiBlock').style.height = '398px';
          document.getElementById('regionId').value = items.region[0].customData;
        }
      }
      document.getElementById('btnColor').value = items.btn;
      document.getElementById('btnPos').value = items.btnPos;
    }
  );
}
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('stack-api-btn').addEventListener('click', addApikey);
document.getElementById('slt-rgn').addEventListener('change', regionSelection);
document.querySelectorAll('input').forEach((element) => {
  if (element.name !== 'btnColor') {
    element.addEventListener('focus', focusEvent);
  }
});
document.querySelectorAll('input').forEach((element) => {
  if (element.name !== 'btnColor') {
    element.addEventListener('blur', blurEvent);
  }
});
