App({
  // 定义全局变量，在任何一个页面中都可以拿到这个变量
  // 定义这个全局变量目的(解决bug)：在音乐播放页面，点击开始，然后返回那个页面，然后再点进去，页面音乐图标是暂停的，但是音乐还在播放
  globalData: {
    // 这个变量是指音乐是不是在播放
    g_isPlayingMusic: false,
    // 这个变量指哪一个音乐正在播放；(因为点击一个页面音乐播放，这是音乐按钮式播放状态，若返回去进入其他页面，这是此进入的这个页面音乐按钮也是播放状态，所以要解决这个问题，才定义这个全局变量)
    g_currentMusicPostId: null,

    // 全局 定义公用的请求代理
    doubanBase: "https://douban.uieee.com"
  }
})