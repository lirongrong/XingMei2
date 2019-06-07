module.exports = {
    /*
     * 根据分享级别判断多少天
     * @param {Number} shareLevel -分享级别
     **/
    checkinDay: (shareLevel) => {
        if (shareLevel >= 5)
            return 1;
        else
            return 6 - shareLevel;
    }
}

