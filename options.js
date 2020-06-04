function focus_event(evt) {
  evt.target.parentNode.childNodes[1].style.display = "block";
  evt.target.style.cssText =
    "border: 1px solid #24c2a3; box-sizing: border-box; border-radius: 1px; background: #f7fbfd;";
}
function blur_event(evt) {
  evt.target.parentNode.childNodes[1].style.display = "none";
  evt.target.style.cssText =
    "border: 1px solid #dfe2ea; box-sizing: border-box; border-radius: 1px; background: transparent;";
}
function dynamic_focus_event(evt) {
  evt.target.parentNode.childNodes[0].style.display = "block";
  evt.target.style.cssText =
    "border: 1px solid #24c2a3; box-sizing: border-box; border-radius: 1px; background: #f7fbfd;";
}
function dynamic_blur_event(evt) {
  evt.target.parentNode.childNodes[0].style.display = "none";
  evt.target.style.cssText =
    "border: 1px solid #dfe2ea; box-sizing: border-box; border-radius: 1px; background: transparent;";
}

function remove_apikey(evt) {
  let block_array = Array.from(document.getElementsByClassName("apikey-block"));
  if (block_array.length > 1) {
    evt.target.parentNode.parentNode.remove();
    let newBlock = Array.from(document.getElementsByClassName("apikey-block"));
    if (newBlock.length === 1) {
      if (newBlock[0].childNodes[0].nodeName === "DIV") {
        newBlock[0].childNodes[0].childNodes[0].style.display = "none";
      } else {
        newBlock[0].childNodes[1].childNodes[0].style.display = "none";
      }
    }
  }
}

function regionSelection(evt) {
  console.log(evt);

  if (evt.target.value === "CR") {
    evt.target.parentNode.parentNode.style = "height:424px";
    if (evt.target.parentNode.childNodes[2].nodeName === "DIV") {
      evt.target.parentNode.childNodes[2].style = "display:block";
    } else {
      evt.target.parentNode.childNodes[5].style = "display:block";
    }
  } else {
    evt.target.parentNode.parentNode.style = "height:316px";
    if (evt.target.parentNode.childNodes[2].nodeName === "DIV") {
      evt.target.parentNode.childNodes[2].style = "display:none";
    } else {
      evt.target.parentNode.childNodes[5].style = "display:none";
    }
  }
}

function createsRegionSetting() {
  var regionMainDiv = document.createElement("div");
  regionMainDiv.className = "region-setting";
  var rgnMainLabel = document.createElement("Label");
  rgnMainLabel.for = "region";
  rgnMainLabel.className = "region-select-label";
  rgnMainLabel.innerText = "Select Region";

  var selectTag = document.createElement("select");
  selectTag.className = "regionSelect";
  selectTag.addEventListener("change", regionSelection);
  var op1 = document.createElement("option");
  op1.value = "app.contentstack.com";
  op1.innerText = "North America";

  var op2 = document.createElement("option");
  op2.value = "eu-app.contentstack.com";
  op2.innerText = "Europe";

  var op3 = document.createElement("option");
  op3.value = "CR";
  op3.innerText = "Other";

  selectTag.appendChild(op1);
  selectTag.appendChild(op2);
  selectTag.appendChild(op3);

  var containerDiv = document.createElement("div");
  containerDiv.className = "container";
  containerDiv.classList.add("rgn-setting-cnt");
  var containerSpan = document.createElement("span");
  containerSpan.className = "container-bar";
  var containerLabel = document.createElement("Label");
  containerLabel.for = "region";
  containerLabel.className = "region-label";
  containerLabel.innerText = "Region";
  var inputFiled = document.createElement("input");
  (inputFiled.name = "region"), (inputFiled.className = "region-inp");
  inputFiled.value = "";
  inputFiled.placeholder = "eu-app.contentstack.com";
  inputFiled.addEventListener("focus", dynamic_focus_event);
  inputFiled.addEventListener("blur", dynamic_blur_event);
  containerDiv.appendChild(containerSpan);
  containerDiv.appendChild(containerLabel);
  containerDiv.appendChild(inputFiled);

  regionMainDiv.appendChild(rgnMainLabel);
  regionMainDiv.appendChild(selectTag);
  regionMainDiv.appendChild(containerDiv);
  return regionMainDiv;
}

function add_apikey() {
  var lbl, ipt;

  lbl = { for: "stackId", class: "stack-label", text: "Stack API Key" };
  ipt = { name: "stackId", class: "stackId", holder: "API key" };
  var border_div = document.createElement("div");
  border_div.className = "apikey-block";
  var stack_details = create_Elements(lbl, ipt);
  var cnt_div = document.createElement("div");
  cnt_div.className = "container";
  var span_bar = document.createElement("span");
  span_bar.className = "container-bar";
  var cnt_remove = document.createElement("div");
  cnt_remove.className = "remove-btn-div";
  var remove_btn = document.createElement("button");
  remove_btn.className = "remove-btn";
  cnt_remove.appendChild(remove_btn);

  cnt_div.appendChild(span_bar);
  cnt_div.appendChild(stack_details[0]);
  cnt_div.appendChild(stack_details[1]);

  stack_details[1].addEventListener("focus", dynamic_focus_event);
  stack_details[1].addEventListener("blur", dynamic_blur_event);
  border_div.appendChild(cnt_remove);
  border_div.appendChild(cnt_div);
  lbl = {
    for: "domains",
    class: "domain-label",
    text: "Domain Name or Host",
  };
  ipt = {
    name: "domains",
    class: "domains",
    holder: "example.com, localhost:3000",
  };
  var domains_details = create_Elements(lbl, ipt);
  cnt_div = document.createElement("div");
  cnt_div.className = "container";
  span_bar = document.createElement("span");
  span_bar.className = "container-bar";
  cnt_div.appendChild(span_bar);
  cnt_div.appendChild(domains_details[0]);
  cnt_div.appendChild(domains_details[1]);
  domains_details[1].addEventListener("focus", dynamic_focus_event);
  domains_details[1].addEventListener("blur", dynamic_blur_event);
  border_div.appendChild(cnt_div);
  border_div.appendChild(createsRegionSetting());
  // document.getElementById("apikey-div").appendChild(border_div);
  document
    .getElementById("apikey-div")
    .insertBefore(border_div, document.getElementById("stack-api-btn"));
  document.querySelectorAll(".remove-btn").forEach((item) => {
    item.style.display = "block";
    item.addEventListener("click", remove_apikey);
  });
}
function create_Elements(lbl, ipt) {
  var label = document.createElement("Label");
  Object.assign(label, {
    for: lbl.for,
    innerText: lbl.text,
    className: lbl.class,
  });
  var input = document.createElement("input");
  Object.assign(input, {
    name: ipt.name,
    className: ipt.class,
    placeholder: ipt.holder,
  });
  return [label, input];
}

function save_options() {
  console.log("saving setting");
  var stackId = Array.from(document.getElementsByClassName("stackId"));
  stackId = stackId.map((el) => el.value);
  var btnColor = document.getElementById("btnColor").value;
  var btnPos = document.getElementById("btnPos")[
    document.getElementById("btnPos").selectedIndex
  ].value;
  var regions = Array.from(document.getElementsByClassName("regionSelect"));
  var newArr =[];
   regions.forEach(regionValue =>{
    let obj={};
    obj["select"]=regionValue.value;
    if (
      regionValue.nextElementSibling.childNodes[2].nodeName === "INPUT"
    ) {
      obj["customData"]= regionValue.nextElementSibling.childNodes[2].value
    } else {
      obj["customData"]= regionValue.nextElementSibling.childNodes[5].value
    }
    
    newArr.push(obj);
  })
  regions = newArr

  var domains = Array.from(document.getElementsByClassName("domains"));
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
      var status = document.getElementById("status");
      status.textContent = "Settings saved successfully";
      setTimeout(function () {
        window.close();
      }, 750);
    }
  );
}

function restore_options() {
  chrome.storage.sync.get(
    {
      stack: "",
      dom: "",
      btn: "#5a20b9",
      btnPos: "right",
      region: "",
    },
    function (items) {
      console.log('restore', items);
      
      if (items.stack.length > 1) {
        for (let i = 1; i < items.stack.length; i++) {
          add_apikey();
        }

        Array.from(document.getElementsByClassName("stackId")).forEach(
          (element, idx) => {
            element.value = items.stack[idx];
          }
        );
        Array.from(document.getElementsByClassName("domains")).forEach(
          (element, idx) => {
            element.value = items.dom[idx];
          }
        );
        Array.from(document.getElementsByClassName("regionSelect")).forEach(
          (element, idx) => {
            element.value = items.region[idx].select;
            if (items.region[idx].select === "CR") {
              element.nextElementSibling.style.display = "block";
              element.parentNode.parentNode.style.height = "424px"
              if (
                element.nextElementSibling.childNodes[2].nodeName === "INPUT"
              ) {
                element.nextElementSibling.childNodes[2].value =
                  items.region[idx].customData;
              } else {
                element.nextElementSibling.childNodes[5].value =
                  items.region[idx].customData;
              }
            }
          }
        );
      } else {
        if (items.stack[0]) {
          document.getElementById("stackKeyId").value = items.stack[0];
          document.getElementById("domainKeyId").value = items.dom[0];
          document.getElementById("slt-rgn").value = items.region[0].select;
          if (items.region === "CR") {
            document.getElementById("region-div").style = "display:block";
            document.getElementById("regionId").value = items.customRgn[0].customData;
          }
        }
      }
      document.getElementById("btnColor").value = items.btn;
      document.getElementById("btnPos").value = items.btnPos;
    }
  );
}
document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click", save_options);
document.getElementById("stack-api-btn").addEventListener("click", add_apikey);
document.getElementById("slt-rgn").addEventListener("change", regionSelection);
document.querySelectorAll("input").forEach((element) => {
  if (element.name !== "btnColor") {
    element.addEventListener("focus", focus_event);
  }
});
document.querySelectorAll("input").forEach((element) => {
  if (element.name !== "btnColor") {
    element.addEventListener("blur", blur_event);
  }
});
