var VM = new Vue({
	el: "#main",
	data: {
		newdate:"获取中....",
		name: '甘肃科技馆指挥中心信息管理平台',
        tmp: 0,//温度
		qlty: '获取中...',//空气质量
		cond_txt: '获取中...',
		cond_code: '100',
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
		navi: 0,
		timeQuantum: '',
		chart1: null,
		yy_value_total:'',
		ck_value_total:'',
		chart1: null,
		chart2: null,
		chart3: null,
		chart4: null,
		scale: 2,
		hallnumlist: [],
		hallnumTotal: 0,
		hallrangelist: [],
		hallrangeTotal: 0,
		today:'',
		todayOrderFilm:0,//今日预约总数
		moviesList:[],//电影列表
		showMovies:[],
		baseValue: 0,
		member:0,//会员人数
		volunteer:0,//志愿者
		baseweb: "http://192.168.10.158:8316"

	},
	created: function () {
		var vm = this;
	},
	mounted: function () {
		var vm = this;
		vm.chart1 = echarts.init(document.querySelector("#chart1"));
		vm.chart2 = echarts.init(document.querySelector("#chart2"));
		vm.chart3 = echarts.init(document.querySelector("#chart3"));
		vm.chart4 = echarts.init(document.querySelector("#chart4"));
		
		vm.initChart1();
		vm.initChart2();
		vm.initChart3();
		vm.initChart4();
		
		vm.setWeather();
        vm.air();
		vm.getCurrentData();
		
		// vm.getProbeFbt();
		// vm.getHotExhibits();
		// 定时执行
		setInterval(function(){
			vm.getCurrentData();
			
		 	// vm.getProbeFbt();
		 	// vm.getHotExhibits();
		},60000)
		setInterval(function(){
			vm.navi = vm.navi<3?++vm.navi:0
		},15000)
		setInterval(function () {
            var date = new Date();
            vm.newdate = date.toLocaleString('chinese', {hour12: false});
        }, 1000);
		//获取日期
		var date = new Date();
		vm.today = date.format('yyyy年MM月dd日');
		
		//循环电影列表
		var n=4;
		var start=0;
		var end= start + n;
		setInterval(function () {
			if(vm.moviesList.length>0){
				vm.showMovies=vm.moviesList.slice(start,end)
				start += n;
				end += n;
			}
			if(start>vm.moviesList.length){
				 start=0;
				 end= start + n;
			}
		},5000);
	},
	watch: {
		navi: function (n, o) {
			//因为是定时轮询需要重置
			this.yy_value_total='';
			this.ck_value_total='';
			if(n==0){
				//this.getScreeByDay()
			}else{
				// this.getVisitList()
				// this.getReservationSevenDay();
			}
		}
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
		//获取时间段
		getTimeQuantum: function () {
			var mun = 1
			switch (this.navi) {
				case 0:
					num = 1
					break;
				case 1:
					num = 7
					break;
				case 2:
					num = 30
					break;
				case 3:
					num = 365
					break;
				default:
					num = 1
			}
			var n = new Date().getTime();
			var n2 = n - num * 86400000
			var n3 = num <= 1 ? n : n2
			var date = new Date();
			var d = date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
			var m = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)
			var y = date.getFullYear();
			var date2 = new Date(n3);
			var d2 = date2.getDate() < 10 ? "0" + date2.getDate() : date2.getDate()
			var m2 = (date2.getMonth() + 1) < 10 ? "0" + (date2.getMonth() + 1) : (date2.getMonth() + 1)
			var y2 = date2.getFullYear();
			return y2 + "-" + m2 + "-" + d2 + " - " + y + "-" + m + "-" + d
		},
		//获取统计数据
		getCurrentData: function(){
			var vm = this;
			$.ajax({
				type: 'get',
				data: {
					//p: "t",
					//yy_t_date_range: vm.getTimeQuantum()
				},
				url: 'http://192.168.10.158:18895/api/stat/stat?p=w',
				success: function (rlt) {
					var arr = rlt.data;
					console.log('统计数据',arr)
					vm.updateChart1(arr.cinema_stat)

					vm.todayOrderFilm = arr.today_order_film;	
					vm.updateChart2(arr.seven_film_stat);
					
					vm.moviesList = arr.movie_list;
					vm.renderMoviesList(vm.moviesList);
				},
				error: function (err) {
					console.log(err)
				}
			});
		},

		// 观众预约总数-图表初始化
		initChart1: function () {
			var vm = this;
            var option = {
                color: ['#FF00FC', '#1A42F2', '#7E32F7'],
                series: [
                    {
                        type: 'pie',
						hoverAnimation: false,
						selectedMode:false,
						startAngle: 120,
                        center: ['50%', '50%'],
                        radius: ['36%', '48%'],
                        label: {
                            color: '#fff'
                        },
                        clockwise: true,
                        labelLine: {
                            show: false,
                        },
                        itemStyle: {
                            borderWidth: 2 
                        },
                        data: []
                    }
                ]
            };
			vm.chart1.setOption(option);
		},
		updateChart1: function (data) {
            var vm = this;
            var colors = ['#FF00FC', '#1A42F2', '#7E32F7'];
            var itemStylePlaceHolder = {
                normal: {
                    color: 'rgba(0,0,0,0)',
                    borderColor: 'rgba(0,0,0,0)',
                    borderWidth: 1
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
							return "{d|" + Math.round(a.value / total * 10000) / 100 + "%}" + " \n{b|" + a.name + "} {c|"+a.value+" 人}"
						},
						fontSize: 17,
                        rich: {
                            b: {
								fontSize: 17,
                                color: colors[i]
                            }
                        }
                    },
                    itemStyle: {
						borderColor: colors[i],
						borderWidth:2
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
            vm.chart1.setOption({
                series: [{
                    data: dataArr
                }]
            });
            //vm.chart1.hideLoading();
        },
		// 今日影院预约人数-图表初始化
		initChart2: function () {
			var vm = this;
			var option = {
				title: {
					text: '七日上座率',
					textStyle: {
						fontSize: 14,
						color: '#B6BDDA'
					}
				},
				grid: {
					top: 35,
					bottom: 25,
					left: 40,
					right: '5%'
				},
				xAxis: {
					type: 'category',
					axisLabel: {
						color: '#fff'
					},
					splitLine: { show: false },
					axisLine: { show: false },
					axisTick: { show: false },
					data: []
				},
				yAxis: {
					type: 'value',
					splitNumber: 2,
					axisLabel: {
						color: '#fff',
						formatter: function (val) {
							return val + "%"
						}
					},
					splitLine: { show: false },
					axisLine: { show: false },
					axisTick: { show: false }
				},
				series: [{
					type: 'bar',
					barWidth: 15,
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
			vm.chart2.setOption(option);
			//vm.updateChart2();
		},
		// 观众进馆参观总数-更新数据
		updateChart2: function (data) {
			var vm = this;
			var xArr = [], dataArr = [];
			
			data.forEach(function (a, i) {
				xArr.unshift(Number(a.t_date.split('-')[1]) + "/" + Number(a.t_date.split('-')[2]));
				a.percentage = a.percentage > 100 ? 100 : a.percentage;
				dataArr.unshift(a.percentage);
			});
			vm.chart2.setOption({
				xAxis: {
					data: xArr
				},
				series: [{
					data: dataArr
				}]
			});
		},
		initChart3: function () {
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
						show: false
					},
					axisLabel: {
						show: true,
						interval: 'auto',
						fontSize: 10,
						color: '#808080',
						// formatter: function (val) {
						// 	if (vm.navi == 0) {
						// 		return val
						// 	}else{
						// 		var arr = val.split('-');
						// 		return arr[1] + '/' + arr[2]
						// 	}
						// }
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
						fontSize: 12,
						color: '#808080'
					}
				},
				series: [{
					type: 'line',
					name: 'number',
					smooth: true,
					lineStyle: {
						width: 2,
						color: '#1DBC9D'
					},
					itemStyle: {
						color: '#1DBC9D',
						borderWidth: 2,
						borderColor: '#1DBC9D',
						opacity: 0
					},
					areaStyle: {
						color: {
							type: 'linear',
							x: 0,
							y: 0,
							x2: 1,
							y2: 0,
							colorStops: [{
								offset: 0, color: 'rgba(29,188,157,0.1)' // 0% 处的颜色
							}, {
								offset: 0.3, color: 'rgba(29,188,157,0.5)' // 30% 处的颜色
							}, {
								offset: 1, color: 'rgba(29,188,157,0.8)' // 100% 处的颜色
							}]
						}
					},
					data: []
				}]
			}
			vm.chart3.setOption(option);
		},
		// 观众进馆参观总数-更新数据
		updateChart3: function (data) {
			var vm = this;
			// data = {
			// 	dates: ['2019-03-12','2019-03-13','2019-03-14','2019-03-15','2019-03-16','2019-03-17','2019-03-18'],
			// 	values: [830, 924, 1921, 924, 1230, 1220, 1102]
			// }
			vm.chart2.setOption({
				xAxis: {
					data: data.dates
				},
				series: [{
					name: 'number',
					markPoint: {
						symbol: 'circle',
						symbolSize: 15,
						itemStyle: {
							color: '#1DBC9D'
						},
						data: [{
							name: '昨天',
							coord: [data.values.length-1, data.values[data.values.length-1]]
						}]
					},
					data: data.values
				}]
			})
		},
		// 热门电影排行-渲染数据
		renderMoviesList: function (data) {
			var vm = this;
			vm.hallrangelist = data;
			vm.baseValue = 0;
			vm.hallrangelist.forEach(function (a, i) {
				if( vm.baseValue < a.value){
					vm.baseValue = a.value
				}
			})
		},
		// 热门电影排行-计算百分比
		compMoviesListRangePerc: function (val) {
			var vm = this;
			vm.baseValue <= 0 ? vm.baseValue = 1 : '';
			var perc = Math.round((val / vm.baseValue) * 100) + "%"
			return perc
		},
		// 故障原因统计占比-雷达图初始化
		initChart3: function (data) {
			var vm = this;
			var option = {
				tooltip: {},
				radar: {
					name: {
						textStyle: {
							color: '#fff',
							fontSize:14
					   }
					},
					axisLine:{
						show:false
					},
					splitLine:{
						lineStyle:{
							color:'#556FB5'
						}
					},
					splitArea:{
						show:false
					},
					indicator: [
					   { name: '销超负荷使用', max: 100},
					   { name: '异常操作', max: 100},
					   { name: '设计上潜在不良因素', max: 100},
					   { name: '非法改变其功能', max: 100},
					   { name: '磨损老化', max: 100}
					]
				},
				series: [{
					//name: '预算 vs 开销（Budget vs spending）',
					type: 'radar',
					lineStyle:{
						color: '#E4007F',
					},
					areaStyle: {
						color: '#E4007F',
						opacity:0.3
					},
					data : [
						{
							value : [10, 100, 28, 35, 50, 19],
						}
					]
				}]
			};
			vm.chart3.setOption(option);
		},
		// 故障原因统计占比-更新数据
		updateChart3: function (data) {
			var vm = this;
			var colors = ['#30D5ED', '#7349D0', '#CBCDCD', '#6B6B6B'];
			var xArr = [], dataArr = [], dataArrstack = [];
			data.forEach(function (a, i) {
				xArr.push(a.exhibit_name);
				dataArrstack.push(data.length * 0.05)
				var color;
				if (i < 3) {
					color = {
						type: 'linear',
						x: 0,
						y: 0,
						x2: 1,
						y2: 0,
						colorStops: [{
							offset: 0, color: colors[0] // 0% 处的颜色
						}, {
							offset: 1, color: colors[1] // 100% 处的颜色
						}]
					}
				} else if (i == 3) {
					color = colors[2]
				} else if (i > 3) {
					color = colors[3]
				}
				var obj = {
					value: a.look_num,
					itemStyle: {
						color: color
					}
				}
				dataArr.push(obj);
			});
			vm.chart4.setOption({
				xAxis: {
					data: xArr
				},
				series: [{
					name: '底部堆叠空格',
					data: dataArrstack
				}, {
					name: '热门展品',
					data: dataArr
				}]
			});
		},
		// 展项运行状态:
		initChart4:function () {
			var vm = this;
			var option = {
				series: [
					{
						name: '业务指标',
						type: 'gauge',
						radius:'95%',
						title : {               //设置仪表盘中间显示文字样式
							textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
								fontWeight: 'bolder',
								fontSize: 16,
								color:"#fff"
							}
						},
						axisLine:{
							lineStyle: {       // 属性lineStyle控制线条样式
								width: 15,
								shadowBlur: 10
							}
						},
						splitLine: {           // 分隔线
							length :15,         // 属性length控制线长	
						},
						detail: {formatter:'{value}个'},
						data: [{value: 5, name: '异常报警数量'}]
					}
				]
			};
			vm.chart4.setOption(option);	
		}
	}
});

