// 在这里引入别的js文件的时候，不能使用绝对路径，只能使用相对路径
var postsData = require('../../data/posts-data.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 在 this.setData(),中传一个对象，自定义一个key，传过来才是能得到数据，如果直接传数据，没有key，在data中就没有key
    // posts_key:[{},{}]

    // 小程序总会是读取data对象来做数据绑定，这个动作我们称为动作A
    // 而这个动作A 的执行,是在onLoad事件执行后发生的

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    // this.data.postList = postsData.postList 这个可以直接把数据放到data中，跟下边的方法功能一样

    // 这句话相当于更新data数据，把json这里的数据，放到 data 中了
    this.setData({
      posts_key: postsData.postList
    })
  },
  onPostTap(e) {
    // 这个跳转是列表跳转详情页
    // console.log(e)
    var postId = e.currentTarget.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId,
    })
  },
  // onSwiperItemTap: function(e) {
  //   // 这个是轮播图跳转详情页(这个是在每个image上绑定事件)
  //   var postId = e.currentTarget.dataset.postid;
  //   wx.navigateTo({
  //     url: 'post-detail/post-detail?id=' + postId,
  //   })
  // },
  onSwiperTap: function(e) {
    // target 和 currentTarget 区别：
    // target指的是当前点击的组件 和 currentTarget指的是事件捕获的组件
    // target这里指的是image，而currentTarget指的是swiper

    // 这个是通过冒泡机制，从image到祖父级，给祖父级绑定一个事件
    var postId = e.target.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId,
    })
  }

})