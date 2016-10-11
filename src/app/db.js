// See https://github.com/Jias/natty-fetch for more details.
const context = salt.fetch.context({
    mockUrlPrefix: '/mock/',
    //urlPrefix: '/',
    urlPrefix: 'http://dd.tongbu.com/api/', //地址前缀
    //mock:true,
    mock: false,
    jsonp:false, //跨域请求(默认false | 【boolean|Array】)
    withCredentials: false, //是否发送cookie(通过判断url是否跨域来自动设置该值，跨域时为false)
    traditional: true,
    data: {   //定义全局配置
        _tb_token_: ''
    },
    timeout: 5000,
     /*fit: function(response) {
     return {
         success: true || response.success,
         content: response.content,
         error: {
         errorMsg: response.errorMsg,
         errorCode: response.errorCode,
         errorLevel: response.errorLevel
         }
      }
     }*/
    fit: function(response) {
        var res = JSON.parse(response.match(/({.*?[\]|null]})/g)[0]);
        console.log('res:'+JSON.stringify(res))
        return {
            success: res.Code == 0 ? 1:0 ,
            content: res,
            error: {
                errorMsg: res.Message
                //errorCode: response.errorCode,
                //errorLevel: response.errorLevel
            }
        }
    }
});

context.create('SomeModuleAPI', {
    honorRanking: {
        //mockUrl: 'query/honorRanking.json',
        //url: 'query/honorRanking.json'
        //mockUrl:'http://dd.tongbu.com/api/api.ashx?ScoreBoard',
        url:'api.ashx?ScoreBoard'
    },
    useRanking: {
        //mockUrl: 'query/useRanking.json',
        //url: 'query/useRanking.json'
        url:'api.ashx?ScoreBoard'
    },
    getSomeInfo: {
        mockUrl: 'query/getSomeInfo.json',
        url: 'query/getSomeInfo.json'
    },
    mime: {
        //mockUrl: 'query/mime.json',
        //url: 'query/mime.json'
        url: 'api.ashx?UserScoreLog'
    },
    dynamic: {
        url: 'api.ashx?CropScoreLog'
    }

});

module.exports = context.api;
