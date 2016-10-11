/**
 * author:ws
 * date: 2016/08/18
 * function: 一些通用方法
 */

module.exports = {
    // ajax 请求 --2016/09/08 ws
    ajax: function(options){
        $.ajax({
            url: options.url,
            type: options.type || 'GET',
            data: options.data,
            dataType: options.dataType || '',
            success: function(data){
                options.successCb(data);
            },
            error: function(res){
                options.errorCb && options.errorCb(res);
            }

        })
    },

    //dd JSApi权限校验 --2016/09/08 ws
    JSApi: function(options){
        //jsapi权限验证配置
        dd.config(options.data);
        //通过ready接口处理成功验证
        dd.ready(function(){
            options.methods && options.methods();
        });
        //通过error接口处理失败验证
        dd.error(function(error){
            /*
             {
             message:"错误信息",//message信息会展示出钉钉服务端生成签名使用的参数，请和您生成签名的参数作对比，找出错误的参数
             errorCode:"错误码"
             }
             */
            alert('dd error: ' + JSON.stringify(error));
        });
    },

    // 下拉刷新加载 --2016/09/08 ws
    pullToRefresh: function(options){
        /*
         document.body.scrollTop --网页被卷去的高
         window.screen.availHeight --网页工作区域
         document.body.clientHeight --网页可见区域高
         */

        var diffY = document.body.clientHeight - window.screen.availHeight;
        var hideY = document.body.scrollTop;

        if(hideY>=(diffY-options.diffData)){
            if(options.isLoad){
                return ;
            }
            options.pageNum++;
            console.log(options.pageNum);

            options.hasDataLoad.style.display = 'block';
            options.isLoad = true;
            //alert(JSON.stringify(options))
            options.execFn && options.execFn(options);
        }
    }
}


