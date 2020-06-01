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
      newBlock[0].childNodes[0].childNodes[0].style.display = "none";
    }
  }
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
  console.log('saving setting');
  var stackId = Array.from(document.getElementsByClassName("stackId"));
  stackId = stackId.map((el) => el.value);
  var btnColor = document.getElementById("btnColor").value;
  var btnPos = document.getElementById("btnPos")[
    document.getElementById("btnPos").selectedIndex].value;
  var domains = Array.from(document.getElementsByClassName("domains"));
  domains = domains.map((el) => el.value);
  chrome.storage.sync.set(
    {
      stack: stackId,
      btn: btnColor,
      btnPos: btnPos,
      dom: domains,
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
    },
    function (items) {
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
      } else {
        if (items.stack[0]) {
          document.getElementById("stackKeyId").value = items.stack[0];
          document.getElementById("domainKeyId").value = items.dom[0];
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
