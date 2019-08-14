Vue.use(VueCountUp);
var VM = new Vue({
    el: "#main",
    data: {
        name: '甘肃科技馆指挥中心信息管理平台',
        tmp: 0,//温度
        qlty: '获取中...',//空气质量
        cond_txt: '获取中...',
        cond_code: '100',
        newdate: '获取时间中...',
        windex: 4,
        wlist: [
            '#49008D',
            '#0C43C4',
            '#0294FB',
            '#5EB7FB',
            '#AAF3F7',
            '#FFFEBD',
            '#FFDB63',
            '#FFAA01',
            '#FE6400',
            '#E40001',
            '#A00010',
            '#640000'
        ],
        feedback: [
            {
                name: 'PC端',
                value: 0
            }, {
                name: '移动端',
                value: 0
            }
        ],
        appdownloadnum: 0,
        webvisit: 0,
        numTimer: null,
        initChart1Data: [
            {
                name: '智慧导览笔使用',
                value: 0
            }, {
                name: '微信导览使用',
                value: 0
            },
            {
                name: 'APP导览使用',
                value: 0
            }
        ],
        oneData: {},
        countData: {},
        total: 0,
        scale: 2,
        chart1: null,
        chart2: null,
        chart3: null,
        chart4: null,
        watchFilmNu: 0,
        chart51: null,
        chart52: null,
        chart6: null,
        chart7: null,
        chart8: null,
    },
    created: function () {
        var vm = this;
    },
    mounted: function () {
        var vm = this;
        vm.chart1 = echarts.init(document.querySelector("#chart1"));
        // vm.chart2 = echarts.init(document.querySelector("#chart2"));
        vm.chart3 = echarts.init(document.querySelector("#chart3"));
        vm.chart4 = echarts.init(document.querySelector("#chart4"));
        vm.chart51 = echarts.init(document.querySelector("#chart51"));
        vm.chart52 = echarts.init(document.querySelector("#chart52"));
        vm.chart6 = echarts.init(document.querySelector("#chart6"));
        // vm.chart7 = echarts.init(document.querySelector("#chart7"));
        // vm.chart8 = echarts.init(document.querySelector("#chart8"));

        // 当前时间
        setInterval(function () {
            var date = new Date();
            vm.newdate = date.toLocaleString('chinese', {hour12: false});
        }, 1000);
        vm.chart1.showLoading({
            text: 'loading',
            color: '#fff',
            textColor: '#fff',
            maskColor: '#0E0E20',
            zlevel: 0
        });
        vm.chart3.showLoading({
            text: 'loading',
            color: '#fff',
            textColor: '#fff',
            maskColor: '#0E0E20',
            zlevel: 0
        });
        vm.chart4.showLoading({
            text: 'loading',
            color: '#fff',
            textColor: '#fff',
            maskColor: '#0E0E20',
            zlevel: 0
        });
        vm.setWeather();
        vm.air();
        vm.wxData();
        vm.getStat();
        vm.initChart1();//第一屏
        vm.initChart4();
        vm.getAppnum();
        vm._learn_rate();
        // setInterval(function () {
        //     // 温度
        //     vm.setWeather();
        //     vm.air();
        //     // 导览使用情况
        //     vm.wxData()
        //     // vm.hotRoads();
        //     // vm.activeNumPro();
        //     // vm.getCinemaData();
        // }, 10000);
    },
    methods: {
        // 设置天气
        setWeather: function () {
            var vm = this;
            $.ajax({
                type: "get",
                url: "https://free-api.heweather.com/s6/weather/now",
                data: {
                    location: "auto_ip",
                    key: "4cb210538d2c4a27ae661140753c71d0"
                },
                success: function (rlt) {
                    if (rlt.HeWeather6[0].status == 'ok') {
                        var now = rlt.HeWeather6[0].now;
                        // console.log(now)
                        vm.tmp = now.tmp;
                        var tmp = parseInt(vm.tmp);
                        if (tmp <= -25) {
                            vm.windex = 0;
                        } else if (tmp > -25 && tmp <= -15) {
                            vm.windex = 1;
                        } else if (tmp > -15 && tmp <= -10) {
                            vm.windex = 2;
                        } else if (tmp > -10 && tmp <= -5) {
                            vm.windex = 3;
                        } else if (tmp > -5 && tmp <= 0) {
                            vm.windex = 4;
                        } else if (tmp > 6 && tmp <= 15) {
                            vm.windex = 5;
                        } else if (tmp > 15 && tmp <= 20) {
                            vm.windex = 6;
                        } else if (tmp > 20 && tmp <= 25) {
                            vm.windex = 7;
                        } else if (tmp > 25 && tmp <= 30) {
                            vm.windex = 8;
                        } else if (tmp > 30 && tmp <= 40) {
                            vm.windex = 9;
                        } else if (tmp > 40) {
                            vm.windex = 10;
                        }
                        vm.cond_code = now.cond_code;
                        vm.cond_txt = now.cond_txt;
                    }
                },
                error: function (rlt) {
                    console.log(rlt)
                }
            });
        },
        // 获取空气质量
        air: function () {
            var vm = this;
            $.ajax({
                type: "get",
                url: "https://free-api.heweather.net/s6/air/now",
                data: {
                    location: "auto_ip",
                    key: "4cb210538d2c4a27ae661140753c71d0",
                    unit: '',
                    lang: 'zh-cn'
                },
                success: function (rlt) {
                    if (rlt.HeWeather6[0].status == 'ok') {
                        var air_now_city = rlt.HeWeather6[0].air_now_city;
                        vm.qlty = air_now_city.qlty;
                    }
                },
                error: function (rlt) {
                    console.log(rlt)
                }
            });
        },
        // 获取数字智慧导览使用情况
        wxData: function () {
            var vm = this;
            $.ajax({
                type: 'get',
                data: {
                    p: "w"
                },
                dataType: 'json',
                headers: {'Accept': 'application/json'},
                url: baseurl1 + "api/big_stat",
                success: function (rlt) {
                    vm.initChart1Data[0].value = 10;
                    vm.initChart1Data[1].value = rlt.data.dlstat.wx_total;
                    vm.initChart1Data[2].value = rlt.data.dlstat.app_total;
                    vm.webvisit = rlt.data.webvisit;
                    // vm.numTimer = setInterval(
                    //     function () {
                    //         if (vm.webvisit > rlt.data.webvisit) {
                    //             clearInterval(vm.numTimer)
                    //             vm.webvisit = parseInt(rlt.data.webvisit, 10) > 100000 ? Comfun.toSplit(rlt.data.webvisit) : Comfun.toWan(rlt.data.webvisit);
                    //         } else {
                    //             vm.webvisit++
                    //         }
                    //     }, );
                    // vm.webvisit = parseInt(rlt.data.webvisit, 10) > 100000 ? Comfun.toSplit(rlt.data.webvisit) : Comfun.toWan(rlt.data.webvisit);
                    vm.feedback[0].value = rlt.data.feedback.pc;
                    vm.feedback[1].value = rlt.data.feedback.wap;
                    vm.total = rlt.data.feedback.total;
                    // vm.feedback[0].value=10;
                    // vm.feedback[1].value=10;
                    // vm.total=22;
                    vm.initChart1();
                    vm.initChart5();
                    vm.chart1.hideLoading();
                },
                error: function (err) {
                    console.log(err)
                }
            });
        },
        // 获取平台预约
        getStat: function () {
            var vm = this;
            $.ajax({
                type: 'get',
                data: {
                    p: "w"
                },
                dataType: 'json',
                headers: {'Accept': 'application/json'},
                url: baseurl3 + "api/stat/stat",
                success: function (rlt) {
                    if (rlt.status == 1) {
                        vm.order_stat = rlt.data.order_stat;
                        vm.initChart3();
                        var order_stat = [];
                        for (var i in vm.order_stat) {
                            order_stat.push({
                                value: vm.order_stat[i].percentage,
                                name: vm.order_stat[i].name
                            })
                        }
                        vm.updateChart3(order_stat)
                    }
                },
                error: function (err) {
                    console.log(err)
                }
            });
        },
        initChart1: function () {
            var vm = this;
            var data = vm.initChart1Data;
            var total = 0;
            data.forEach(function (item, index) {
                total += item.value
            });
            var seriesArr = [];
            data.forEach(function (item, index) {
                seriesArr.push(
                    {
                        type: 'pie',
                        name: item.name,
                        clockWise: false,
                        hoverAnimation: false,
                        radius: ['25%', '25%'],
                        center: [14 + index * 35 + '%', '50%',],
                        itemStyle: {
                            normal: {
                                show: true,
                                position: 'center',
                                borderWidth: 6 * vm.scale,
                                borderColor: '#535353',
                                labelLine: {
                                    show: false
                                },
                                label: {
                                    show: false
                                },
                            }
                        },
                        data: [
                            {
                                name: item.name,
                                value: total - item.value,
                                itemStyle: {
                                    normal: {
                                        borderWidth: 1 * vm.scale
                                    }
                                }
                            },
                            {
                                name: item.name,
                                value: item.value,
                                itemStyle: {
                                    normal: {
                                        borderColor: (function (val) {
                                            if (item.name == data[0].name) {
                                                return {
                                                    type: 'linear',
                                                    x: 0,
                                                    y: 0,
                                                    x2: 0,
                                                    y2: 1,
                                                    colorStops: [{
                                                        offset: 0, color: '#0036B2' // 0% 处的颜色
                                                    }, {
                                                        offset: 1, color: '#51C0FF' // 100% 处的颜色
                                                    }]
                                                }
                                            } else if (item.name == data[1].name) {
                                                return {
                                                    type: 'linear',
                                                    x: 0,
                                                    y: 0,
                                                    x2: 0,
                                                    y2: 1,
                                                    colorStops: [{
                                                        offset: 0, color: '#3B7D00' // 0% 处的颜色
                                                    }, {
                                                        offset: 1, color: '#92FF50' // 100% 处的颜色
                                                    }]
                                                }
                                            } else if (item.name == data[2].name) {
                                                return {
                                                    type: 'linear',
                                                    x: 0,
                                                    y: 0,
                                                    x2: 0,
                                                    y2: 1,
                                                    colorStops: [{
                                                        offset: 0, color: '#FD551A' // 0% 处的颜色
                                                    }, {
                                                        offset: 1, color: '#FFAD54' // 100% 处的颜色
                                                    }]
                                                }
                                            }
                                        })(),
                                    }
                                },
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'center',
                                        color: '#fff',
                                        // padding: (function (val) {
                                        //     if (item.name == data[0].name) {
                                        //         return [0, 200 * vm.scale, 0, 0]
                                        //     }
                                        //     else if (item.name == data[1].name) {
                                        //         return [0, 0, 0, 200 * vm.scale]
                                        //     }
                                        //     else if (item.name == data[1].name) {
                                        //         return [0, 0, 0, 200 * vm.scale]
                                        //     }
                                        // })(),
                                        formatter: function (val) {
                                            total <= 0 ? total = 1 : '';
                                            var str1, str2, str3;
                                            if (val.name == data[0].name) {
                                                // str1 = '{a1|' + item.name + '}' + '\n';
                                                str2 = '{b1|' + Math.round(val.value / total * 10000) / 100 + '%}' + '\n';
                                                str3 = '{c1|' + val.value + '} 人次';
                                            } else if (val.name == data[1].name) {
                                                // str1 = '{a2|' + item.name + '}' + '\n';
                                                str2 = '{b2|' + Math.round(val.value / total * 10000) / 100 + '%}' + '\n';
                                                str3 = '{c2|' + val.value + '} 人次';
                                            } else if (val.name == data[2].name) {
                                                // str1 = '{a3|' + item.name + '}' + '\n';
                                                str2 = '{b3|' + Math.round(val.value / total * 10000) / 100 + '%}' + '\n';
                                                str3 = '{c3|' + val.value + '} 人次';
                                            }
                                            return str2 + str3
                                        },
                                        rich: {
                                            b1: {
                                                color: "#3DA6FF",
                                                fontSize: 17,
                                                lineHeight: 30,
                                                align: 'center'
                                            },
                                            c1: {
                                                color: "#fff",
                                                fontSize: 17,
                                                lineHeight: 20,
                                                align: 'center'
                                            },
                                            b2: {
                                                color: "#61D800",
                                                fontSize: 17,
                                                lineHeight: 30,
                                                align: 'center'
                                            },
                                            c2: {
                                                color: "#fff",
                                                fontSize: 17,
                                                lineHeight: 20,
                                                align: 'center'
                                            },
                                            b3: {
                                                color: "#FD571B",
                                                fontSize: 17,
                                                lineHeight: 30,
                                                align: 'center'
                                            },
                                            c3: {
                                                color: "#fff",
                                                fontSize: 17,
                                                lineHeight: 20,
                                                align: 'center'
                                            }
                                        }
                                    }
                                }
                            }]
                    }
                )
            });
            var option = {
                series: seriesArr
            };
            vm.chart1.setOption(option);
        },
        initChart3: function () {
            var vm = this;
            var option = {
                color: ['#BFBFBF', '#FFFFFF', '#5A20F5', '#313131', '#535353'],
                series: [
                    {
                        type: 'pie',
                        hoverAnimation: false,
                        center: ['50%', '55%'],
                        radius: ['45%', '48%'],
                        label: {
                            color: '#fff'
                        },
                        clockwise: true,
                        labelLine: {
                            // show: false,
                            length: 20,
                            length2: 20,
                        },
                        itemStyle: {
                            borderWidth: 6 * vm.scale
                        },
                        data: []
                    }
                ]
            };
            vm.chart3.setOption(option);
        },
        updateChart3: function (data) {
            var vm = this;
            var colors = ['#FE6C29', '#1C65CC', '#56A619', '#2FE4C3'];
            var itemStylePlaceHolder = {
                normal: {
                    color: 'rgba(0,0,0,0)',
                    borderColor: 'rgba(0,0,0,0)',
                    borderWidth: 0
                }
            };
            var total = 0;
            data.forEach(function (a, i) {
                total += a.value
            });
            var dataArr = [];
            data.forEach(function (a, i) {
                dataArr.push({
                    name: a.name,
                    value: a.value,
                    label: {
                        formatter: function (val) {
                            return "{a|" + Math.round(a.value / total * 10000) / 100 + "%}" + "  {b|" + a.name + "}"
                        },
                        rich: {
                            a: {
                                color: '#fff',
                                fontSize: 17
                            },
                            b: {
                                color: '#87A9FF',
                                fontSize: 17
                            }
                        }
                    },
                    itemStyle: {
                        borderColor: colors[i]
                    }
                }, {
                    name: "空格",
                    value: total / 20,
                    label: {show: false},
                    itemStyle: itemStylePlaceHolder,
                    tooltip: {
                        backgroundColor: "rgba(0,0,0,0)",
                        formatter: function (val) {
                            return ""
                        }
                    }
                })
            })
            vm.chart3.setOption({
                series: [{
                    data: dataArr
                }]
            });
            vm.chart3.hideLoading();
        },
        initChart4: function () {
            var vm = this;
            var option = {
                grid: {
                    top: 20,
                    bottom: 30,
                    left: '15%',
                    right: 30
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            width: 2,
                            color: ['rgba(150,108,247,0.5)']
                        }
                    },
                    axisLabel: {
                        show: true,
                        interval: 'auto',
                        fontSize: 12 * 2,
                        color: '#808080',
                        formatter: function (val) {
                            if (vm.navi == 0) {
                                return val
                            } else {
                                var arr = val.split('-');
                                return arr[1] + '/' + arr[2]
                            }
                        }
                    },
                    data: []
                },
                yAxis: {
                    type: 'value',
                    splitNumber: 3,
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
                        showMinLabel: false,
                        fontSize: 12 * 2,
                        color: '#808080'
                    }
                },
                series: [{
                    type: 'line',
                    name: 'number',
                    lineStyle: {
                        width: 4,
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: '#DB5D09' // 0% 处的颜色
                            }, {
                                offset: 1, color: '#FF9999' // 100% 处的颜色
                            }]
                        }
                    },
                    itemStyle: {
                        opacity: 0
                    },
                    areaStyle: {
                        color: 'rgba(255,153,153,0.2)'
                    },
                    data: []
                }]
            }
            vm.chart4.setOption(option);
            vm.chart4.hideLoading();
        },
        initChart5: function () {
            var vm = this;
            var data = vm.feedback;
            var total = 0;
            // data.forEach(function (a) {
            // 	total += a.value
            // })
            total = vm.total;
            // total == 0 ? total = 1 : '';
            var seriesArr1 = [
                {
                    name: '',
                    type: 'pie',
                    radius: ['40%', '50%'],
                    hoverAnimation: false,
                    avoidLabelOverlap: false,
                    center: ['70%', '60%'],
                    itemStyle: {
                        normal: {
                            color: '#666F9A',
                            borderWidth: 1,
                            borderColor: '#666F9A',
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: false
                            }
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'center',
                            padding: (function (val) {
                                return [0, 250, 0, 0]
                                // if (item.name == data[0].name) {
                                //     return [0, 300, 0, 0]
                                // } else if (item.name == data[1].name) {
                                //     return [0, 0, 0, 300]
                                // }
                            })(),
                            formatter: function (val) {
                                var str1, str2, str3;
                                // str1 = '{a1|pc端}' + '\n';
                                // str2 = '{b1|' + Math.round(val.value / total * 100) + '%}' + '\n';
                                // str3 = '{c1|' + val.value + '}';
                                if (val.name == data[0].name) {
                                    str1 = '{a1|' + data[0].name + '}' + '\n';
                                    str2 = '{b1|' + Math.round(val.value / total * 100) + '%}' + '\n';
                                    str3 = '{c1|' + val.value + '}';
                                    return str1 + str2 + str3
                                } else {

                                }
                                // else if (val.name == data[1].name) {
                                //     str1 = '{a2|' + item.name + '}' + '\n';
                                //     str2 = '{b2|' + Math.round(val.value / total * 100) + '%}' + '\n';
                                //     str3 = '{c2|' + val.value + '}';
                                // }
                            },
                            rich: {
                                a1: {
                                    color: "#808080",
                                    fontSize: 19,
                                    lineHeight: 40,
                                    align: 'center'
                                },
                                b1: {
                                    color: "#fff",
                                    fontSize: 19,
                                    lineHeight: 30,
                                    align: 'center'
                                },
                                c1: {
                                    color: "#fff",
                                    fontSize: 19,
                                    lineHeight: 20,
                                    align: 'center'
                                },
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: [
                        {value: vm.total - data[0].value, name: ''},
                        {
                            name: 'PC端',
                            value: data[0].value,
                            itemStyle: {
                                normal: {
                                    color: (function (val) {
                                        return '#2FE4C3'
                                        // if (item.name == data[0].name) {
                                        //     return '#2FE4C3'
                                        // } else if (item.name == data[1].name) {
                                        //     return '#EA68A2'
                                        // }
                                    })(),
                                    borderColor: (function (val) {
                                        return '#2FE4C3'
                                        // if (item.name == data[0].name) {
                                        //     return '#2FE4C3'
                                        // } else if (item.name == data[1].name) {
                                        //     return '#EA68A2'
                                        // }
                                    })(),
                                }
                            },
                        }
                    ]
                }
            ];
            var seriesArr2 = [
                {
                    name: '',
                    type: 'pie',
                    radius: ['40%', '50%'],
                    hoverAnimation: false,
                    avoidLabelOverlap: false,
                    center: ['30%', '60%'],
                    itemStyle: {
                        normal: {
                            color: '#666F9A',
                            borderWidth: 1,
                            borderColor: '#666F9A',
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: false
                            }
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'center',
                            padding: (function (val) {
                                return [0, 0, 0, 250]
                                // if (item.name == data[0].name) {
                                //     return [0, 300, 0, 0]
                                // } else if (item.name == data[1].name) {
                                //     return [0, 0, 0, 300]
                                // }
                            })(),
                            formatter: function (val) {
                                var str1, str2, str3;
                                // str1 = '{a1|pc端}' + '\n';
                                // str2 = '{b1|' + Math.round(val.value / total * 100) + '%}' + '\n';
                                // str3 = '{c1|' + val.value + '}';
                                if (val.name == data[1].name) {
                                    str1 = '{a2|' + data[1].name + '}' + '\n';
                                    str2 = '{b2|' + Math.round(val.value / total * 100) + '%}' + '\n';
                                    str3 = '{c2|' + val.value + '}';
                                    return str1 + str2 + str3
                                }
                                // else if (val.name == data[1].name) {
                                //     str1 = '{a2|' + item.name + '}' + '\n';
                                //     str2 = '{b2|' + Math.round(val.value / total * 100) + '%}' + '\n';
                                //     str3 = '{c2|' + val.value + '}';
                                // }
                            },
                            rich: {
                                a2: {
                                    color: "#808080",
                                    fontSize: 19,
                                    lineHeight: 40,
                                    align: 'center'
                                },
                                b2: {
                                    color: "#fff",
                                    fontSize: 19,
                                    lineHeight: 30,
                                    align: 'center'
                                },
                                c2: {
                                    color: "#fff",
                                    fontSize: 19,
                                    lineHeight: 20,
                                    align: 'center'
                                }
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: [
                        {value: vm.total - data[1].value, name: ''},
                        {
                            name: '移动端',
                            value: data[1].value,
                            itemStyle: {
                                normal: {
                                    color: (function (val) {
                                        return '#EA68A2'
                                        // if (item.name == data[0].name) {
                                        //     return '#2FE4C3'
                                        // } else if (item.name == data[1].name) {
                                        //     return '#EA68A2'
                                        // }
                                    })(),
                                    borderColor: (function (val) {
                                        return '#EA68A2'
                                        // if (item.name == data[0].name) {
                                        //     return '#2FE4C3'
                                        // } else if (item.name == data[1].name) {
                                        //     return '#EA68A2'
                                        // }
                                    })(),
                                }
                            },
                        }
                    ]
                }
            ];
            var option1 = {
                series: seriesArr1
            };
            var option2 = {
                series: seriesArr2
            };
            vm.chart51.setOption(option1);
            vm.chart52.setOption(option2);
        },
        initChart6: function (data) {
            var vm = this;
            var titleArr = [], seriesArr = [], center = [], color = '', color1 = '', str = '', total = 0;
            data.forEach(function (item, index) {
                if (index == 0) {
                    center = ['25%', '30%'];
                    color = '#EF45AC';
                    color1 = '#412A4E';
                    total = vm.countData.count;
                    // str = Math.round(item.value / total * 10000) / 100 + '%';
                } else if (index == 1) {
                    center = ['75%', '30%'];
                    color = '#EF45AC';
                    color1 = '#412A4E';
                    total = vm.countData.count;
                    // str = Math.round(item.value / total * 10000) / 100 + '%';
                } else if (index == 2) {
                    center = ['25%', '75%'];
                    color = '#613FD1';
                    color1 = '#453284';
                    total = vm.countData.learn_num;
                    // str = Math.round(item.value / total * 10000) / 100 + '%';
                } else if (index == 3) {
                    center = ['75%', '75%'];
                    color = '#613FD1';
                    color1 = '#453284';
                    total = vm.countData.learn_num;
                    // str = Math.round(item.value / total * 10000) / 100 + '%';
                }
                if (total <= 0) return;
                seriesArr.push(
                    {
                        type: 'pie',
                        name: item.name,
                        clockWise: false,
                        radius: ['28%', '26%'],
                        startAngle: -225,
                        itemStyle: {
                            normal: {
                                // color: {
                                //     type: 'linear',
                                //     x: 0,
                                //     y: 0,
                                //     x2: 0,
                                //     y2: 1,
                                //     colorStops: [{
                                //         offset: 0, color: color // 0% 处的颜色
                                //     }, {
                                //         offset: 1, color: '#F7563E' // 100% 处的颜色
                                //     }]
                                // },
                                color: color,
                                label: {
                                    show: false
                                },
                                labelLine: {
                                    show: false
                                },
                                borderWidth: 5,
                                borderColor: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [{
                                        offset: 0, color: color // 0% 处的颜色
                                    }, {
                                        offset: 1, color: color // 100% 处的颜色
                                    }]
                                },
                            }
                        },
                        hoverAnimation: false,
                        // center: [index * 20 + 11 + '%', index % 2 * 40 + 40 + '%'],
                        center: center,
                        data: [{
                            value: total - item.value,
                            name: 'invisible',
                            itemStyle: {
                                normal: {
                                    color: color1,
                                    borderWidth: 0
                                },
                                emphasis: {
                                    show: false
                                }
                            }
                        }, {
                            value: item.value,
                            label: {
                                normal: {
                                    formatter: function (val) {
                                        console.log(val)
                                        return `${item.title}\n` + '{a|' + val.percent + '%}' + `\n${val.seriesName}\n`
                                    },
                                    rich: {
                                        a: {
                                            color: color,
                                            fontSize: 18,
                                        }
                                    },
                                    position: 'center',
                                    show: true,
                                    textStyle: {
                                        fontSize: 12,
                                        color: '#fff',
                                        padding: [40, 0, 0, 0],
                                        lineHeight: 30
                                    }
                                }
                            }
                        }]
                    })
            });
            var option = {
                series: seriesArr
            }
            vm.chart6.setOption(option);
        },
        // 学习单正确率
        _learn_rate: function () {
            var vm = this;
            $.ajax({
                type: 'get',
                data: {
                    p: "t"
                },
                headers: {'Accept': 'application/json'},
                url: baseurl1 + "api/learn_rate",
                success: function (rlt) {
                    vm.countData = rlt.data;
                    var data = [
                        {
                            name: '微信',
                            title: '答题率',
                            value: vm.countData.wx_num
                        }, {
                            name: 'APP',
                            title: '答题率',
                            value: vm.countData.app_num
                        }, {
                            name: '微信',
                            title: '正确率',
                            value: vm.countData.wx_correct_num
                        }, {
                            name: 'APP',
                            title: '正确率',
                            value: vm.countData.app_correct_num
                        }
                    ];
                    vm.initChart6(data)
                },
                error: function (err) {
                    console.log(err)
                }
            });
        },
        // 获取下载量
        getAppnum: function () {
            var vm = this;
            $.ajax({
                type: 'get',
                data: {
                    p: "t"
                },
                headers: {'Accept': 'application/json'},
                url: baseurl1 + "api/version/download_num",
                success: function (rlt) {
                    vm.appdownloadnum = rlt.data;
                },
                error: function (err) {
                    console.log(err)
                }
            });
        }
    }
});