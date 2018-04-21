var benbenpage = 1;
var luoguURL = "https://luogu.org";
var data = [];

function add(page, html) {
  data[page] = html;
}

function exist(page) {
  return data.findIndex(page);
}

// 替换其中的链接
function replaceHref() {
  let messages = document.getElementsByClassName(
    "am-comment am-comment-warning"
  );
  for (var i in messages) {
    let oldElem = messages[i]
      .getElementsByClassName("am-comment-meta")[0]
      .getElementsByTagName("a")[0];

    // find href in message
    const messageURL = oldElem.getAttribute("href");
    // get New href
    let url = `${luoguURL}${messageURL}`;

    // create
    oldElem.removeAttribute("href");
    oldElem.setAttribute("href", url);
    oldElem.setAttribute("target", "_");
    console.log(oldElem);
  }
  console.log(messages);
}

function nextPage() {
  request(benbenpage, () => {
    benbenpage++;
    console.log(benbenpage);
  });
  replaceHref();
}

function prePage() {
  request(benbenpage, () => {
    if (benbenpage >= 1) benbenpage--;
    else {
      const elem = document.getElementById("notice");
      elem.innerHTML = "<p>已经是第一页！</p>";
    }
  });
  replaceHref();
}

function request(page, success) {
  const rq = new XMLHttpRequest();
  rq.onreadystatechange = () => {
    const elem = document.getElementById("notice");
    let html = "<p>未知错误</p>";
    if (rq.status == 200) {
      // when success to access
      const responseText = rq.response;
      const context = JSON.parse(responseText);
      // console.log(responseText);
      html = context["more"].html;
      success();
    }
    elem.innerHTML = html;
  };
  rq.open(
    "GET",
    `https://www.luogu.org/space/ajax_getnotice?uid=72813&mynotice=1&page=${page.toString()}`,
    false
  );
  rq.send();
}

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("next_notice").addEventListener("click", nextPage);
  document.getElementById("pre_notice").addEventListener("click", prePage);
  document.getElementById("test").addEventListener("click", test);
});

// 洛谷网页的转换函数，在Chrome插件中无法使用
// $.get("/space/ajax_mynotice", function(data) {
//   var arr = eval("(" + data + ")");
//   $(".lg-content-left").html(arr["more"]["html"]);
// });
