var util = require("../../../../utils/util.js");

// 这里是用ES6语法，把movie-detail.js 的代码用ES6语法写成类的形式
class Movie {
  // url豆瓣地址
  constructor(url) {
    this.url = url;
  }
  getMovieData(cb) {
    // cb 表示callback回调函数
    this.cb = cb;
    // 通过bind方式，把this绑定到环境的上下文中，指代（要不然下边的this.cb()中的this是undefined）
    util.http(this.url, this.processDoubanData.bind(this))
  }
  processDoubanData(data) {
    if (!data) {
      return;
    }
    var director = {
      avatar: "",
      name: "",
      id: ""
    }
    if (data.directors[0] != null) {
      if (data.directors[0].avatars != null) {
        director.avatar = data.directors[0].avatars.large
      }
      director.name = data.directors[0].name;
      director.id = data.directors[0].id;
    }
    var movie = {
      movieImg: data.images ? data.images.large : "",
      country: data.countries[0],
      title: data.title,
      originalTitle: data.original_title,
      wishCount: data.wish_count,
      commentCount: data.comments_count,
      year: data.year,
      generes: data.genres.join("、"),
      // 这个地方的几个函数名，跟你在util.js定义的要一致
      stars: util.converToStarsArray(data.rating.stars),
      score: data.rating.average,
      director: director,
      casts: util.convertToCastString(data.casts),
      castsInfo: util.convertToCastInfos(data.casts),
      summary: data.summary
    }
    this.cb(movie)
  }
}

// 输出出去
export {
  Movie
}