const config = require('../../config.js');
const api = require('../../utils/api');
var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 页面加载事件
     * @param {any} options -加载事件项
     */
    onLoad: function (options) {
        var that = this;
        //获取扫码推荐用户
        const scene = decodeURIComponent(options.scene);
        var query = {};
        if (scene) {
            query.userId = parseInt(scene);
        }
        //获取分享传值结果
        if (!query.userId && options.userId)
            query.userId = options.userId;
        //通过分享进来重新登陆
        if (query.userId) {
            that.setData({
                recommendUserId: query.userId
            });
        }
    },

    onShow:function(){

    },

    /**
     * 点击授权
     * @param {Object} e -授权登录事件
     */
    tapAuth: function (e) {
        if (!e.detail.userInfo) {
            return;
        } else {
            // 登录
            wx.login({
                success: res => {
                    api.login(config.appId, res.code).then(function (res) {
                        wx.setStorageSync("currentUser", res);
                        app.globalData.appUser = res;
                        api.saveWechatInfo(e.detail.userInfo);
                        wx.switchTab({
                            url: '/pages/index/index'
                        });
                    });
                }
            });
        }
    }
});