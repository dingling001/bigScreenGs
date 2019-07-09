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
        appdownloadnum:0,
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
        cabinet_i: 0,
        current_i: 0,
        cabinet_list: [],
        cabinet_list_init: [
            {
                cabinet_num: 12000304,
                addr: "龙的时代展厅对面"
            },
            {
                cabinet_num: 12000306,
                addr: "龙的时代展厅对面"
            },
            {
                cabinet_num: 12000302,
                addr: "龙的时代展厅对面"
            },
            {
                cabinet_num: 12000305,
                addr: "二楼服务台处"
            },
            {
                cabinet_num: 12000303,
                addr: "二楼服务台处"
            },
            {
                cabinet_num: 12000301,
                addr: "二楼服务台处"
            }
        ],
        guidUseData: {},
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
        movieI: 0,
        today_num: 0, //今日观影人数
        total_num: 0, //累计观影人数
        movieData: [] //影片信息
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

        // // vm.chart6 = echarts.init(document.querySelector("#chart6"));
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
        vm.getAppnum()
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

        setInterval(function () {
            vm.movieI == vm.movieData.length - 1 ? vm.movieI = 0 : vm.movieI++
            vm.cabinet_i == vm.cabinet_list_init.length - 1 ? vm.cabinet_i = 0 : vm.cabinet_i++
        }, 10000);

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
        // 数字智慧导览使用情况-图表初始化
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
        // 七日智慧笔租赁次数
        // 观众预约总数-图表初始化
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
        // 观众预约总数-更新数据
        updateChart4: function (data) {
            var vm = this;
            vm.chart1.setOption({
                xAxis: {
                    data: data.dates
                },
                series: [{
                    name: 'number',
                    data: data.values
                }]
            })
        },
        // 观众意见反馈-pc端、移动端反馈
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

            // data.forEach(function (item, index) {
            //     seriesArr.push(
            //         {
            //             type: 'pie',
            //             name: item.name,
            //             clockWise: true,
            //             startAngle: 180,
            //             hoverAnimation: false,
            //             radius: ['25%', '25%'],
            //             center: [index * 30 + 37 + '%', '50%'],
            //             itemStyle: {
            //                 normal: {
            //                     color: '#EA68A2',
            //                     borderWidth: 10,
            //                     borderColor: '#EA68A2',
            //                     label: {
            //                         show: false
            //                     },
            //                     labelLine: {
            //                         show: false
            //                     }
            //                 }
            //             },
            //             data: [{
            //                 name: '',
            //                 value: item.value==0?.001:0,
            //                 itemStyle: {
            //                     normal: {
            //                         color: 'rgba(255,255,255,0)',
            //                         borderColor: 'rgba(255,255,255,0)'
            //                     }
            //                 }
            //             }, {
            //                 name: '',
            //                 value: total - item.value - 0.15 * total,
            //                 itemStyle: {
            //                     normal: {
            //                         color: '#666F9A',
            //                         borderColor: '#666F9A'
            //                     }
            //                 }
            //             }, {
            //                 name: item.name,
            //                 value: item.value,
            //                 itemStyle: {
            //                     normal: {
            //                         color: (function (val) {
            //                             if (item.name == data[0].name) {
            //                                 return '#2FE4C3'
            //                             } else if (item.name == data[1].name) {
            //                                 return '#EA68A2'
            //                             }
            //                         })(),
            //                         borderColor: (function (val) {
            //                             if (item.name == data[0].name) {
            //                                 return '#2FE4C3'
            //                             } else if (item.name == data[1].name) {
            //                                 return '#EA68A2'
            //                             }
            //                         })(),
            //                     }
            //                 },
            //                 label: {
            //                     normal: {
            //                         show: true,
            //                         position: 'center',
            //                         padding: (function (val) {
            //                             if (item.name == data[0].name) {
            //                                 return [0, 300, 0, 0]
            //                             } else if (item.name == data[1].name) {
            //                                 return [0, 0, 0, 300]
            //                             }
            //                         })(),
            //                         formatter: function (val) {
            //                             var str1, str2, str3,str4;
            //                             if (val.name == data[0].name) {
            //                                 str1 = '{a1|' + item.name + '}' + '\n';
            //                                 str2 = '{b1|' + Math.round(val.value / total*100) + '%}' + '\n';
            //                                 str3 = '{c1|' + val.value + '}';
            //                             } else if (val.name == data[1].name) {
            //                                 str1 = '{a2|' + item.name + '}' + '\n';
            //                                 str2 = '{b2|' + Math.round(val.value / total*100) + '%}' + '\n';
            //                                 str3 = '{c2|' + val.value + '}';
            //                             }
            //                             return str1 + str2 + str3
            //                         },
            //                         rich: {
            //                             a1: {
            //                                 color: "#808080",
            //                                 fontSize: 19,
            //                                 lineHeight: 40,
            //                                 align: 'center'
            //                             },
            //                             b1: {
            //                                 color: "#fff",
            //                                 fontSize: 19,
            //                                 lineHeight: 30,
            //                                 align: 'center'
            //                             },
            //                             c1: {
            //                                 color: "#fff",
            //                                 fontSize: 19,
            //                                 lineHeight: 20,
            //                                 align: 'center'
            //                             },
            //                             a2: {
            //                                 color: "#808080",
            //                                 fontSize: 19,
            //                                 lineHeight: 40,
            //                                 align: 'center'
            //                             },
            //                             b2: {
            //                                 color: "#fff",
            //                                 fontSize: 19,
            //                                 lineHeight: 30,
            //                                 align: 'center'
            //                             },
            //                             c2: {
            //                                 color: "#fff",
            //                                 fontSize: 19,
            //                                 lineHeight: 20,
            //                                 align: 'center'
            //                             }
            //                         }
            //                     }
            //                 }
            //             }]
            //         }
            //     )
            // });
            var option1 = {
                series: seriesArr1
            };
            var option2 = {
                series: seriesArr2
            };
            vm.chart51.setOption(option1);
            vm.chart52.setOption(option2);
        },

        // 海博馆创收建设数据-图表初始化
        initChart6: function () {
            var vm = this;
            var option = {
                title: {
                    text: '{a|总收入：}{b|￥ 0 元}',
                    textStyle: {
                        color: '#FF4E00',
                        rich: {
                            a: {
                                fontSize: 12 * vm.scale,
                                lineHeight: 30 * vm.scale
                            },
                            b: {
                                fontSize: 16 * vm.scale,
                                lineHeight: 30 * vm.scale,
                                fontWeight: 'bolder'
                            }
                        }
                    }
                },
                tooltip: {},
                color: ['#BFBFBF', '#FFFFFF', '#5A20F5', '#313131', '#535353'],
                series: [
                    {
                        type: 'pie',
                        hoverAnimation: false,
                        center: ['50%', '55%'],
                        radius: ['45%', '47%'],
                        label: {
                            color: '#fff'
                        },
                        labelLine: {
                            //							show: false,
                            length: 5 * vm.scale,
                            length2: 10 * vm.scale
                        },
                        itemStyle: {
                            borderWidth: 5 * vm.scale
                        },
                        data: []
                    }
                ]
            };
            vm.chart6.setOption(option);
        }
        ,
        updateChart6: function (data) {
            var vm = this;
            var colors = ['#BFBFBF', '#FFFFFF', '#5A20F5', '#313131', '#535353'];
            var itemStylePlaceHolder = {
                normal: {
                    color: 'rgba(0,0,0,0)',
                    borderColor: 'rgba(0,0,0,0)',
                    borderWidth: 0
                }
            }
            data = [
                {
                    name: "活动",
                    value: 30000
                },
                {
                    name: "临展",
                    value: 32005
                },
                {
                    name: "影院",
                    value: 30033
                },
                {
                    name: "自助导览机",
                    value: 66126
                },
                {
                    name: "讲解",
                    value: 90155
                }
            ];
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
                            return "{a|" + a.name + "}" + " " + "{b|" + Math.round(a.value / total * 10000) / 100 + "%}"
                        },
                        rich: {
                            a: {
                                color: '#fff'
                            },
                            b: {
                                color: '#FF4E00'
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
            vm.chart6.setOption({
                title: {
                    text: '{a|总收入：}{b|￥ ' + Comfun.toSplit(total) + ' 元}',
                    textStyle: {
                        color: '#FF4E00',
                        rich: {
                            a: {
                                fontSize: 12 * vm.scale,
                                lineHeight: 30 * vm.scale
                            },
                            b: {
                                fontSize: 16 * vm.scale,
                                lineHeight: 30 * vm.scale,
                                fontWeight: 'bolder'
                            }
                        }
                    }
                },
                series: [{
                    data: dataArr
                }]
            });
        }
        ,

        // 影片累计观看人次-图表初始化
        initChart7: function () {
            var vm = this;
            var option = {
                title: {
                    text: '七日上座率',
                    textStyle: {
                        fontSize: 12 * vm.scale,
                        color: '#fff'
                    }
                },
                grid: {
                    top: 35 * vm.scale,
                    bottom: 25 * vm.scale,
                    left: 40 * vm.scale,
                    right: '5%'
                },
                xAxis: {
                    type: 'category',
                    axisLabel: {
                        color: '#fff'
                    },
                    splitLine: {show: false},
                    axisLine: {show: false},
                    axisTick: {show: false},
                    data: []
                },
                yAxis: {
                    type: 'value',
                    splitNumber: 2 * vm.scale,
                    axisLabel: {
                        color: '#fff',
                        formatter: function (val) {
                            return val * 100 + "%"
                        }
                    },
                    splitLine: {show: false},
                    axisLine: {show: false},
                    axisTick: {show: false}
                },
                series: [{
                    type: 'bar',
                    barWidth: 15 * vm.scale,
                    barGap: '80%',
                    itemStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: '#5A0AEC' // 0% 处的颜色
                            }, {
                                offset: 1, color: '#7F16E7' // 100% 处的颜色
                            }]
                        }
                    },
                    data: []
                }]
            };
            vm.chart7.setOption(option);
        }
        ,
        // 影片累计观看人次-更新数据
        updateChart7: function (data) {
            var vm = this;
            // data = [
            // 	{
            // 		date: '2019-05-01',
            // 		attendance_rate: 0.2
            // 	},
            // 	{
            // 		date: '2019-05-02',
            // 		attendance_rate: 0.2
            // 	},
            // 	{
            // 		date: '2019-05-03',
            // 		attendance_rate: 0.65
            // 	},
            // 	{
            // 		date: '2019-05-04',
            // 		attendance_rate: 0.72
            // 	},
            // 	{
            // 		date: '2019-05-05',
            // 		attendance_rate: 0.8
            // 	},
            // 	{
            // 		date: '2019-05-06',
            // 		attendance_rate: 0.62
            // 	},
            // 	{
            // 		date: '2019-05-07',
            // 		attendance_rate: 0.67
            // 	}
            // ]
            var xArr = [], dataArr = [];
            data.forEach(function (a, i) {
                xArr.push(Number(a.date.split('-')[1]) + "/" + Number(a.date.split('-')[2]));
                a.attendance_rate = a.attendance_rate > 1 ? 1 : a.attendance_rate;
                dataArr.push(a.attendance_rate);
            });
            vm.chart7.setOption({
                xAxis: {
                    data: xArr
                },
                series: [{
                    data: dataArr
                }]
            });
        }
        ,
        // 今日影院预约人数-图表初始化
        initChart8: function (data) {
            var vm = this;
            // var data = [
            // 	{
            // 		start_time: '10:00',
            // 		attendance_rate: 50
            // 	},
            // 	{
            // 		start_time: '14:00',
            // 		attendance_rate: 60
            // 	},
            // 	{
            // 		start_time: '16:00',
            // 		attendance_rate: 80
            // 	}
            // ];
            var titleArr = [], seriesArr = [];
            data.forEach(function (item, index) {
                titleArr.push(
                    {
                        text: item.start_time,
                        left: index * 30 + 20 + '%',
                        bottom: '10%',
                        textAlign: 'center',
                        textStyle: {
                            fontWeight: 'normal',
                            fontSize: '14' * vm.scale,
                            color: '#fff',
                            textAlign: 'center',
                        }
                    }
                );
                seriesArr.push(
                    {
                        name: item.start_time,
                        type: 'pie',
                        clockWise: false,
                        startAngle: 90,
                        hoverAnimation: false,
                        radius: ["48%", "50%"],
                        center: [index * 30 + 20 + '%', '40%'],
                        itemStyle: {
                            normal: {
                                color: {
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
                                },
                                label: {
                                    show: false
                                },
                                labelLine: {
                                    show: false
                                },
                                borderWidth: 4 * vm.scale,
                                borderColor: {
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
                                },
                            }
                        },
                        data: [{
                            // value: item.total - item.value,
                            value: 100 - item.attendance_rate,
                            itemStyle: {
                                normal: {
                                    color: '#535353',
                                    borderWidth: 0
                                },
                                emphasis: {
                                    show: false
                                }
                            }
                        }, {
                            value: item.attendance_rate,
                            // value: item.attendance_rate  + '%',
                            label: {
                                normal: {
                                    formatter: function (val) {
                                        return item.attendance_rate + '%';
                                    },
                                    position: 'center',
                                    show: true,
                                    textStyle: {
                                        fontSize: 12 * vm.scale,
                                        color: '#fff'
                                    }
                                }
                            }
                        }]
                    }
                )
            });
            var option = {
                title: titleArr,
                series: seriesArr
            }
            vm.chart8.setOption(option);
        }
        ,
        // 今日影院预约人数-更新数据
        updateChart8: function (data) {
            var vm = this;
        }
        ,
        // 自助租赁柜使用情况
        chooseCabinet: function (i) {
            var vm = this;
            vm.cabinet_i = i;
        }
        ,
        // 获取自助导览机使用数量
        guideData: function () {
            var vm = this;
            $.ajax({
                type: 'get',
                data: {
                    p: "w"
                },
                url: baseurl1 + "api/big_stat",
                success: function (rlt) {
                    console.log(rlt)
                    if (rlt.status == 1) {
                        vm.oneData = rlt.data;
                    }
                },
                error: function (err) {
                    console.log(err)
                }
            });
        }
        ,
        // 获取微信/app 导览使用数量
        // 热门参观路线top6
        hotRoads: function () {
            var vm = this;
            $.ajax({
                type: 'get',
                data: {
                    p: "w"
                },
                url: localStorage.getItem("baseweb") + "/api/road/hot_roads",
                success: function (rlt) {
                    var data = rlt.data
                    vm.updateChart2(data);
                },
                error: function (err) {
                    console.log(err)
                }
            });
        }
        ,
        // 热门参观路线top6
        activeNumPro: function () {
            var vm = this;
            $.ajax({
                type: 'get',
                data: {
                    p: "w"
                },
                url: localStorage.getItem("baseactive") + "/api/active_num_pro",
                success: function (rlt) {
                    var data = rlt.data
                    vm.updateChart3(data);
                },
                error: function (err) {
                    console.log(err)
                }
            });
        }
        ,
        // 获取影院统计
        getCinemaData: function () {
            var vm = this;
            $.ajax({
                type: 'get',
                data: {
                    p: "w"
                },
                url: localStorage.getItem("basecinema") + "/api/stat/cinema_stat",
                success: function (rlt) {
                    var data = rlt.data.attendance_rate;
                    var data2 = rlt.data.today_attendance_rate_list;
                    vm.today_num = rlt.data.today_num
                    vm.total_num = rlt.data.total_num
                    vm.movieData = rlt.data.movie_list;
                    vm.updateChart7(data);
                    vm.initChart8(data2);
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
                    vm.appdownloadnum=rlt.data;
                },
                error: function (err) {
                    console.log(err)
                }
            });
        }
    }
});