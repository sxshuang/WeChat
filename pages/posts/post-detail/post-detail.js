// 引入外部.js文件
var postsData = require('../../../data/posts-data.js')
// 得到app.js中定义的一个全局变量
var app = getApp()
// console.log(app)
Page({
  data: {
    isPlayingMusic: false,
  },
  onLoad: function(option) {
    var postId = option.id
    // 把这里的postId传给data，以便于下边onCollectionTap函数，借用postId
    this.data.currentPostId = postId
    var postData = postsData.postList[postId]
    // 使用setData，把获取到的数据放到data中，如果没有数据，在onLoad生命周期函数中，看控制台AppData，实时查看数据的绑定
    this.setData({
      postDataList: postData
    });
    // 实现【收藏】 与 【未收藏】
    // 假设的缓存变量形式
    // var postsCollected = {
    //   1: "true",
    //   2: "false",
    //   3: 'true'
    // }
    // 1.先获取所有缓存的状态布尔值是什么
    var postsCollected = wx.getStorageSync("posts_collected")
    // 判断它是否存在
    if (postsCollected) {
      // 2.如果存在，把他的bool值给postCollected
      var postCollected = postsCollected[postId]
      // 3.数据绑定，把bool值赋值给collected，来显示收藏与未收藏
      this.setData({
        collected: postCollected
      })
    } else {
      var postsCollected = {}
      postsCollected[postId] = false;
      wx.setStorageSync("posts_collected", postsCollected)
    }

    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId) {
      // 如果定义的全局变量g_isPlayingMusic为真，则数据绑定，让g_isPlayingMusic为真，为了就是返回、进去页面的音乐图标保持一致；还要对g_isPlayingMusic 做一个监听，（离开时是播放，退出页面，再次进入，音乐图标仍然是播放）
      // 这里判断g_currentMusicPostId===当前页面的Id;(解决：就是在当前页面音乐是播放，但是去其他页面，页面按钮也是播放状态这个问题)
      this.setData({
        isPlayingMusic: true
      })
    }
    // 调用音乐监听功能函数调用
    this.setMusicMonitor();
  },
  setMusicMonitor: function() {
    // 监听音乐开始，使图片上的音乐播放按钮与真实音乐按钮相匹配
    var that = this
    wx.onBackgroundAudioPlay(function() {
      that.setData({
        isPlayingMusic: true
      });
      // 对全局g_isPlayingMusic做一个监听，如果是播放就为true
      app.globalData.g_isPlayingMusic = true;
      // 对全局变量g_currentMusicPostId赋值，当前正在播放音乐页面的Id
      app.globalData.g_currentMusicPostId = that.data.currentPostId
    });
    // 监听音乐暂停，使图片上的音乐播放按钮与真实音乐按钮相匹配
    wx.onBackgroundAudioPause(function() {
      that.setData({
        isPlayingMusic: false
      });
      // 对全局g_isPlayingMusic做一个监听，如果是暂停就为false
      app.globalData.g_isPlayingMusic = false;
      // 对全局 g_currentMusicPostId 赋值，当前音乐如果已暂停，就把id赋值null
      app.globalData.g_currentMusicPostId = null
    });
    wx.onBackgroundAudioStop(function() {
      // 这个API的问题是：播放完音乐，音乐图标不会显示暂停按钮
      that.setData({
        isPlayingMusic: false
      });
      // 对全局g_isPlayingMusic做一个监听，如果是暂停就为false
      app.globalData.g_isPlayingMusic = false;
      // 对全局 g_currentMusicPostId 赋值，当前音乐如果已暂停，就把id赋值null
      app.globalData.g_currentMusicPostId = null
    });

  },
  onCollectionTap: function(event) {
    //在这里还是要使用同步的

    // this.getPostsCollectedAsy()
    this.getPostsCollectedSyc()

  },

  getPostsCollectedAsy: function() {
    // 异步获取缓存读取缓存操作
    var that = this;
    wx.getStorage({
      key: "posts_collected",
      success(res) {
        var postsCollected = res.data;
        var postCollected = postsCollected[that.data.currentPostId]
        // 取反操作的意义：收藏变成未收藏，未收藏变成收藏
        postCollected = !postCollected
        // 更新缓存内的数据
        postsCollected[that.data.currentPostId] = postCollected;
        // showModal() 也可以，但是收藏取消成本不需要用这么高，所以用showToast()就够了
        that.showToast(postsCollected, postCollected);
      }
    })
  },
  getPostsCollectedSyc: function() {
    // 同步获取缓存读取缓存操作


    // 获取缓存的状态，看看bool值，判断是否被收藏
    var postsCollected = wx.getStorageSync("posts_collected")
    var postCollected = postsCollected[this.data.currentPostId]
    // 取反操作的意义：收藏变成未收藏，未收藏变成收藏
    postCollected = !postCollected
    // 更新缓存内的数据
    postsCollected[this.data.currentPostId] = postCollected;
    // showModal() 也可以，但是收藏取消成本不需要用这么高，所以用showToast()就够了
    this.showToast(postsCollected, postCollected);
  },
  showModal: function(postsCollected, postCollected) {
    var that = this;
    wx.showModal({
      title: '收藏',
      content: postCollected ? '收藏该文章？' : '取消收藏该文章？',
      showCancel: "true",
      confirmText: "取消",
      cancelColor: "#333",
      confirmText: "确认",
      confirmColor: "#405f80",
      success(res) {
        // res.confirm 结果为true，执行
        if (res.confirm) {
          // 更新文章是否收藏的缓存值
          wx.setStorageSync("posts_collected", postsCollected)
          // 更新数据绑定变量，从而实现切换收藏与未收藏的图标，
          // 这里是要更新页面中的{{collected}}的值
          that.setData({
            collected: postCollected
          })
        }
      }
    })

  },
  showToast: function(postsCollected, postCollected) {
    // 更新文章是否收藏的缓存值
    wx.setStorageSync("posts_collected", postsCollected)
    // 更新数据绑定变量，从而实现切换收藏与未收藏的图标，
    // 这里是要更新页面中的{{collected}}的值
    this.setData({
      collected: postCollected
    })
    wx.showToast({
      title: postCollected ? "收藏成功" : "取消收藏",
      duration: 1000,
      icon: "success"
    })

  },
  onShareTap: function(event) {
    var itemList = [
      "分享给微信好友",
      "分享到朋友圈",
      "分享到QQ",
      "分享到微博"
    ];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#405f80",
      success(res) {
        // res.cancel 用户是不是点击了取消按钮
        // res.tapIndex 数组元素的序号，从0开始
        wx.showModal({
          title: '用户' + itemList[res.tapIndex],
          content: "用户是否取消" + res.cancle + "现在还无法实现分享功能，什么时候能支持呢？"
        })
      }
    })
  },
  onMusicTap: function(event) {
    // 实现音乐播放、暂停功能
    var currentPostId = this.data.currentPostId;
    var isPlayingMusic = this.data.isPlayingMusic;
    if (isPlayingMusic) {
      // 音乐暂停
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      })

    } else {
      wx.playBackgroundAudio({
        dataUrl: postsData.postList[currentPostId].music.url,
        title: postsData.postList[currentPostId].music.title,
        coverImgUrl: postsData.postList[currentPostId].music.coverImg
      })
      this.setData({
        isPlayingMusic: true
      })
    }
  }
})