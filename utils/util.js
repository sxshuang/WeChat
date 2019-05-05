// 公共可以复用的代码

// 功能：判断星星评分
function converToStarsArray(stars) {
  // 截取第一个数字
  var num = stars.toString().substring(0, 1);
  var array = [];
  for (var i = 1; i <= 5; i++) {
    if (i < num) {
      array.push(1)
    } else {
      array.push(0)
    }
  }
  return array;
}

// 功能：拼接演员名字
function convertToCastString(casts) {
  var castsjoin = "";
  for (var idx in casts) {
    // 演员的名字拼接起来（如：周星驰 / 吴孟达 / 沈腾）
    castsjoin = castsjoin + casts[idx].name + "/"
  }
  // 最后把 一个/去除掉
  return castsjoin.substring(0, castsjoin.length - 2);
}


// 功能：拼接演员的图片
function convertToCastInfos(casts) {
  var castsArray = [];
  for (var idx in casts) {
    var cast = {
      img: casts[idx].avatars ? casts[idx].avatars.large : "",
      name: casts[idx].name
    }
    castsArray.push(cast);
  }
  return castsArray;
}


// 功能：发送http请求
function http(url, callBack) {
  wx.request({
    url: url,
    data: {},
    method: "GET",
    header: {
      // 这里也有坑，必须用 "Content-Type":"json" 或者 "Content-Type": "application/xml"
      "Content-Type": "application/xml"
    },
    success(res) {
      callBack(res.data)
    },
    fail(error) {
      console.log(error)
    }
  })
}

module.exports = {
  converToStarsArray: converToStarsArray,
  http: http,
  convertToCastString: convertToCastString,
  convertToCastInfos: convertToCastInfos
}