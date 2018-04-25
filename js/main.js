// Global var
var benbenpage = 1;
var luoguURL = "https://luogu.org";
var noticeURL =
  "https://www.luogu.org/space/ajax_getnotice?uid=1&mynotice=1&page=";
var commentURL =
  "https://www.luogu.org/space/ajax_getnotice?uid=1&mynotice=0&page=";
var uid = 1;
var getcharURL = "https://www.luogu.org/space/ajax_getchatnum"; // 接收通知地址
var HTML = [];
//
function setUrls(uid_) {
  uid = uid_;
  noticeURL = `https://www.luogu.org/space/ajax_getnotice?uid=${uid_}&mynotice=1&page=`;
  commentURL = `https://www.luogu.org/space/ajax_getnotice?uid=${uid_}&mynotice=0&page=`;
}

function save(html, page) {
  if (!page) return;
  HTML[page] = html;
}

function exist(page) {
  return !(HTML[page] === null)
}

function noticeURL(uid) {
  `${noticeURL}`;
}

// 初始化uid等多种信息
// 本人不会其他方法，只好先加html然后读取uid再删除了
function init() {
  const rq = new XMLHttpRequest();
  rq.onload = () => {
    const ele = document.getElementById("web");
    ele.innerHTML = rq.response;
    const lis = ele.getElementsByClassName('am-dropdown-content');
    const url = lis[1].getElementsByTagName('a')[0].getAttribute('href');
    var regex = /\d+/g;
    const uid_ = url.match(regex)[0];
    setUrls(uid_);
    ele.innerHTML = '';
    console.log(uid_);
  };
  rq.open("GET", luoguURL, true);
  rq.send();
  // TODO
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
  let tags = document.getElementById('notice').getElementsByTagName('a');
  console.log(tags);
  for (var i in tags) {
    if (tags[i].hasAttribute('href')) {
      let href = tags[i].getAttribute('href');
      var regex = /^\/*/;
      const url = `${luoguURL}${href}`;
      href = href.replace(regex, url);
      tags[i].setAttribute('href', href);
      tags[i].setAttribute('target', '_');
    }
  }
}


// replaceHref 方法采用同步方法会导致出错
function nextPage() {
  getNotice(benbenpage, noticeURL, () => {
    benbenpage++;
    setTimeout(replaceHref, 10);
  });
}

function prePage() {
  getNotice(benbenpage, noticeURL, () => {
    if (benbenpage > 2) benbenpage--;
    setTimeout(replaceHref, 10);
  });
}

function getNotice(page, url, success) {
  const rq = new XMLHttpRequest();
  rq.onload = () => {
    const elem = document.getElementById("notice");
    let html = "<p>未知错误</p>"; // error status
    if (rq.status === 200) {
      // when success to access
      const responseText = rq.response;
      const context = JSON.parse(responseText); // 此处转化会有报错，但是不影响实际使用
      html = context["more"].html;
      success();
    } else {

    }
    elem.innerHTML = html;
  };
  rq.open("GET", `${url}${page.toString()}`, true);
  rq.send();
}

document.addEventListener("DOMContentLoaded", function () {
  // 初始化
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