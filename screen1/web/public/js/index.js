var VM = new Vue({
    el: "#main",
    data: {
        tmp: 0,//温度
        qlty: '优',//空气质量
        cond_txt: '晴',
        cond_code: '100',
        scale: 2,
        chart1: null,
        chart2: null,
        chart3: null,
        watchFilmNu: 0,
        chart5: null,
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
        initChart1Data: [{
            name: '自助导览机使用',
            value: 0
        }, {
            name: '微信导览使用',
            value: 0
        }],
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
        vm.setWeather();
        vm.air()
        vm.chart1 = echarts.init(document.querySelector("#chart1"));
        vm.chart2 = echarts.init(document.querySelector("#chart2"));
        vm.chart3 = echarts.init(document.querySelector("#chart3"));
        vm.chart5 = echarts.init(document.querySelector("#chart5"));
        vm.chart6 = echarts.init(document.querySelector("#chart6"));
        vm.chart7 = echarts.init(document.querySelector("#chart7"));
        vm.chart8 = echarts.init(document.querySelector("#chart8"));
        // vm.initChart1();
        vm.guidData();
        vm.initChart2();
        // vm.updateChart2();
        vm.hotRoads();
        vm.initChart3();
        // vm.updateChart3();
        vm.activeNumPro();
        vm.initChart5();
        // vm.updateChart5();
        vm.initChart6();
        vm.updateChart6();
        vm.initChart7();
        // vm.updateChart7();
        vm.getCinemaData();
        // vm.initChart8();
        // vm.updateChart8();

        setInterval(function () {
            vm.guidData();
            vm.hotRoads();
            vm.activeNumPro();
            vm.getCinemaData();
        }, 10000)

        setInterval(function () {
            vm.movieI == vm.movieData.length - 1 ? vm.movieI = 0 : vm.movieI++
            vm.cabinet_i == vm.cabinet_list_init.length - 1 ? vm.cabinet_i = 0 : vm.cabinet_i++
        }, 10000)
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
                        console.log(now)
                        vm.tmp = now.tmp;
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
        // 数字智慧导览使用情况-图表初始化
        initChart1: function () {
            var vm = this;
            // var data = [
            // 	{
            // 		name: '自助导览机使用',
            // 		value: 336
            // 	}, {
            // 		name: '微信导览使用',
            // 		value: 207
            // 	}
            // ];
            var data = vm.initChart1Data;
            var total = 0;
            data.forEach(function (item, index) {
                total += item.value
            })
            var seriesArr = [];
            data.forEach(function (item, index) {
                seriesArr.push(
                    {
                        type: 'pie',
                        name: item.name,
                        clockWise: false,
                        startAngle: 90,
                        hoverAnimation: false,
                        radius: ['25%', '26%'],
                        center: ['50%', index * 40 + 30 + '%',],
                        itemStyle: {
                            normal: {
                                color: '#535353',
                                borderWidth: 5 * vm.scale,
                                borderColor: '#535353',
                                label: {
                                    show: false
                                },
                                labelLine: {
                                    show: false
                                }
                            }
                        },
                        data: [{
                            name: '',
                            value: total - item.value,
                            itemStyle: {
                                normal: {
                                    borderWidth: 1 * vm.scale
                                }
                            }
                        }, {
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
                                        }
                                    })(),
                                }
                            },
                            label: {
                                normal: {
                                    show: true,
                                    position: 'center',
                                    padding: (function (val) {
                                        if (item.name == data[0].name) {
                                            return [0, 200 * vm.scale, 0, 0]
                                        } else if (item.name == data[1].name) {
                                            return [0, 0, 0, 200 * vm.scale]
                                        }
                                    })(),
                                    formatter: function (val) {
                                        total <= 0 ? total = 1 : '';
                                        var str1, str2, str3;
                                        if (val.name == data[0].name) {
                                            str1 = '{a1|' + item.name + '}' + '\n';
                                            str2 = '{b1|' + Math.round(val.value / total * 10000) / 100 + '%}' + '\n';
                                            str3 = '{c1|' + val.value + '}';
                                        } else if (val.name == data[1].name) {
                                            str1 = '{a2|' + item.name + '}' + '\n';
                                            str2 = '{b2|' + Math.round(val.value / total * 10000) / 100 + '%}' + '\n';
                                            str3 = '{c2|' + val.value + '}';
                                        }
                                        return str1 + str2 + str3
                                    },
                                    rich: {
                                        a1: {
                                            color: "#808080",
                                            fontSize: 14 * vm.scale,
                                            lineHeight: 20 * vm.scale,
                                            align: 'right'
                                        },
                                        b1: {
                                            color: "#378DFF",
                                            fontSize: 26 * vm.scale,
                                            lineHeight: 30 * vm.scale,
                                            align: 'right'
                                        },
                                        c1: {
                                            color: "#fff",
                                            fontSize: 14 * vm.scale,
                                            lineHeight: 20 * vm.scale,
                                            align: 'right'
                                        },
                                        a2: {
                                            color: "#808080",
                                            fontSize: 14 * vm.scale,
                                            lineHeight: 20 * vm.scale,
                                            align: 'left'
                                        },
                                        b2: {
                                            color: "#61D800",
                                            fontSize: 26 * vm.scale,
                                            lineHeight: 30 * vm.scale,
                                            align: 'left'
                                        },
                                        c2: {
                                            color: "#fff",
                                            fontSize: 14 * vm.scale,
                                            lineHeight: 20 * vm.scale,
                                            align: 'left'
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
            }
            vm.chart1.setOption(option);
        },
        // 热门参观路线-图表初始化
        initChart2: function () {
            var vm = this;
            var option = {
                grid: {
                    top: 10 * vm.scale,
                    bottom: 35 * vm.scale,
                    left: '5%',
                    right: '5%'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'none'
                    },
                    formatter: function (params) {
                        return params[0].name + ': ' + params[0].value;
                    }
                },
                xAxis: {
                    axisTick: {show: false},
                    axisLine: {show: false},
                    axisLabel: {
                        interval: 0,
                        fontSize: 12 * vm.scale,
                        color: '#06A9D3',
                        formatter: function (val) {
                            var str = val;
                            if (str.length > 7) {
                                str = str.slice(0, 7) + '…'
                            }
                            if (str.length > 4) {
                                str = str.slice(0, 4) + '\n' + str.slice(4);
                            }
                            return str
                        }
                    },
                    data: []
                },
                yAxis: {
                    show: false
                },
                color: ['#BC15EC', '#7F16E7', '#5715EB', '#132AEA', '#1787EB'],
                series: [{
                    name: '热门参观路线',
                    type: 'pictorialBar',
                    barCategoryGap: '40%',
                    symbol: 'path://M0,10 L10,10 L5,0 L0,10 z',
                    symbolPosition: 'start',
                    itemStyle: {
                        normal: {
                            opacity: 1
                        }
                    },
                    data: [],
                    z: 10
                }]
            };
            vm.chart2.setOption(option);
        },
        // 热门参观路线-更新数据
        updateChart2: function (data) {
            var vm = this;
            var colors = ['#BC15EC', '#7F16E7', '#5715EB', '#132AEA', '#1787EB'];
            // data = [
            // 	{
            // 		name: "探索海洋路线",
            // 		value: 236
            // 	},
            // 	{
            // 		name: "海底两万里路线",
            // 		value: 636
            // 	},
            // 	{
            // 		name: "大航海路线",
            // 		value: 536
            // 	},
            // 	{
            // 		name: "海洋植物变迁路线",
            // 		value: 586
            // 	},
            // 	{
            // 		name: "鲸鱼路线",
            // 		value: 360
            // 	},
            // 	{
            // 		name: "矿物路线",
            // 		value: 200
            // 	},
            // 	{
            // 		name: "海鸟路线",
            // 		value: 360
            // 	},
            // 	{
            // 		name: "远古路线",
            // 		value: 200
            // 	},
            // 	{
            // 		name: "海盗路线",
            // 		value: 466
            // 	},
            // 	{
            // 		name: "奇观路线",
            // 		value: 500
            // 	}
            // ];
            var xArr = [], dataArr = [];
            data.sort(function (a, b) {
                return b.value - a.value
            })
            data = data.slice(0, 5);
            data.forEach(function (a, i) {
                xArr.push(a.name)
                //dataArr.push(a.value)
                var obj = {
                    value: a.value,
                    itemStyle: {
                        color: colors[i % 5]
                    }
                }
                dataArr.push(obj)
            });
            vm.chart2.setOption({
                xAxis: {
                    data: xArr
                },
                series: [
                    {
                        name: '热门参观路线',
                        data: dataArr
                    }
                ]
            });
        },
        // 活动累计参加人次-图表初始化
        initChart3: function () {
            var vm = this;
            var option = {
                grid: {
                    top: 10 * vm.scale,
                    bottom: 5 * vm.scale,
                    left: 50 * vm.scale,
                    right: '20%'
                },
                //				tooltip: {
                //					formatter: function (val) {
                //						if (val.componentIndex == 0) {
                //							return "类别数量：" + val.data["类别数量"] / 10
                //						} else {
                //							return "人次：" + val.data["人次"]
                //						}
                //					}
                //				},
                xAxis: {
                    show: false
                },
                yAxis: {
                    type: 'category',
                    inverse: true,
                    splitLine: {show: false},
                    axisTick: {show: false},
                    axisLine: {show: false},
                    axisLabel: {
                        fontSize: 12 * vm.scale,
                        color: '#06AAD5',
                        formatter: function (val) {
                            if (val.length > 3) {
                                val = val.slice(0, 2) + '…'
                            }
                            return val
                        }
                    }
                },
                dataset: {
                    dimensions: ['活动名称', '类别数量', '人次'],
                    source: [
                        //			            {
                        //			                '活动名称': '亲子', '类别数量': 22, '人次': 1858
                        //			            },
                        //			            {
                        //			                '活动名称': '课堂', '类别数量': 13, '人次': 1734
                        //			            },
                        //			            {
                        //			                '活动名称': '讲座', '类别数量': 22, '人次': 1652
                        //			            },
                        //			            {
                        //			                '活动名称': '研学', '类别数量': 21, '人次': 1539
                        //			            }
                    ]
                },
                series: [
                    {
                        type: 'bar',
                        label: {
                            show: true,
                            position: 'right',
                            color: '#fff',
                            offset: [0, -2],
                            //							formatter: function (val) {
                            //								var a = val.data
                            //								return a["类别数量"] / 10
                            //							},
                        },
                        itemStyle: {
                            color: '#77C90C'
                        }
                    },
                    {
                        type: 'bar',
                        barGap: 0,
                        barCategoryGap: '30%',
                        label: {
                            show: true,
                            position: 'right',
                            color: '#fff'
                        },
                        itemStyle: {
                            color: '#35A5EC'
                        }
                    }
                ]
            };
            vm.chart3.setOption(option);
        },
        // 活动累计参加人次-更新数据
        updateChart3: function (data) {
            var vm = this;
            // data = [
            // 	{
            // 		name: "亲子",
            // 		typenum: 12,
            // 		pernum: 1858
            // 	},
            // 	{
            // 		name: "课堂课堂",
            // 		typenum: 30,
            // 		pernum: 1734
            // 	},
            // 	{
            // 		name: "讲座",
            // 		typenum: 9,
            // 		pernum: 1652
            // 	},
            // 	{
            // 		name: "研学",
            // 		typenum: 12,
            // 		pernum: 1539
            // 	}
            // ];
            data.sort(function (a, b) {
                return b.active_order_count - a.active_order_count
            })
            data = data.slice(0, 4);

            /*添加比例*/
            var myscale = 1;
            if (data[0].active_order_count > 500) {

            }
            /*添加比例*/

            var datasetSourceArr = [];
            vm.watchFilmNu = 0;
            data.forEach(function (a, i) {
                var obj = {
                    '活动名称': a.cate_name,
                    '类别数量': a.active_cate_count * myscale,
                    '人次': a.active_order_count
                }
                vm.watchFilmNu += +a.active_order_count
                datasetSourceArr.push(obj)
            })
            vm.chart3.setOption({
                tooltip: {
                    formatter: function (val) {
                        if (val.componentIndex == 0) {
                            return "类别数量：" + val.data["类别数量"] / myscale
                        } else {
                            return "人次：" + val.data["人次"]
                        }
                    }
                },
                dataset: {
                    source: datasetSourceArr
                },
                series: [
                    {
                        type: 'bar',
                        label: {
                            formatter: function (val) {
                                var a = val.data
                                return a["类别数量"] / myscale
                            }
                        }
                    }
                ]
            });
        },
        // 租赁订单统计-图表初始化
        initChart5: function () {
            var vm = this;
            var option = {
                color: ['#E60012', '#22AC38', '#F8B551', '#0068B7'],
                grid: {
                    top: '30%',
                    bottom: 30 * vm.scale,
                    left: 40 * vm.scale,
                    right: '5%'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    icon: 'circle',
                    top: '5%',
                    right: '5%',
                    align: 'right',
                    itemWidth: 8 * vm.scale,
                    itemHeight: 8 * vm.scale,
                    itemGap: 20 * vm.scale,
                    textStyle: {
                        fontSize: 12 * vm.scale,
                        color: '#50D4FF'
                    },
                    data: []
                },
                xAxis: {
                    type: 'category',
                    axisLabel: {
                        color: '#808080'
                    },
                    axisLine: {show: false},
                    axisTick: {show: false},
                    data: []
                },
                yAxis: {
                    type: 'value',
                    splitNumber: 3 * vm.scale,
                    axisLabel: {
                        color: '#808080'
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#3D3D5A'
                        }
                    },
                    axisLine: {show: false},
                    axisTick: {show: false}
                },
                series: [
                    // {
                    // 	type:'line',
                    // 	name: '累计租赁订单',
                    // 	smooth: true,
                    // 	symbol: 'none',
                    // 	data:[150, 232, 201, 154, 190, 330, 410]
                    // },
                    // {
                    // 	type:'line',
                    // 	name: '增长订单',
                    // 	smooth: true,
                    // 	symbol: 'none',
                    // 	data:[20, 92, 91, 34, 29, 11, 10]
                    // },
                    // {
                    // 	type:'line',
                    // 	name: '租赁中订单',
                    // 	smooth: true,
                    // 	symbol: 'none',
                    // 	data:[80, 32, 34, 21, 12, 10, 30]
                    // },
                    // {
                    // 	type:'line',
                    // 	name: '累计耳机订单',
                    // 	smooth: true,
                    // 	symbol: 'none',
                    // 	data:[320, 332, 301, 334, 390, 330, 320]
                    // }
                ]
            };
            vm.chart5.setOption(option);
        },
        // 租赁订单统计-更新数据
        updateChart5: function (data) {
            var vm = this;
            data = {
                // times: ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
                times: JSON.parse(data.time_list),
                lists: [
                    {
                        name: "累计租赁订单",
                        nums: JSON.parse(data.all_order_counts)
                    },
                    {
                        name: "增长订单",
                        nums: JSON.parse(data.renting_order_counts)
                    },
                    {
                        name: "租赁中订单",
                        nums: JSON.parse(data.new_renting_order_counts)
                    },
                    {
                        name: "累计耳机订单",
                        nums: JSON.parse(data.goods_orders)
                    }
                ]
            }
            var legendArr = [], seriesArr = [];
            data.lists.forEach(function (a, i) {
                legendArr.push(a.name);
                var obj = {
                    type: 'line',
                    name: a.name,
                    smooth: true,
                    symbol: 'none',
                    lineStyle: {
                        width: 4
                    },
                    markPoint: {
                        symbol: 'circle',
                        symbolSize: 10,
                        data: [{
                            coord: [a.nums.length - 1, a.nums.slice(a.nums.length - 1)]
                        }]
                    },
                    data: a.nums
                }
                seriesArr.push(obj)
            });
            vm.chart5.setOption({
                legend: {
                    data: legendArr
                },
                xAxis: {
                    data: data.times
                },
                series: seriesArr
            });
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
        },
        // 海博馆创收建设数据-更新数据
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
        },
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
        },
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
        },
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
        },
        // 今日影院预约人数-更新数据
        updateChart8: function (data) {
            var vm = this;
        },
        // 自助租赁柜使用情况
        chooseCabinet: function (i) {
            var vm = this;
            vm.cabinet_i = i;
        },
        // 获取自助导览机使用数量
        guidData: function () {
            var vm = this;
            $.ajax({
                type: 'get',
                data: {
                    p: "ter"
                },
                url: localStorage.getItem("basezulin") + "/api/haiyang/data_show",
                success: function (rlt) {
                    vm.guidUseData = rlt.data;
                    vm.cabinet_list = [];
                    let arr = vm.cabinet_list_init
                    let arr2 = rlt.data.cabinet_list;
                    for (let i = 0; i < arr.length; i++) {
                        for (let j = 0; j < arr2.length; j++) {
                            if (arr[i].cabinet_num == arr2[j].cabinet_num) {
                                vm.cabinet_list.push(arr2[j])
                                break;
                            }
                        }
                    }
                    vm.initChart1Data[0].value = rlt.data.sum_order_num
                    vm.wxData();
                    vm.updateChart5(rlt.data.time_order_count)
                },
                error: function (err) {
                    console.log(err)
                }
            });
        },
        // 获取微信导览使用数量
        wxData: function () {
            var vm = this;
            $.ajax({
                type: 'get',
                data: {
                    p: "w"
                },
                dataType: 'json',
                headers: {'Accept': 'application/json'},
                url: localStorage.getItem("baseweb") + "/api/wxdl_stat",
                success: function (rlt) {
                    vm.initChart1Data[1].value = rlt.data.total
                    vm.initChart1();
                },
                error: function (err) {
                    console.log(err)
                }
            });
        },
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
        },
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
        },
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
        }
    }
});		