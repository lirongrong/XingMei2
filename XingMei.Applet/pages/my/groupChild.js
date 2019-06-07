var api = require("../../utils/api.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
      recommendUserId:null,
      page: 1,
      pageSize: 9,
      list: [],
      noData: false
  },

    bindData: function (page) {
        var that = this;
        if (page) {
            that.setData({
                page: page
            });
        }
        //推荐用户列表
        api.recommendUsers({
            recommendUserId:that.data.recommendUserId,
            hasOrder: true
        }).then(res => {
            var list = that.data.list || [];
            if (that.data.page > 1)
                _.each(res.data, (item) => {
                    list.push(item);
                });
            else
                list = res.data;
            that.setData({
                list: list,
                noData: res.data.length < that.data.pageSize
            });
        });
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var uid = options.id;
      this.setData({
          recommendUserId:uid
      });
      this.bindData(1);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.setData({
            page: 1,
            noData: false
        });
        this.bindData(1);
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (!this.data.noData) {
            var page = this.data.page;
            page++;
            this.bindData(page);
        }
    },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})