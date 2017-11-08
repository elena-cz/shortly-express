const parseCookies = (req, res, next) => {
  if (req.headers.cookie) {
    
    var cookieArr = req.headers.cookie.split(';');
    var cookies = {};
    
    for (let i = 0; i < cookieArr.length; i++) {
      let temp = cookieArr[i].split('=');
      let key = temp[0].trim();
      let val = temp[1].trim();
      cookies[key] = val;
    }
    
    req.cookies = cookies;
  } else {
    req.cookies = {};
  }
  next();
};

module.exports = parseCookies;