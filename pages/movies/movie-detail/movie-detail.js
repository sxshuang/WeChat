// var util = require('../../../utils/util.js') 这个不用了，因为已经把util封装到class里的Movie中了

//es6写法： 导入Movie.js
import {
  Movie
} from "class/Movie.js";

var app = getApp();



Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 拿到每个电影的ID号
    var movieId = options.id
    var url = app.globalData.doubanBase + "/v2/movie/subject/" + movieId;

    // es6写法：初始化这个实例对象
    var movie = new Movie(url);
    // this.setData()的时候，this指向变了，所以在外部把this赋值给that
    // var that = this;
    // movie.getMovieData(function(movie) {
    //   that.setData({
    //     movie: movie
    //   })
    // })
    // es6箭头函数，不用担心this指向问题了
    movie.getMovieData((movie) => {
      this.setData({
        movie: movie
      })
    })


    // 调用一下，发起请求
    // util.http(url, this.processDoubanData);
  },

  //原来的写法： 
  // processDoubanData: function(data) {
  //   if (!data) {
  //     return;
  //   }
  //   var director = {
  //     avatar: "",
  //     name: "",
  //     id: ""
  //   }
  //   if (data.directors[0] != null) {
  //     if (data.directors[0].avatars != null) {
  //       director.avatar = data.directors[0].avatars.large
  //     }
  //     director.name = data.directors[0].name;
  //     director.id = data.directors[0].id;
  //   }
  //   var movie = {
  //     movieImg: data.images ? data.images.large : "",
  //     country: data.countries[0],
  //     title: data.title,
  //     originalTitle: data.original_title,
  //     wishCount: data.wish_count,
  //     commentCount: data.comments_count,
  //     year: data.year,
  //     generes: data.genres.join("、"),
  //     // 这个地方的几个函数名，跟你在util.js定义的要一致
  //     stars: util.converToStarsArray(data.rating.stars),
  //     score: data.rating.average,
  //     director: director,
  //     casts: util.convertToCastString(data.casts),
  //     castsInfo: util.convertToCastInfos(data.casts),
  //     summary: data.summary
  //   }
  //   // console.log(movie)
  //   this.setData({
  //     movie: movie
  //   })
  // },
  // 查看电影详情中的 ‘大图片’
  viewMoviePostImg: function(e) {
    var src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src, //当前显示图片的http链接
      urls: [src], //需要预览的图片http链接列表
    })
  }
})