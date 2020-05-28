chrome.storage.sync.get(
  ["dom", "stack", "type", "btn", "btnPos", "watch", "delay"],
  function (items) {
    checkDomain(items.dom, items.stack, items.btn, items.btnPos);
  }
);
function checkDomain(dom, stack, btn, btnPos) {
  var domains = dom.map((el) => el.split(","));
  var host = window.location.host;
  var stacks = stack;
  if (stacks.length > 1) {
    stacks.forEach((stack, idx) => {
      var domain = domains[idx];
      for (var x = 0; x < domain.length; x++) {
        var hostRX = new RegExp("^" + domain[x] + "$");
        if (hostRX.test(host)) {
          buildBtn(stack, btn, btnPos);
          return;
        }
      }
    });
  } else {
    let domain = domains[0];
    for (var x = 0; x < domain.length; x++) {
      var hostRX = new RegExp("^" + domain[x] + "$");
      if (hostRX.test(host)) {
        buildBtn(stack[0], btn, btnPos);
        return;
      }
    }
  }
}
function buildBtn(stack, btn, btnPos) {
  var pageRef = document.body.getAttribute("data-pageref");
  var ct = document.body.getAttribute("data-contenttype");
  var local = document.body.getAttribute("data-locale");
  if (stack && ct && local && pageRef) {
    var a = document.createElement("a");
    a.className = "ext__cms__edit";
    a.innerHTML = "Edit";
    a.style.backgroundColor = btn;
    a.setAttribute("target", "blank");
    a.href =
      "https://app.contentstack.com/#!/stack/" +
      stack +
      "/content-type/" +
      ct +
      "/" +
      local +
      "/entry/" +
      pageRef +
      "/edit";
    document.body.appendChild(a);

    var b = document.createElement("style");
    b.innerHTML =
      ".ext__cms__edit{position:fixed;" +
      btnPos +
      ":30px;bottom:30px;width:60px;height:60px;z-index: 99;border-radius:30px;background-color:#5a20b9;-webkit-box-shadow:0 0 20px 0 rgba(255,255,255,1);-moz-box-shadow:0 0 20px 0 rgba(255,255,255,1);box-shadow:0 0 20px 0 rgba(255,255,255,1);text-indent:-9999px;background-image:url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'%3e%3cpath d='M17.6 35.8l16.2-16.2 6.3 6.3C34.8 31.3 29.4 36.7 24 42.1c-2.1-2-4.3-4.2-6.4-6.3zM41.9 24.3l-6.4-6.4.9-.9c.7-.6 1.3-1.3 2-1.9 1.1-1 2.7-1 3.8 0 1 1 2.1 2 3.1 3.1.8.9.8 2.1-.1 3-1.1 1-2.1 2-3.3 3.1.1-.1.1-.1 0 0zM15.8 37.6l6.4 6.4c-.5.1-1.1.3-1.6.4-1.8.4-3.5.9-5.3 1.3-.7.2-1.2-.2-1-1 .5-2.4 1-4.7 1.5-7.1 0 .1 0 0 0 0z' fill='%23fff'/%3e%3c/svg%3e\");background-size:50px 50px;background-position:center center}";
    document.head.appendChild(b);

    chrome.runtime.sendMessage({ action: "active" });
  }
}
