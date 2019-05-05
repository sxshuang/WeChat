// 得到全局的app.js中的定义对象
var app = getApp();
// 引用util.js文件
var util = require('../../utils/util.js')

Page({

  data: {
    // 这里最好初始值一下，因为在初始化的时候，template模板绑定数据，不定义他们，找不到会报错
    inTheaters: {},
    comingSoon: {},
    top250: {},
    searchResult: {},
    containerShow: true,
    searchPanelShow: false
  },
  onLoad(event) {
    // 豆瓣API官网的参数，start表示从第几页开始，count表示一页多少条数据
    // 正在热映url
    var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3";
    // 即将上映
    var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3";
    // top250
    var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3"

    // 调用请求豆瓣API自定义函数
    this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映")
    this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映")
    this.getMovieListData(top250Url, "top250", "top250")
  },
  // 电影 更多 跳转
  onMoreTap: function(event) {
    // console.log(event)
    // 在 more-movie-template模板中，data-xxx 给 ‘更多’ 绑定数据，就是为了在下边跳转中传参数，跳到该跳的电影类型
    var movietitle = event.currentTarget.dataset.movietitle;
    wx.navigateTo({
      url: "more-movie/more-movie?movietitle=" + movietitle
    })

  },
  // 跳转电影详情页面
  onMovieTap: function(event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: "movie-detail/movie-detail?id=" + movieId
    })
  },
  getMovieListData: function(url, settedKey, movieTitle) {
    var that = this;
    wx.request({
      // 这里有坑，豆瓣拒绝了小程序访问豆瓣API（因为太多了），要设置代理请求
      url: url,
      data: {},
      method: "GET", //OPTIONS,GET,HEAD,POST,PUT,DELETE,TRACE,CONNECT
      header: {
        // 这里也有坑，必须用 "Content-Type":"json" 或者 "Content-Type": "application/xml"
        "Content-Type": "application/xml"
      },
      success(res) {
        // console.log(res.data)
        that.processDoubanData(res.data, settedKey, movieTitle)

      },
      fail(error) {
        console.log(error)
      }
    })
  },
  // 实现点击x号，关闭搜索框
  onCancelImgeTap: function() {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      // 搜索完，然后返回，把搜出的清空
      searchResult: {}

    })
  },
  // 获取焦点要做的事情
  onBindFocus: function() {
    this.setData({
      containerShow: false,
      searchPanelShow: true
    })
  },
  // 搜索功能
  onBindBlur: function(event) {
    var text = event.detail.value;
    var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
    // 发送一下请求
    this.getMovieListData(searchUrl, "searchResult", "")

  },
  processDoubanData: function(moviesDouban, settedKey, movieTitle) {
    var movies = [];
    // 这个获取到请求的数据的函数在，success函数中调用了，subjects这个是请求返回的json数组人家写的数组名字
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title
      if (title.length >= 6) {
        // 如果title长度超过6，从0截取到6个字符，后边用省略号代替 
        title = title.substring(0, 6) + "..."
      }
      // stars数组形式：[1,1,1,1,1] [1,1,1,0,0] 它评星转换，1表示黄星星，0表示黑星星

      // 把数据放到自己定义的对象中
      var temp = {
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id,
        // 得到的评星数，通过util.js代码转换成上边的形式
        stars: util.converToStarsArray(subject.rating.stars)
      }
      //把自定义的对象，push到 上边定义的 movies数组中
      movies.push(temp)
    }
    // 利用JavaScript动态属性，来解决传过来的settedKey,传这个参数是为了判断是哪一类的电影
    var readyData = {};
    // 请求到的每一类电影，放到对应的每个settedKey的数组中，
    readyData[settedKey] = {
      movieTitle: movieTitle,
      movies: movies
    }
    // 把所有的数据放到readyData中
    this.setData(readyData)
    // 如果有不懂，防止混乱查看这个数据
    // console.log(readyData)
  }

})