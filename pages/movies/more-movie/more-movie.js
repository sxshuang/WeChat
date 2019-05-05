var app = getApp();
var util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movies: {},
    navigateTitle: "",
    requestUrl: "",
    totalCount: 0,
    // 这个是为了，下拉加载更多，让他们累加
    isEmpty: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 判断拿到三种中，哪种电影类型，点击‘更多’便于跳转到对应的电影类型
    var movietitle = options.movietitle;
    this.data.navigateTitle = movietitle;
    // console.log(movietitle)
    var dataUrl = "";
    switch (movietitle) {
      case "正在热映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
        break;
      case "即将上映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
        break;
      case "top250":
        dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
        break
    }

    util.http(dataUrl, this.processDoubanData);
    // 这里是把请求的url绑定到data中，便于后边加载更多获取
    this.data.requestUrl = dataUrl

  },
  // 滚动事件（在wxss中必须给容器一个高）
  onScrollLower(event) {
    var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.processDoubanData)
    // 发送请求你的时候加载loading，关闭是在绑定完数据后关闭；（这个加载位置在导航栏上）
    wx.showNavigationBarLoading();
  },
  // 点击不松下拉刷新，加载数据
  onPullDownRefresh(event) {
    var refreshUrl = this.data.requestUrl + "?start=0&count=20"
    // 下拉刷新，要把数据置空，拉下会加载数据，如果不置空，代码会走下边加载页面的if判断，不置空，相当于页面会加载0-19旧数据+0-19新数据
    this.data.movies = {};
    this.data.isEmpty = true;
    //如果不重置为0， 当加载更多，然后刷新，重新加载，就不会从第0条开始加载，会跳过之前的前20条加载
    this.data.totalCount = 0;
    util.http(refreshUrl, this.processDoubanData);
    wx.showNavigationBarLoading()
  },

  processDoubanData(moviesDouban) {
    // console.log(data)
    var movies = [];
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

    // 功能：实现加载更多（比如：评论等等）
    var totalMovies = {}
    // 如果要绑定新加载的数据，那么需要同已有的数据合并在一起
    if (!this.data.isEmpty) {
      // 如果isEmpty不是空，则把数据追加到movies中,放到totalMovies中
      totalMovies = this.data.movies.concat(movies)
    } else {
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    // 这里是获取 更多 电影
    this.setData({
      movies: totalMovies
    });
    // 在获取更多的时候，在页面中每次下拉加载更多，都要多出来20条
    this.data.totalCount += 20;

    // 滑动时，发送请求的时候loading，当数据绑定后，结束loading
    wx.hideNavigationBarLoading()

    // 下拉刷新时，关闭加载
    wx.stopPullDownRefresh()
  },

  // 页面执行渲染完毕，执行的声明周期函数
  onReady(event) {
    // 这里实现功能，动态设置点击‘更多’进入 导航栏对应的标题；例如。正在热映，点击更多，进入页面的导航栏标题也是 ‘正在热映’
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle,
      success(e) {

      }
    })
  },
  // 更多页面，跳转电影详情页面
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: "../movie-detail/movie-detail?id=" + movieId
    })
  }

})