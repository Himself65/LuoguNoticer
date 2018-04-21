function getLuoguCookie() {
  // 立即执行，读取Cookies
  let cookie = "";
  details = {
    domain: ".luogu.org"
  };

  chrome.cookies.getAll(details, function(cookies) {
    for (var i in cookies) {
      if (cookies[i].domain === "class.luogu.org") continue; // 忽略洛谷网课
      const name = cookies[i].name; // cookie's name
      const value = cookies[i].value; // cookie's value
      //
      const cookieTemplate = `${name}:${value};`;

      cookie = cookie.concat(cookieTemplate);
    }
  });
}
