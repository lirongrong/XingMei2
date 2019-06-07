const util = require("../../utils/util.js");
const api = require("../../utils/api.js");
const biz = require("../../utils/biz.js");
const html = require('../../wxParse/wxParse.js');
const app = getApp();

Page({
    data: {
        recommendUserId: null,
        signNum: 0,
        totalDays: 5,
        isCheckIn: false, //签到状态
        min: 1, //默认值日期第一天1
        dlgType: 0, //先设置隐藏
        bannerList: [],
        shareLevel: 0, //分享级别，默认无级别0,；5天/片为1，以此类推
        totalBrokerage: 0, //已获得佣金
        totalGiftCount: 0, //已获得面膜
        totalShareCount: 0, //已成功邀请
        shareLv1Count:0, //一级分享人数
        shareLv2Count:0, //二级分享人数
        //圆自适应
        width: 190,
        height: 190,
        r: 80,
        r1: 45,
        r2: 30
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
        //登录并缓存用户
        api.wxLogin().then((res) => {
            app.globalData.appUser = res;

            //绑定分享用户
            if (that.data.recommendUserId) {
                api.recommend(that.data.recommendUserId);
            }
        });
    },

    /**
     * 页面渲染事件
     */
    onShow: function () {
        var that = this;
        //更新底部导航
        app.editTabbar();

        //获取系统信息成功，将系统窗口的宽高赋给页面的宽高
        wx.getSystemInfo({
            success: function (res) {
                var widths = res.windowWidth;
                var heights = res.windowHeight;
                that.setData({
                    width: 190 / 375 * widths,
                    height: 190 / 375 * heights,
                    r: 45 / 375 * widths,
                    r1: 38 / 375 * widths,
                    r2: 30 / 375 * widths
                });
            }
        });

        //获取banner列表
        api.banners(1).then(res => {
            that.setData({
                bannerList: res
            });
        });

        var itv = setInterval(function () {
            if (app.globalData.appUser) {
                clearInterval(itv);

                //是否已签到
                api.checkinInfo().then(res => {
                    that.setData({
                        signNum: res.keepCount,
                        isCheckIn: res.hasCheckin
                    });
                });

                //获取用户社交信息
                api.social().then(res => {
                    var days = biz.checkinDay(res.shareLevel);
                    var num = parseInt(res.checkinKeepCount);
                    if (num !== 0) {
                        that.drawCircle(2 / days * num);
                    }
                    that.setData({
                        totalDays: days,
                        totalBrokerage: res.totalBrokerage,
                        totalGiftCount: res.totalGiftCount,
                        totalShareCount: res.shareLv1Count + res.shareLv2Count,
                        shareLevel: res.shareLevel,
                        shareLv1Count:res.shareLv1Count,
                        shareLv2Count:res.shareLv2Count
                    });
                });
            }
        }, 100);
    },

    /**
     * 点击横幅事件
     * @param {any} e -事件源
     */
    tapBanner: function (e) {
        if (e.target.dataset.url) {
            wx.navigateTo({
                url: e.target.dataset.url
            });
        }
    },
    /**
     * 点击提现事件
     */
    tapWithdraw: function () {
        wx.navigateTo({
            url: '/pages/my/money'
        });
    },
    /**
     * 点击发货事件
     */
    tapSend: function () {
        wx.navigateTo({
            url: '/pages/my/gift'
        });
    },
    /**
     * 点击邀请事件
     */
    tapInvite: function () {
        wx.navigateTo({
            url: '/pages/my/group'
        });
    },
    /**
     * 点击签到事件 
     * @param {any} e -事件源
     */
    tapSignIn(e) {
        var that = this;
        if (that.data.shareLevel <= 0) {
            util.alert('请先购买才能签到幺');
            return;
        }
        if (that.data.isCheckIn) {
            util.alert('今日已签到，请明天再来哦~');
            return;
        }

        api.checkin().then(() => {
            var days = biz.checkinDay(that.data.shareLevel);
            var num = that.data.signNum + 1;
            that.drawCircle(2 / days * num);
            that.setData({
                isCheckIn: true
            });
            that.setData({
                signNum: num >= days ? 0 : num,
                totalGiftCount: num >= days ? that.data.totalGiftCount + 1 : that.data.totalGiftCount
            });
            setTimeout(()=>{
                //分享弹窗
                that.setData({
                    dlgType: 1
                });
            },1500);
        });
    },
    /**
     * 点击关闭弹框事件
     */
    tapCloseDlg() {
        this.setData({
            dlgType: 0 //弹窗隐藏
        });
    },
    /**
     * 查看领取规则
     */
    tapRule: function () {
        var that = this;
        api.article(2).then(res => {
            html.wxParse('article', 'html', res.content, that, 0);
            this.setData({
                dlgType: 2
            });
        });
    },
    /**
     * 点击分享事件
     */
    toShare: function () {
        wx.navigateTo({
            url: '/pages/index/share'
        });
        this.setData({
            dlgType: 0 //弹窗隐藏
        });
    },
    /**
     * 右上角分享事件
     * @returns {Object} 分享对象
     */
    onShareAppMessage: function () {
        return {
            title: '与年龄为友，还你第二肌',
            desc: '与年龄为友，还你第二肌',
            path: '/pages/index/index?userId=' + app.globalData.appUser.id
        };
    },
    /**
     * 画圆
     * @param {Number} step -角度
     */
    drawCircle: function (step) {
        var that = this;
        var context = wx.createCanvasContext('canvasProgress');
        context.setLineWidth(10);
        context.setStrokeStyle("#c793ca");
        context.setLineCap('round');
        context.beginPath();
        // 参数step 为绘制的圆环周长，从0到2为一周 。 -Math.PI / 2 将起始角设在12点钟位置 ，结束角 通过改变 step 的值确定
        context.arc(that.data.r, that.data.r, that.data.r1, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
        context.stroke();
        // context.draw()
        context.draw(false, () => {
            // 延迟保存图片，解决生成图片错位bug。
            setTimeout(() => {
                this.canvasToTempImage();
            }, 400);
        });

    },
    /**
     * 画临时图片 
     */
    canvasToTempImage: function () {
        wx.canvasToTempFilePath({
            canvasId: 'canvasProgress',
            success: (res) => {
                let tempFilePath = res.tempFilePath;
                this.setData({
                    imagePath: tempFilePath
                });
            }
        }, this);
    }
});