// pages/welcome/welcome.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  // 页面跳转 navigateTo 跳转后可以返回（这里有坑）
  onTap: function(e) {

    //在这里不能用navigateTo或者redirectTo，官网文档，这两个指定跳转到一个页面，但是不能跳转到tabbar页面，
    // 这个项目app.json中，pages中首先显示的是welcome页面，但是在tabbar配置中，首个是posts页面， 不符合逻辑，所以在首先显示的welcome页面中，不会显示tabbar，则这里就成了从无tabbar页面跳转到有tabbar页面，所以这两个路由跳转不可以用
    wx.reLaunch({
      url: '../posts/posts'
    });
    // redirectTo 表示两个页面之间的跳转，没有父子之间的关系，在生命周期中，相当于跳转后，前页面被关闭了，而navigateTo 只是隐藏
    // wx.redirectTo({
    //   url: '../posts/posts',
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})