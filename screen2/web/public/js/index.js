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
		hallrangeTotal: 0
	},
	created: function () {
		var vm = this;
	},
	mounted: function () {
		var vm = this;
		vm.chart1 = echarts.init(document.querySelector("#chart1"));
		vm.chart2 = echarts.init(document.querySelector("#chart2"));
		vm.chart3 = echarts.init(document.querySelector("#chart3"));
		vm.chart7 = echarts.init(document.querySelector("#chart7"));
		// 左侧3个图表：观众预约总数、进馆参观总数、证件类型
		vm.initChart1();
		vm.initChart2();
		vm.initChart3();
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
					0.15: "rgb(0,0,255)",
					0.5: "rgb(0,255,0)",
					0.85: "rgb(255,255,0)",
					1.0: "rgb(255,0,0)"
				}
			});
		})
		vm.getScreeByDay();
		vm.getVisitList();
		vm.getProbe();
		vm.getProbeFbt();
		vm.getCurrentProbePersons();
		vm.getHotProbePersons();
		vm.getHotExhibits();
		// 定时执行
		setInterval(function(){
		 	vm.getVisitList();
		 	vm.getProbe();
		 	vm.getProbeFbt();
		 	vm.getCurrentProbePersons();
		 	vm.getHotProbePersons();
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
				this.getScreeByDay()
			}else{
				this.getVisitList()
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
		//单日大屏统计数据---获取观众预约(检票，证件类型)总数
		getScreeByDay: function () {
			var vm = this;
			$.ajax({
				type: 'get',
				data: {
					p: "w",
					yy_t_date_range: vm.getTimeQuantum()
				},
				url: localStorage.getItem("baseticket") + "/api/stat/b_screen_by_day",
				success: function (rlt) {
					var arr = rlt.data.yy_stat;
					var reservationNumber = { dates: [], values: [] };
					var tickeNumber = { dates: [], values: [] };
//					for (var i = 0; i < arr.length; i++) {
//						reservationNumber.dates.push(arr[i].name)
//						reservationNumber.values.push(arr[i].yy_value)
//						tickeNumber.dates.push(arr[i].name)
//						tickeNumber.values.push(arr[i].ck_value)
//					}
					/* 修改 */
					var d = new Date();
					for (var a of arr) {
						if(d.getHours()<Number(a.name.split(":")[0])){
							break
						}
						vm.yy_value_total = +vm.yy_value_total+a.yy_value
						vm.ck_value_total = +vm.ck_value_total+a.ck_value
						reservationNumber.dates.push(a.name)
						reservationNumber.values.push(a.yy_value)
						tickeNumber.dates.push(a.name)
						tickeNumber.values.push(a.ck_value)
					}
					/* 修改 */
					vm.updateChart1(reservationNumber);
					vm.updateChart2(tickeNumber);
				},
				error: function (err) {
					console.log(err)
				}
			});
		},
		//获取观众预约(检票，证件类型)总数
		getVisitList: function () {
			var vm = this;
			$.ajax({
				type: 'get',
				data: {
					p: "w",
					yy_t_date_range: vm.getTimeQuantum()
				},
				url: localStorage.getItem("baseticket") + "/api/stat/b_screen",
				success: function (rlt) {
					var arr = rlt.data.people_line;
					var arr3 = rlt.data.cardtype_stat;
					var cardtypeData = [arr3[0]];
					var rest = { name: '其他', value: 0 }
					for (let k = 1; k < arr3.length; k++) {
						rest.value += arr3[k].value;
					}
					cardtypeData.push(rest);
					var reservationNumber = { dates: [], values: [] };
					var tickeNumber = { dates: [], values: [] };
					for (var i = 0; i < arr.length; i++) {
						vm.yy_value_total = +vm.yy_value_total+arr[i].value
						vm.ck_value_total = +vm.yy_value_total+arr[i].value_ck
						reservationNumber.dates.push(arr[i].name)
						reservationNumber.values.push(arr[i].value)
						tickeNumber.dates.push(arr[i].name)
						tickeNumber.values.push(arr[i].value_ck)
					}
					if (vm.navi==0) {
						vm.updateChart3(cardtypeData);
					} else {
						vm.updateChart1(reservationNumber);
						vm.updateChart2(tickeNumber);
						vm.updateChart3(cardtypeData);
					}
				},
				error: function (err) {
					console.log(err)
				}
			});
		},
		//数据可视化探针-楼层时刻环比
		getProbe: function () {
			var vm = this;
			$.ajax({
				type: 'get',
				data: {
					p: "w"
				},
				url: localStorage.getItem("baseweb") + "/api/datas_probe_hb",
				success: function (rlt) {
					vm.map1 = rlt.data[0];
					vm.map2 = rlt.data[1];
					vm.map3 = rlt.data[2];
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
				url: localStorage.getItem("baseweb") + "/api/datas_probe_fbt",
				success: function (rlt) {
					var data = rlt.data;
					vm.renderHeatmap(data);
				},
				error: function (err) {
					console.log(err)
				}
			});
		},
		//数据可视化探针-楼层时刻环比
		getCurrentProbePersons: function () {
			var vm = this;
			$.ajax({
				type: 'get',
				data: {
					p: "w"
				},
				url: localStorage.getItem("baseweb") + "/api/datas_probe_current_persons",
				success: function (rlt) {
					var data = rlt.data;
					vm.getHallnum(data);
				},
				error: function (err) {
					console.log(err)
				}
			});
		},
		//数据可视化探针-热门展厅排行
		getHotProbePersons: function () {
			var vm = this;
			$.ajax({
				type: 'get',
				data: {
					p: "w"
				},
				url: localStorage.getItem("baseweb") + "/api/datas_probe_hot_exhibition",
				success: function (rlt) {
					var data = rlt.data;
					vm.getHallrange(data);
				},
				error: function (err) {
					console.log(err)
				}
			});
		},
		//获取热门展品
		getHotExhibits: function () {
			var vm = this;
			$.ajax({
				type: 'get',
				data: {
					p: "w"
				},
				url: localStorage.getItem("baseweb") + "/api/expert/exhibit",
				success: function (rlt) {
					var data = rlt.data;
					vm.updateChart7(data)
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
						fontSize: 12*2,
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
						fontSize: 12*2,
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
			vm.chart1.setOption(option);
		},
		// 观众预约总数-更新数据
		updateChart1: function (data) {
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
						fontSize: 12*2,
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
						fontSize: 12*2,
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
//			 data = {
//			 	dates: ['2019-03-12','2019-03-13','2019-03-14','2019-03-15','2019-03-16','2019-03-17','2019-03-18'],
//			 	values: [830, 924, 1921, 924, 1230, 1220, 1102]
//			 }
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
		// 预约证件类型-图表初始化
		initChart3: function () {
			var vm = this;
			var option = {
				series: [
					{
						name: '预约证件类型',
						type: 'pie',
						radius: ["25%", "70%"],
						center: ["50%", "50%"],
						avoidLabelOverlap: false,
						// roseType: 'radius',
						label: {
							normal: {
								show: true,
								position: 'outside',
								fontSize: 30
							},
							emphasis: {
								show: true
							}
						},
						labelLine: {
							normal: {
								show: true
							}
						},
						data: []
					}
				]
			};
			vm.chart3.setOption(option);
		},
		// 预约证件类型-更新数据
		updateChart3: function (data) {
			var vm = this;
			// var colors = ['#37a2da', '#32c5e9', '#9fe6b8', '#ffdb5c', '#ff9f7f', '#fb7293', '#e7bcf3'];
			var colors = ['#37a2da', '#fb7293'];
			var total = 0;
			data.forEach(function (a) {
				total += a.value
			});
			total <= 0 ? total = 1 : '';
			var dataArr = [];
			data.forEach(function (a, i) {
				var obj = {
					name: a.name,
					value: a.value,
					label: {
						formatter: function (val) {
							var perc = parseInt(val.value) / total * 100
							return val.name + " " + perc.toFixed(2) + "%"
						}
					},
					itemStyle: {
						normal: {
							color: colors[i % colors.length]
						}
					}
				}
				dataArr.push(obj)
			})
			vm.chart3.setOption({
				series: [
					{
						data: dataArr
					}
				]
			});
		},
		// 热力图数据渲染
		renderHeatmap: function (data) {
			var vm = this;
			var scale = document.querySelector("#chart4_1").clientWidth / 1400;
			// data = [
			// 	[
			// 		{
			// 			x: 750,
			// 			y: 150,
			// 			value: 150
			// 		},
			// 		{
			// 			x: 850,
			// 			y: 270,
			// 			value: 125
			// 		},
			// 		{
			// 			x: 500,
			// 			y: 550,
			// 			value: 175
			// 		}
			// 	],
			// 	[
			// 		{
			// 			x: 127,
			// 			y: 140,
			// 			value: 80
			// 		}
			// 	],
			// 	[
			// 		{
			// 			x: 500,
			// 			y: 550,
			// 			value: 36
			// 		}
			// 	]
			// ];
			data.forEach(function (a, i) {
				var tem = a;
				if (tem.length > 1) {
					tem.sort(function (a, b) {
						return b.value - a.value;
					});
				}
				tem.forEach(function (b) {
					b.x = parseInt(b.x * scale);
					b.y = parseInt(b.y * scale);
				});
				// 取最大值作为参考阈值
				var max = Math.ceil(tem[0].value * 1.3) > 10 ? Math.ceil(tem[0].value * 1.3) : 10;
				vm.heatmap[i].map.setData({
					min: 1,
					max: max,
					data: tem
				});
			});
		},
		// 当前展厅人数-获取数据
		getHallnum: function (data) {
			var vm = this;
			// data = vm.hallnumlist;
			vm.renderHallnum(data);
		},
		// 当前展厅人数-渲染数据
		renderHallnum: function (data) {
			var vm = this;
			data = data.sort(function (a, b) {
				return b.counts - a.counts;
			}).slice(0, 5);
			vm.hallnumlist = data;
			vm.hallnumTotal = 0;
			vm.hallnumlist.forEach(function (a, i) {
				vm.hallnumTotal += a.counts
			})
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
				return b.counts - a.counts;
			}).slice(0, 6);
			vm.hallrangelist = data;
			vm.hallrangeTotal = 0;
			vm.hallrangelist.forEach(function (a, i) {
				vm.hallrangeTotal += a.counts
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
					bottom: '10%',
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
						fontSize: 12*2,
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
					barWidth: 16*2,
					label: {
						show: true,
						position: 'top',
						fontSize: 12*2,
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
							a: { fontSize: 14*2,color: colors[0] },
							b: { fontSize: 14*2,color: colors[1] },
							c: { fontSize: 14*2,color: colors[2] },
							d: { fontSize: 14*2,color: colors[3] }
						}
					},
					itemStyle: {
						barBorderRadius: 8*2,
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
			data = data.sort(function (a, b) {
				return b.total - a.total
			}).slice(0, 7);
			data.forEach(function (a, i) {
				xArr.push(a.exhibit_name);
				dataArrstack.push(data[0].total * 0.05)
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
					value: a.total,
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

