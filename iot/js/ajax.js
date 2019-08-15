// 空气质量
(function(){
    let ajax = {}
    let baseURL = 'https://free-api.heweather.net/s6/';
    let pw_baseurl=' http://192.168.10.158:18895/api/stat/stat';//测试地址

    ajax.getAir = function(type, str) {
        return fetch(baseURL + 'air/'+type+'?'+str)
        .then((response) => {
            return response.json();
        })
    };

    //获取当前天气基本数据
    ajax.getWeather = function(type, str) {
        return fetch(baseURL + 'weather/'+type+'?'+str)
        .then((response) => {
            return response.json();
        })
    };
    // 获取票务影院数据
    ajax.get_stat = function() {
        return fetch(pw_baseurl+'?p=w')
            .then((response) => {
                return response.json();
            })
    };
    window.ajax = ajax
})();