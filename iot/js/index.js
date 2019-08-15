let key = '6fdf9567c86b4752a6a1bb62d5a2bf13'
let city = {
    pinyin: 'auto_ip',
    // pinyin:'lanzhou',
    name: '兰州'
}
window.onload = function () {
    setAir()
    getTime()
    setWeather()
    setAtualWeather()
    setWeatherDetail(0);
    setSex()
    var index = 0;
    setInterval(function () {
        if (index > 2) {
            index = 0;
        }
        setWeatherDetail(index)
        index++;
    }, 5000);
}

function $(value) {
    return document.querySelector(value)
}

// 设置当前空气质量
function setAir() {
    ajax.getAir('now', 'location=' + city.pinyin + '&key=' + key).then(res => {
        let airQuality = $('#airQuality')
        airQuality.innerHTML = res.HeWeather6[0].air_now_city.qlty
    })
}

// 设置当前时间
function getTime() {
    let time = new Date().getTime()
    let now = times.dealTime(time)
    $('#nosolarCalendar').innerHTML = now
    let lunarDate = times.getLunarDate(now)
    let lunarDateString = times.getLunarDateString(lunarDate)
    $('#lunarCalendar').innerHTML = '农历' + lunarDateString.month + '月' + lunarDateString.day
}

//设置近日天气情况
function setWeather(type, strs) {
    var str = '', windir = '';
    ajax.getWeather('forecast', 'location=' + city.pinyin + '&key=' + key).then((res) => {
        if (res.HeWeather6[0].daily_forecast[0].wind_dir.length > 2) {
            windir = `<span class="wind_dir">${res.HeWeather6[0].daily_forecast[0].wind_dir}`
        } else {
            windir = `<span>${res.HeWeather6[0].daily_forecast[0].wind_dir}`
        }
        str = `<div class="weather1 bgBlue">
                        <span id="cityName">${res.HeWeather6[0].basic.location}</span>
                        <div class="weatherIcon">
                            <img src="img/${res.HeWeather6[0].daily_forecast[0].cond_code_d}.png" alt="">
                        </div>
                        <div class="weather1_content">
                            <p class="f28 ell lh48" title="${res.HeWeather6[0].daily_forecast[0].cond_txt_d}">${res.HeWeather6[0].daily_forecast[0].cond_txt_d}</p>
                            <p class="f21 ell lh48" title="${res.HeWeather6[0].daily_forecast[0].tmp_min}℃~${res.HeWeather6[0].daily_forecast[0].tmp_max}℃">${res.HeWeather6[0].daily_forecast[0].tmp_min}℃~${res.HeWeather6[0].daily_forecast[0].tmp_max}℃</p>
                        </div>
                    </div>
                    <div class="weather1 bgRed">
                        <div class="weatherIcon">
                            <img src="img/2.jpg" alt="">
                        </div>
                        <div class="weather1_content">
                            <p class="f22 lh48 ell" title="${res.HeWeather6[0].daily_forecast[0].wind_sc}">风力：${res.HeWeather6[0].daily_forecast[0].wind_sc}</p>
                            <p class="f22 lh48 ell" title="${res.HeWeather6[0].daily_forecast[0].wind_dir}">风向：${windir}</span></p>
                        </div>
                    </div>
                    <div class="weather1 bgPurple">
                        <div class="weatherIcon">
                            <img src="img/3.jpg" alt="">
                        </div>
                        <div class="weather1_content">
                            <p class="f22 lh48 ell" title="${res.HeWeather6[0].daily_forecast[0].sr}">日出：${res.HeWeather6[0].daily_forecast[0].sr}</p>
                            <p class="f22 lh48 ell" title="${res.HeWeather6[0].daily_forecast[0].ss}">日落：${res.HeWeather6[0].daily_forecast[0].ss}</p>
                        </div>
                    </div>`
        $('#info').innerHTML = str
    });
}

// 获取时间段的天气情况
function setAtualWeather() {
    ajax.getWeather('hourly', 'location=' + city.pinyin + '&key=' + key).then((res) => {
        // 分时段天气实况
        let hourly = res.HeWeather6[0].hourly
        // x轴数据
        let x = []
        hourly.forEach(e => {
            x.push(e.time.slice(11, 13) + '时')
        })
        // 对应数据值
        let data = []
        hourly.forEach(e => {
            data.push(e.tmp)
        })
        let imgs = []
        hourly.forEach(e => {
            imgs.push({
                img: e.cond_code + '.png',
                name: e.cond_txt
            })
        })
        let left = 86.5
        let str = ''
        for (let i = 0; i < imgs.length; i++) {
            let imgTip = document.createElement('div')
            imgTip.className = 'imgTip'
            imgTip.style.position = 'absolute'
            imgTip.style.top = '60px'
            imgTip.style.left = left + 'px'
            left += 104.3
            let img = new Image()
            img.src = 'img/' + imgs[i].img
            let p = document.createElement('p')
            p.innerText = imgs[i].name
            imgTip.appendChild(img)
            imgTip.appendChild(p)
            imgTip.style.position = 'absolute'
            $('.atualWeatherBox').appendChild(imgTip);
        }
        let atualWeather = echarts.init($('#atualWeather'));
        let title = {
            text: '分时段天气实况',
            left: '50px',
            top: 21,
            textStyle: {
                color: '#B6BDDA',
                fontSize:24
            }
        }
        let option = {
            title: title,
            lineStyle: {
                color: '#d6876f'
            },
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 0,
                    colorStops: [{
                        offset: 0, color: '#0e0e20' // 0% 处的颜色
                    }, {
                        offset: 1, color: '#1f415f' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                }
            },
            grid: {
                x: 105,
                width: 730,
                height: 168,
                y2: 70
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                axisTick: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color: '#808080'
                    }
                },
                axisLine: {show: false},
                data: x
            },
            yAxis: {
                show: false
            },
            series: [
                {
                    data: data,
                    type: 'line',
                    areaStyle: {},
                    smooth: true,
                    symbolSize: 16,
                    label: {
                        show: true,
                        color: '#fc9d7e',
                        formatter: '{c}℃'
                    },
                }
            ]
        }
        atualWeather.setOption(option);
    })
}

// 获取整点湿度，温度，降雨概率
function setWeatherDetail(index) {
    ajax.getWeather('hourly', 'location=' + city.pinyin + '&key=' + key).then((res) => {
        let btns = document.getElementsByClassName('tool')
        for (let i = 0; i < btns.length; i++) {
            btns[i].style.backgroundColor = '#0e0e20'
        }
        btns[index].style.backgroundColor = '#1f3f5d'
        let hourly = res.HeWeather6[0].hourly

        // 整点天气实况
        let weatherDetail = echarts.init($('#weatherDetail'));
        let x2 = []
        hourly.forEach(e => {
            x2.push(e.time.slice(11, 13))
        })
        let datasd = []
        let yAxis = []
        let name = ''
        let markLine = {}
        if (index == 0) {
            name = '温度'
            hourly.forEach(e => {
                datasd.push({
                    value: e.tmp,
                    itemStyle: {
                        color: color = new echarts.graphic.LinearGradient(
                            0, 1, 0, 0,
                            [
                                {offset: 0, color: '#0e0e20'},
                                {offset: 1, color: '#f19149'}
                            ]
                        )
                    }
                })
            })
            yAxis = [
                {
                    type: 'value',
                    name: '单位：℃',
                    interval: 10,
                    min: -20,
                    nameTextStyle: {
                        color: '#ffffff',
                        align: 'right',
                        padding: [0, 0, 0, 50]
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        interval: 0,
                        color: function (value, index) {
                            if (value == -20) {
                                return '#1381f1'
                            } else if (value == -10) {
                                return '#02edfe'
                            } else if (value == 0) {
                                return '#cbf6d1'
                            } else if (value == 10) {
                                return '#eaea92'
                            } else if (value == 20) {
                                return '#f3995a'
                            } else if (value == 30) {
                                return '#f2636b'
                            } else {
                                return '#e5090c'
                            }
                        }
                    }
                }
            ]
            markLine = {
                lineStyle: {
                    color: '#383846',
                    type: 'solid',
                },
                data: [
                    {
                        name: 'Y 轴值为 0 的水平线',
                        yAxis: 0
                    },
                    {
                        name: 'Y 轴值为 30 的水平线',
                        yAxis: 30
                    }
                ],
                symbol: 'none',
                label: {
                    show: false
                }
            }
        }
        else if (index == 1) {
            name = '湿度'
            hourly.forEach(e => {
                datasd.push({
                    value: e.hum,
                    itemStyle: {
                        color: color = new echarts.graphic.LinearGradient(
                            0, 1, 0, 0,
                            [
                                {offset: 0, color: '#0f0f20'},
                                {offset: 1, color: '#b3d465'}
                            ]
                        )
                    }
                })
            })
            yAxis = [
                {
                    type: 'value',
                    name: '单位：RH',
                    interval: 10,
                    min: 20,
                    data: [20, 30, 40, 50, 60, 70, 80, 90],
                    nameTextStyle: {
                        color: '#ffffff',
                        align: 'right',
                        padding: [0, 0, 0, 50]
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        interval: 0,
                        color: function (value, index) {
                            return value <= 30 ? 'red' : value >= 70 ? 'blue' : 'green';
                        }
                    }
                }
            ]
            markLine = {
                lineStyle: {
                    color: '#383846',
                    type: 'solid',
                },
                data: [
                    {
                        name: 'Y 轴值为 40 的水平线',
                        yAxis: 40
                    },
                    {
                        name: 'Y 轴值为 70 的水平线',
                        yAxis: 70
                    }
                ],
                symbol: 'none',
                label: {
                    show: false
                }
            }
        }
        else {
            name = '概率'
            hourly.forEach(e => {
                datasd.push({
                    value: e.pop,
                    itemStyle: {
                        color: color = new echarts.graphic.LinearGradient(
                            0, 1, 0, 0,
                            [
                                {offset: 0, color: '#0e0e20'},
                                {offset: 1, color: '#47b6f1'}
                            ]
                        )
                    }
                })
            })
            yAxis = [
                {
                    type: 'value',
                    name: '单位：%',
                    interval: 10,
                    min: 0,
                    nameTextStyle: {
                        color: '#ffffff',
                        align: 'right',
                        padding: [0, 0, 0, 50]
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        interval: 0,
                        color: function (value, index) {
                            if (value == -20) {
                                return '#1381f1'
                            } else if (value == -10) {
                                return '#02edfe'
                            } else if (value == 0) {
                                return '#cbf6d1'
                            } else if (value == 10) {
                                return '#eaea92'
                            } else if (value == 20) {
                                return '#f3995a'
                            } else if (value == 30) {
                                return '#f2636b'
                            } else {
                                return '#e5090c'
                            }
                        }
                    }
                }
            ]
        }
        let title2 = {
            text: '整点天气实况',
            left: '50px',
            top: 21,
            textStyle: {
                color: '#B6BDDA',
                fontSize:24
            }
        }
        let option2 = {
            title: title2,
            tooltip: {
                trigger: 'axis'
            },
            calculable: true,
            xAxis: {
                type: 'category',
                data: x2,
                axisTick: {
                    show: false
                },
                axisLine: {onZero: true},
            },
            grid: {
                x: 105,
                top:'30%',
                width: 748,
                height: 207,
                y2: 70
            },
            yAxis: yAxis,
            series: [
                {
                    name: name,
                    type: 'bar',
                    data: datasd,
                    markLine: markLine,
                }
            ]
        };
        weatherDetail.setOption(option2);
    })
}

// 性别分布
function setSex() {
    let sex = echarts.init($('#sex'));
    let style1 = {
        normal: {
            color: '#e90079',
            borderWidth: 5,
            borderColor: '#0e0e20'
        }
    }
    let style2 = {
        normal: {
            color: '#0a89ea',
            borderWidth: 5,
            borderColor: '#0e0e20'
        }
    }
    let data = [{
        value: 58,
        name: '女性',
        itemStyle: style1
    },
        {
            value: 42,
            name: '男性',
            itemStyle: style2
        }]
    let series = [
        {
            name: '移动端观众意见反馈',
            type: 'pie',
            center: ['50%', '50%'],
            radius: ['60', '86'],
            startAngle: 180,
            clockwise: false,
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: false
                }
            },
            labelLine: {
                normal: {
                    show: false,
                    length: 0
                }
            },
            data: data
        }
    ]
    let option = {
        title: {
            text: '观众性别比例',
            left: '50px',
            top: 21,
            textStyle: {
                color: '#B6BDDA',
                fontSize:24
            },
        },
        legend: {
            show: true,
            left: 74,
            itemGap: 95,
            bottom: 70,
            itemWidth: 0,
            formatter: function (name) {
                var total = 0;
                var target;
                for (var i = 0, l = data.length; i < l; i++) {
                    total += data[i].value;
                    if (data[i].name == name) {
                        target = data[i].value;
                    }
                }
                let x = ''
                let y = ''
                if (name == '男性') {
                    x = 'b'
                    y = 'b1'
                } else if (name == '女性') {
                    x = 'a'
                    y = 'a1'
                }
                return '{' + y + '|' + name + '}' + '{' + x + '|' + ((target / total) * 100).toFixed(0) + '%}'
            },
            textStyle: {
                rich: {
                    a: {
                        color: '#e90079',
                        fontSize: 20
                    },
                    a1: {
                        color: '#e90079',
                        fontSize: 16,
                        width: 46
                    },
                    b: {
                        color: '#0a89ea',
                        fontSize: 20
                    },
                    b1: {
                        color: '#0a89ea',
                        fontSize: 16,
                        width: 46
                    }
                }
            }
        },
        series: series
    }
    sex.setOption(option);
}

// 获取当前在馆累计人数
var app = new Vue({
    el: '#app',
    data: {
        total: '',
        today_order_film: '',
        data: {}
    },
    created: function () {
        var _ = this;
        _.get_stat()
    },
    methods: {
        // 获取所有数据
        get_stat() {
            var _ = this;
            ajax.get_stat().then((res) => {
                _.data = res.data;
                // localStorage.setItem('data', JSON.stringify(res.data));
                _.total = res.data.total;
                _.today_order_film = res.data.today_order_film;
                _.setAge(res.data.age);
                _.cinemaType()
            })
        },
        // 观众年龄分布
        setAge(dataarr) {
            let age = echarts.init($('#age'));

            let defaultStyle = {
                normal: {
                    color: '#363641',
                    label: {
                        show: false,
                        position: 'center',
                        formatter: '{b}'
                    },
                    labelLine: {
                        show: false
                    },
                    borderWidth: 1,
                    borderColor: '#0e0e20'
                }
            }
            let graphic = []; //年龄段
            let title = {
                text: '观众年龄分布',
                left: '50px',
                top: 21,
                textStyle: {
                    color: '#B6BDDA',
                    fontSize:24
                }
            }
            let series = [];
            let option = {
                title: title,
                series: series,
                graphic: graphic
            };
            dataarr.forEach(function (item, index) {
                graphic.push({
                    type: 'text',
                    left: 65 + index * 150,
                    top: '75%',
                    style: {
                        text: item.name,
                        fill: '#747476',
                        fontSize: 18,
                    }
                })
                series.push({
                        type: 'pie',
                        center: [100 + index * 150, '50%'],
                        radius: ['50', '54'],
                        label: {
                            normal: {
                                show: false,
                                position: 'center',
                                color: '#e1d1b8',
                                fontWeight: 'bolder'
                            },
                        },
                        itemStyle: defaultStyle,
                        startAngle: '90',
                        minAngle: 0,
                        "clockwise": false,
                        "hoverAnimation": false,
                        "legendHoverLink": false,
                        data: [
                            {
                                value: 100 - Number(item.percentage),
                                name: 'invisible',
                            },
                            {
                                // itemStyle: mainStyle
                                itemStyle: {
                                    borderWidth: 5,
                                    borderColor: {
                                        type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 0,
                                        y2: 1,
                                        colorStops: [{
                                            offset: 0, color: '#F1AA3A' // 0% 处的颜色
                                        }, {
                                            offset: 1, color: '#F7563E' // 100% 处的颜色
                                        }]
                                    },
                                },
                                value: item.percentage,
                                label: {
                                    normal: {
                                        formatter: function (val) {
                                            return `${val.value}%`
                                        },
                                        textStyle: {
                                            fontSize: 23,
                                            color: '#E1D1B8',
                                            fontWeight: 'bold'
                                        },
                                        show: true,
                                    }
                                }
                            }
                        ]
                    }
                )
            })
            age.setOption(option);
        },
        // 影院类型
        cinemaType() {
            let cinema = echarts.init($('#cinema'));
            let style1 = {
                normal: {
                    color: '#ff00fc',
                    borderWidth: 5,
                    borderColor: '#0e0e20'
                }
            }
            let style2 = {
                normal: {
                    color: '#1a42f2',
                    borderWidth: 5,
                    borderColor: '#0e0e20'
                }
            }
            let style3 = {
                normal: {
                    color: '#7e32f7',
                    borderWidth: 5,
                    borderColor: '#0e0e20'
                }
            }
            let data = [{
                value: 70,
                name: '梦幻剧场',
                itemStyle: style1
            },
                {
                    value: 20, name: '巨幕影院',
                    itemStyle: style2
                },
                {
                    value: 10,
                    name: '球幕影院',
                    itemStyle: style3
                }];
            let series = [
                {
                    name: '影院类型与总票量对比',
                    type: 'pie',
                    center: ['50%', '60%'],
                    radius: ['60', '86'],
                    startAngle: 180,
                    clockwise: false,
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: true,
                            position: 'center',
                            formatter: '总票量\n100',
                            color: 'white',
                            lineHeight: 37,
                            fontSize: 18
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false,
                            length: 0
                        }
                    },
                    data: data
                }
            ]
            let option = {
                title: {
                    text: '影院类型与总票量对比',
                    left: '50px',
                    top: 21,
                    textStyle: {
                        color: '#B6BDDA',
                        fontSize: 24
                    },
                },
                legend: {
                    show: true,
                    // itemGap: 50,
                    right: 0,
                    top: 200,
                    orient: 'vertical',
                    itemWidth: 0,
                    formatter: function (name) {
                        var total = 0;
                        var target;
                        console.log(name)
                        for (var i = 0, l = data.length; i < l; i++) {
                            total += data[i].value;
                            if (data[i].name == name) {
                                target = data[i].value;
                            }
                        }
                        let a = ''
                        if (name == '梦幻剧场') {
                            a = 'a'
                        } else if (name == '巨幕影院') {
                            a = 'b'
                        } else {
                            a = 'c'
                        }
                        return '{white|' + ((target / total) * 100) + '%}\n' + '{' + a + '|' + name + '}' + '{white|' + target + '人}';
                    },
                    textStyle: {
                        rich: {
                            a: {
                                color: '#ff00fc',
                                fontSize: 20,
                                width: 100
                            },
                            b: {
                                color: '#1a42f2',
                                fontSize: 20,
                                width: 100
                            },
                            c: {
                                color: '#7e32f7',
                                fontSize: 20,
                                width: 100
                            },
                            white: {
                                fontSize: 20,
                                color: '#ffffff'
                            }
                        }
                    }
                },
                series: series
            };
            cinema.setOption(option);
        }
    }
});
