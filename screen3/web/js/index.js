var VM = new Vue({
	el: "#main",
	data: {
		navi: 0,
		timeQuantum: '',
		chart1: null,
		yy_value_total:'',
		ck_value_total:'',
		chart2: null,
		chart3: null,
		//		chart4: null,
		//		chart5: null,
		//		chart6: null,
		chart7: null,
		heatmap: [
			{ map: null },
			{ map: null },
			{ map: null }
		],
		map1: '',
		map2: '',
		map3: '',
		hallnumlist: [],
		hallnumTotal: 0,
		hallrangelist: [],
		hallrangeTotal: 0,
		baseweb: "http://192.168.10.158:8316"
	},
	created: function () {
		var vm = this;
	},
	mounted: function () {
		var vm = this;
		vm.chart1 = echarts.init(document.querySelector("#chart1"));
		vm.chart2 = echarts.init(document.querySelector("#chart2"));
		//vm.chart3 = echarts.init(document.querySelector("#chart3"));
		vm.chart7 = echarts.init(document.querySelector("#chart7"));
		// 左侧3个图表：观众预约总数、进馆参观总数、证件类型
		vm.initChart1();
		vm.initChart2();
		//vm.initChart3();
		vm.initChart7();
		// 热力图
		vm.heatmap.forEach(function (a, i) {
			var heatmapDom = document.querySelector('#chart4_' + (i + 1));
			var scale = heatmapDom.clientWidth / 1400;
			a.map = hmap.create({
				container: heatmapDom,
				radius: 80 * scale,
				blur: .75,
				maxOpacity: 1,
				gradient: {
					0.15: "rgb(100,162,5)",
					0.5: "rgb(0,255,0)",
					0.85: "rgb(255,255,0)",
					1.0: "rgb(255,0,0)"
				}
			});
		})
		
		vm.getVisitList();
		vm.getReservationSevenDay();
		vm.getProbeFbt();
		vm.getHotExhibits();
		// 定时执行
		setInterval(function(){
			 vm.getVisitList();
			 vm.getReservationSevenDay();
		 
		 	vm.getProbeFbt();
		 	vm.getHotExhibits();
		},60000)
		setInterval(function(){
			vm.navi = vm.navi<3?++vm.navi:0
		},15000)
	},
	watch: {
		navi: function (n, o) {
			//因为是定时轮询需要重置
			this.yy_value_total='';
			this.ck_value_total='';
			if(n==0){
				//this.getScreeByDay()
			}else{
				this.getVisitList()
				this.getReservationSevenDay();
			}
		}
	},
	methods: {
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
		// 切换时间段
		changeNav: function (i) {
			this.navi = i;
		},
		//获取观众在管人数
		getVisitList: function () {
			var vm = this;
			$.ajax({
				type: 'get',
				data: {
					//p: "t",
					//yy_t_date_range: vm.getTimeQuantum()
				},
				url: 'http://keliu.gsstm.org/api/time_flow?p=t',
				success: function (rlt) {
					
					var arr = rlt.data.time_flow;
					var reservationNumber = { dates: [], values: [] };
					vm.ck_value_total = rlt.data.total_stay_num;
					for(var j in arr ){
						//arrList.push(arr[j]);
						reservationNumber.dates.push(j)
						reservationNumber.values.push(arr[j])
					}	
					console.log('获取在场观众人数',reservationNumber)
					if (vm.navi==0) {
						//vm.updateChart3(cardtypeData);
					} else {
						vm.updateChart2(reservationNumber);
					}
				},
				error: function (err) {
					console.log(err)
				}
			});
		},
		//最近7天预约人数
		getReservationSevenDay: function(){
			var vm = this;
			$.ajax({
				type: 'get',
				data: {
					//p: "t",
					//yy_t_date_range: vm.getTimeQuantum()
				},
				url: 'http://192.168.10.158:18895/api/stat/stat?p=w',
				success: function (rlt) {
					
					var arr = rlt.data.seven_order_stat;
					var resSevenDay = { dates: [], yyValues: [], reValues:[]};
					for (var i = 6; i >=0 ; i--) {
						
						resSevenDay.dates.push(arr[i].t_date)
						resSevenDay.yyValues.push(arr[i].yy_count)
						resSevenDay.reValues.push(arr[i].re_count)
					}
					if (vm.navi==0) {
						//vm.updateChart3(cardtypeData);
					} else {
						console.log('最近7天预约',resSevenDay)
						vm.updateChart1(resSevenDay);
					}
				},
				error: function (err) {
					console.log(err)
				}
			});
		},
		// 热力图热力位置
		getProbeFbt: function () {
			var vm = this;
			$.ajax({
				type: 'get',
				data: {
					p: "w"
				},
				url: "http://keliu.gsstm.org/api/keliu_combine?p=t",
				success: function (rlt) {
					console.log('热力图数据',rlt);
					var data = rlt.data;
					vm.renderHeatmap(data);
				},
				error: function (err) {
					console.log(err)
				}
			});
		},

		//获取热门展品&热门展厅
		getHotExhibits: function () {
			var vm = this;
			$.ajax({
				type: 'get',
				data: {
					p: "w"
				},
				url: this.baseweb + "/api/big_stat",
				success: function (rlt) {
					var data = rlt.data;
					var exhibit = data.exhibit;
					var exhibition = data.exhibition;
					console.log('获取热门展品&热门展厅:',data)
					vm.updateChart7(exhibit);
					vm.getHallrange(exhibition);
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
				color:['#7F55C4','#DB5D09'],
				grid: {
					top: 60,
					bottom: 30,
					left: '15%',
					right: 30
				},
				legend: {
					icon: 'circle',
					textStyle:{
						color:'#ffffff',
						fontSize: 10,
					},
					orient: 'vertical',
					
					right:'20%',
					selectedMode:false,
					data: ['预约人数','进馆人数']
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
							color: ['rgba(150,108,247,0.5)']
						}
					},
					axisLabel: {
						show: true,
						interval: 'auto',
						fontSize: 10,
						color: '#808080',
						formatter: function (val) {
							if (vm.navi == 0) {
								return val
							}else{
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
					name:'人数',
					nameTextStyle:{
						color:'#ffffff'
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
						showMinLabel: false,
						fontSize: 12,
						color: '#808080'
					}
				},
				series: [{
					type: 'line',
					name: '进馆人数',
					lineStyle: {
						width: 3,
						color: {
							type: 'linear',
							x: 0,
							y: 0,
							x2: 0,
							y2: 1,
							colorStops: [{
								offset: 0, color: '#7349D0' // 0% 处的颜色
							}, {
								offset: 1, color: '#1A7FD6' // 100% 处的颜色
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
				},{
					type: 'line',
					name: '预约人数',
					lineStyle: {
						width: 3,
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
				}
			]
			}
			vm.chart1.setOption(option);
		},
		// 观众预约总数-更新数据
		updateChart1: async function (data) {
			var vm = this;
			vm.chart1.setOption({
				xAxis: {
					data: data.dates
				},
				series: [{
					name: '预约人数',
					data: data.yyValues
				},{
					name:'进馆人数',
					data: data.reValues
				}]
			})
		},
		// 观众进馆参观总数-图表初始化
		initChart2: function () {
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
			vm.chart2.setOption(option);
		},
		// 观众进馆参观总数-更新数据
		updateChart2: function (data) {
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
		// 热力图数据渲染
		renderHeatmap: function (data) {
			var vm = this;
			var scale = document.querySelector("#chart4_1").clientWidth / 1400;
			var list = [
				[
					
					{
						title: "甘肃科技展厅",
						x: 1120,
						y: 410,
						value: 0
					},
					{
						title: "科技馆展厅",
						x: 830,
						y: 380,
						value: 0
					},
					{
						title: "泡芙宝展厅",
						x: 700,
						y: 460,
						value: 0
					},
					{
						title: "像素世界展厅",
						x: 820,
						y: 560,
						value: 0
					},
					{
						title: "临时展厅",
						x: 560,
						y: 200,
						value: 0
					},
					{
						title: "预约门票取票处",
						x: 440,
						y: 290,
						value: 0
					}
				],
				[
					{
						title: "科技生活展厅",
						x: 1050,
						y: 360,
						value: 0
					},
					{
						title: "书吧",
						x: 720,
						y: 540,
						value: 0
					}
				],
				[
					{
						title: "宇宙探索展厅",
						x: 1060,
						y: 400,
						value: 0
					},
					{
						title: "探索发现B展厅",
						x: 690,
						y: 360,
						value: 0
					},
					{
						title: "探索发现A展厅",
						x: 700,
						y: 560,
						value: 0
					}
				]
			];
			data.forEach(function (a, i) {
				var tem = a.exhibition_list;
				list[i].forEach(function(b){
					tem.forEach(function (c) {
						if(c.title === b.title){
							delete b.title;
							b.value = c.value;
							b.x = parseInt(b.x * scale);
							b.y = parseInt(b.y * scale);
						}
					});
					
				});
				
				// 取最大值作为参考阈值
				vm.heatmap[i].map.setData({
					min: 0,
					max: 4,
					data: list[i]
				});
			});
			console.log(list);
			
		},
		// 当前展厅人数-计算百分比
		comphallnumPerc: function (val) {
			var vm = this;
			vm.hallnumTotal <= 0 ? vm.hallnumTotal = 1 : '';
			var perc = Math.round(val / vm.hallnumTotal*10000)/100 + "%"
			return perc
		},
		// 热门展厅排行-获取数据
		getHallrange: function (data) {
			var vm = this;
			// data = vm.hallrangelist;
			vm.renderHallrange(data);
		},
		// 热门展厅排行-渲染数据
		renderHallrange: function (data) {
			var vm = this;
			data = data.sort(function (a, b) {
				return b.see_num - a.see_num;
			}).slice(0, 6);
			vm.hallrangelist = data;
			vm.hallrangeTotal = 0;
			vm.hallrangelist.forEach(function (a, i) {
				vm.hallrangeTotal += a.see_num
			})
		},
		// 热门展厅排行-计算百分比
		comphallrangePerc: function (val) {
			var vm = this;
			vm.hallrangeTotal <= 0 ? vm.hallrangeTotal = 1 : '';
			var perc = Math.round((val / vm.hallrangeTotal) * 100) + "%"
			return perc
		},
		// 热门展品排行-图表初始化
		initChart7: function (data) {
			var vm = this;
			var colors = ['#30D5ED', '#7349D0', '#CBCDCD', '#6B6B6B'];
			var option = {
				grid: {
					top: 15,
					bottom: 40,
					left: 15,
					right: 15
				},
				xAxis: {
					type: 'category',
					offset: 0,
					axisLine: {
						show: true,
						lineStyle: {
							color: '#8F8F8F'
						}
					},
					axisTick: {
						show: false
					},
					axisLabel: {
						show: true,
						interval: 0,
						fontSize: 10,
						color: '#FFFFFF',
						formatter: function (val) {
							var str = val;
							if (str.length > 5) {
								str = str.slice(0, 5) + '…'
							}
							if (str.length > 3) {
								str = str.slice(0, 3) + '\n' + str.slice(3);
							}
							return str
						}
					},
					splitLine: {
						show: false
					},
					data: []
				},
				yAxis: {
					type: 'value',
					show: false
				},
				series: [{
					type: 'bar',
					name: '底部堆叠空格',
					stack: '相同堆叠标志',
					itemStyle: {
						color: 'rgba(0,0,0,0)'
					},
					data: []
				}, {
					type: 'bar',
					name: '热门展品',
					stack: '相同堆叠标志',
					barWidth: 16,
					label: {
						show: true,
						position: 'top',
						fontSize: 10,
						color: '#FFFFFF',
						formatter: function (val) {
							var str = "";
							if (val.dataIndex < 3) {
								str = '{a|' + val.value + '}'
							} else if (val.dataIndex == 3) {
								str = '{c|' + val.value + '}'
							} else if (val.dataIndex > 3) {
								str = '{d|' + val.value + '}'
							}
							return str
						},
						rich: {
							a: { color: colors[0] },
							b: { color: colors[1] },
							c: { color: colors[2] },
							d: { color: colors[3] }
						}
					},
					itemStyle: {
						barBorderRadius: 8,
						color: {
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
					},
					data: []
				}]
			};
			vm.chart7.setOption(option);
		},
		// 热门展品排行-更新数据
		updateChart7: function (data) {
			var vm = this;
			var colors = ['#30D5ED', '#7349D0', '#CBCDCD', '#6B6B6B'];
			var xArr = [], dataArr = [], dataArrstack = [];
			// data = data.sort(function (a, b) {
			// 	return b.total - a.total
			// }).slice(0, 7);
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
			vm.chart7.setOption({
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
	}
});

