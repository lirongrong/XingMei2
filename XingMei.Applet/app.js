const api = require('/utils/api.js');

App({
    onLaunch: function () {
        // 隐藏系统tabbar
        //this.hidetabbar();
        // 获取设备信息
        this.getSystemInfo();
    },
    //自己对wx.hideTabBar的一个封装
    hidetabbar() {
        wx.hideTabBar({
            fail: function () {
                setTimeout(function () { // 做了个延时重试一次，作为保底。
                    wx.hideTabBar();
                }, 500);
            }
        });
    },
    getSystemInfo: function () {
        let t = this;
        wx.getSystemInfo({
            success: function (res) {
                t.globalData.systemInfo = res;
            }
        });
    },
    editTabbar: function () {
        let tabbar = this.globalData.tabBar;
        let currentPages = getCurrentPages();
        let _this = currentPages[currentPages.length - 1];
        let pagePath = _this.route;
        (pagePath.indexOf('/') !== 0) && (pagePath = '/' + pagePath);
        for (let i in tabbar.list) {
            tabbar.list[i].selected = false;
            (tabbar.list[i].pagePath === pagePath) && (tabbar.list[i].selected = true);
        }
        _this.setData({
            tabbar: tabbar
        });
    },
    globalData: {
        userInfo: null,
        appUser: null,
        systemInfo: null,//客户端设备信息
        tabBar: {
            "backgroundColor": "#ffffff",
            "color": "#979795",
            "selectedColor": "#d288c3",
            "list": [
                {
                    "pagePath": "/pages/index/index",
                    "iconPath": "icon/icon_homes.png",
                    "selectedIconPath": "icon/icon_home_HLs.png",
                    "text": "首页"
                },
                {
                    "pagePath": "/pages/product/list",
                    "iconPath": "icon/icon_releases.png",
                    "selectedIconPath":"icon/icon_releases.png",
                    "text": "第2肌"
                },
                {
                    "pagePath": "/pages/my/index",
                    "iconPath": "icon/icon_mines.png",
                    "selectedIconPath": "icon/icon_mine_HLs.png",
                    "text": "我"
                }
            ]
        }
    }
});