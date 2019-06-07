//是否测试
const isTest = false;

//基础配置
const config = {
    apiConfig: {
        host: "https://open.feiwuwl.com/api/",
        appKey: "F6BDB258-14D3-46E9-B0E0-3D8757D70618",
        appSecret: "F2488F67-170A-4AA3-ADF4-1627603EB667"
    },
    appId: 'wxd7d8197ee1f7f592',
    log:{
        level: 1, //0,null,1,log(debug);2,info;3,warn;4,error;
        api:false //是否调用api日志
    },
    imgHost: "https://img.feiwuwl.com/28/"
};
//最终配置
var finalConfig = function () {
    if (isTest) {
        config.apiConfig.host = "http://localhost:54945/api/";
        config.log.level = 1;
        return config;
    }
    return config;
};

module.exports = finalConfig();