var benbenpage = 1;
var luoguURL = "https://luogu.org";
var noticeURL =
  "https://www.luogu.org/space/ajax_getnotice?uid=72813&mynotice=1&page=";
var commentURL =
  "https://www.luogu.org/space/ajax_getnotice?uid=71371&mynotice=0&page=";
var uid = 1;

var getcharURL = "https://www.luogu.org/space/ajax_getchatnum"; // 接收通知地址

function noticeURL(uid) {
  `${noticeURL}`;
}

// 初始化uid等多种信息
function init() {
  const rq = new XMLHttpRequest();
  rq.onreadystatechange = () => {
    document.getElementById("web").innerHTML = rq.response;
  };
  rq.open("GET", luoguURL, true);
  rq.send();
}

// 找到对方说的话
function findComment() {
  //
  var comments = document.getElementsByClassName("am-comment");
  for (var i in comments) {
    const comment = comments[i];
    const url = comment.getElementsByTagName("a")[0].getAttribute("href");
  }
}

// 替换所有链接
function replaceHref() {
  var tags = document.getElementById("notice").getElementsByTagName("a");
  console.log(tags);
  var regex = /\/*/;
  for (i in tags) {
    console.log(tags[i]);
    const href = tags[i].getAttribute("href");
    if (href && regex.test(href)) {
      const url = `${luoguURL}${href}`;
      tags[i].setAttribute("href", url);
      tags[i].setAttribute("target", "_");
    }
  }
  console.log("替换完成");
}

function nextPage() {
  request(
    benbenpage,
    html => {
      benbenpage++;
    },
    noticeURL
  );
  replaceHref();
}

function prePage() {
  request(
    benbenpage,
    html => {
      if (benbenpage > 2) benbenpage--;
    },
    noticeURL
  );
  replaceHref();
}

function request(page, success, url) {
  const rq = new XMLHttpRequest();
  rq.onloadend = () => {
    const elem = document.getElementById("notice");
    let html = "<p>未知错误</p>";
    if (rq.status == 200) {
      // when success to access
      const responseText = rq.response;
      const context = JSON.parse(responseText);
      // console.log(responseText);
      html = context["more"].html;
      success(html);
    }
    elem.innerHTML = html;
  };
  rq.open("GET", `${url}${page.toString()}`, true);
  rq.send();
}

document.addEventListener("DOMContentLoaded", function() {
  init();
  document.getElementById("next_notice").addEventListener("click", nextPage);
  document.getElementById("pre_notice").addEventListener("click", prePage);
  document.getElementById("test").addEventListener("click", test);
});

// 洛谷网页的转换函数，在Chrome插件中无法使用
// $.get("/space/ajax_mynotice", function(data) {
//   var arr = eval("(" + data + ")");
//   $(".lg-content-left").html(arr["more"]["html"]);
// });
