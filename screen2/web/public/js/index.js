var baseUrl = "http://192.168.10.158:18895"
var VM = new Vue({
	el: "#main",
	data() {
		return{
			age: [],
			ageArr: [],
			rank: [],
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
		}
	},
	created: function () {
		var vm = this;
	},
	mounted: function () {
		this.getData();
		let vm = this;
		vm.setWeather();
		vm.air();
		setInterval(function () {
	      var date = new Date();
	      vm.newdate = date.toLocaleString('chinese', {hour12: false});
		}, 1000);
		setInterval(function () {
		vm.getData();
		}, 6000)
		setInterval(() => {
			vm.air();
				vm.setWeather();
			
		},60000)
	},
	methods: {
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
		getData() {
			var vm = this;
			$.ajax({
				type: 'get',
				data: {
					p: "w"
				},
				url: baseUrl + "/api/stat/stat",
				success: function (rlt) {
					var data = rlt.data;
					console.log(data);
				
					 var scaleData = [{
            'name': '女性',
            'value': data.sex[0].percentage
          },
          {
              'name': '男性',
              'value': data.sex[1].percentage
          },
        ];
					var color1 = ['#E90079', '#0A89EA'];
					vm.initCard(scaleData, color1, 'sex');
					 vm.age = data.age;
					
        let age5 = 100 - vm.age[0].percentage- vm.age[1].percentage - vm.age[2].percentage - vm.age[3].percentage;
        vm.ageArr = [];
        vm.ageArr=[{ name: '17岁以下', value: vm.age[0].percentage }, { name: '18-24', value: vm.age[1].percentage}, { name: '25-35', value: vm.age[2].percentage }, { name: '36-64', value: vm.age[3].percentage }, { name: '65岁及以上', value: age5 }];
					vm.initC("age", vm.ageArr);
					$("#dataNums").html('');
					var length = data.total.length;
        $("#dataNums").rollNum({
          deVal: data.total,
          digit: length, //设置显示11位数
          classname: "test" //设置样式名称
        });
					vm.initF(data.area, data.total);
					let area = rlt.data.area;
					vm.rank = area.splice(0, 10);
					setTimeout(() => {
						vm.rank.map((item, index) => {
							if (index <= 2) {
								console.log('rank_' + index);
									vm.initRank('rank_' + index, item.percentage,"#FF0F7A");
							} else {
								vm.initRank('rank_' + index, item.percentage,"#4A6FFF");
							}
						})
					},300)
				
				},
				error: function (err) {
					console.log(err)
				}
			});
		},
		initRank(id, value,color) {
      option = {
			    color: ['#283146'],
			    series: [{
			        name: 'Line 1',
			        type: 'pie',
			        clockWise: true,
			        radius: ['50%', '60%'],
			        itemStyle: {
			            normal: {
			                label: {
			                    show: false
			                },
			                labelLine: {
			                    show: false
			                }
			            }
			        },
			        hoverAnimation: false,
			        data: [{
			            value: value,
			            name: '已使用',
			            itemStyle: {
			                normal: {
			                    color: color
			                }
			            }
			        }, {
			            name: '未使用',
			            value: 100-value
			        }]
			    }]
			};
      var dom = document.getElementById(id);
      var myChart = echarts.init(dom);
      if (option && typeof option === "object") {
        myChart.clear();
        myChart.setOption(option, true);
      }
    },

		initC(id, data) {
       var dom = document.getElementById(id);
      var myChart = echarts.init(dom);
      myChart.clear();
      var titleArr = [], seriesArr = [];
       colors=[[ new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#F1AA3A'
                            }, {
                                offset: 1,
                                color: '#F7563E'
                            }]),'#4e4e4e'],[ new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#F1AA3A'
                            }, {
                                offset: 1,
                                color: '#F7563E'
                            }]),'#4e4e4e'],[ new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#F1AA3A'
                            }, {
                                offset: 1,
                                color: '#F7563E'
                            }]),'#4e4e4e'], [ new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#F1AA3A'
                            }, {
                                offset: 1,
                                color: '#F7563E'
                            }]),'#4e4e4e'],[ new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#F1AA3A'
                            }, {
                                offset: 1,
                                color: '#F7563E'
                            }]),'#4e4e4e']]
      data.forEach(function (item, index) {
        titleArr.push(
          {
            text: item.name,
            left: index * 20 + 10 + '%',
            top: '75%',
            textAlign: 'center',
            textStyle: {
              fontWeight: 'normal',
              fontSize: '18',
              color: '#fff',
              textAlign: 'center',
            },
          }
        );
        seriesArr.push(
          {
            name: item.name,
            type: 'pie',
            clockWise: true,
            radius: [40, 50],
            itemStyle: {
              normal: {
                color: colors[index][0],
                shadowColor: colors[index][0],
                shadowBlur: 0,
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                },
              }
            },
            hoverAnimation: false,
            center: [index * 20 + 10 + '%', '50%'],
            data: [{
              value: item.value,
              label: {
                normal: {
                  formatter: function (params) {
                    return Number(params.value).toFixed(2) + '%';
                  },
                  position: 'center',
                  show: true,
                  textStyle: {
                    fontSize: '18',
                    fontWeight: 'bold',
                    color: '#fff'
                  }
                }
              },
            }, {
              value: 100 - item.value,
              name: 'invisible',
              itemStyle: {
                normal: {
                  color: colors[index][1]
                },
                emphasis: {
                  color: colors[index][1]
                }
              }
            }]
          }
        )
      });
			option = {
        backgroundColor: "transparent",
        title:titleArr,
        series: seriesArr
      }
      if (option && typeof option === "object") {
        myChart.clear();
        myChart.setOption(option, true);
      }
		},
		// 观众来源来源
		initF(data,total) {
      var chinaGeoCoordMap = {
        '黑龙江': [127.9688, 45.368],
        '内蒙古': [110.3467, 41.4899],
        "吉林": [125.8154, 44.2584],
        '北京': [116.4551, 40.2539],
        "辽宁": [123.1238, 42.1216],
        "河北": [114.4995, 38.1006],
        "天津": [117.4219, 39.4189],
        "山西": [112.3352, 37.9413],
        "陕西": [109.1162, 34.2004],
        "甘肃": [103.5901, 36.3043],
        "宁夏": [106.3586, 38.1775],
        "青海": [101.4038, 36.8207],
        "新疆": [87.9236, 43.5883],
        "西藏": [91.11, 29.97],
        "四川": [103.9526, 30.7617],
        "重庆": [108.384366, 30.439702],
        "山东": [117.1582, 36.8701],
        "河南": [113.4668, 34.6234],
        "江苏": [118.8062, 31.9208],
        "安徽": [117.29, 32.0581],
        "湖北": [114.3896, 30.6628],
        "浙江": [119.5313, 29.8773],
        "福建": [119.4543, 25.9222],
        "江西": [116.0046, 28.6633],
        "湖南": [113.0823, 28.2568],
        "贵州": [106.6992, 26.7682],
        "云南": [102.9199, 25.4663],
        "广东": [113.12244, 23.009505],
        "广西": [108.479, 23.1152],
        "海南": [110.3893, 19.8516],
        '上海': [121.4648, 31.2891],
        '香港': [114.15, 22.15],
        '台湾':[121.50, 25.04]
      };
      var convertData = function (data) {
        var res = [];
        for(var i = 0; i < data[0].length; i++) {
         var dataItem = data[0][i];
          var fromCoord = chinaGeoCoordMap[dataItem.name];
          var toCoord = [103.5901, 36.3043];
          if(fromCoord && toCoord) {
            res.push([{
              coord: fromCoord,
              value: dataItem.value,
              name:dataItem.name
            }, {
              coord: toCoord,
            }]);
          }
        }
        return res;
	    };
	    var series = [];
      [['甘肃', [data]]].forEach(function (item, i) {
        series.push({
            type: 'lines',
            zlevel: 2,
            effect: {
                show: true,
                constantSpeed: 0,
                symbol: 'pin',
                symbolSize: 15,
                trailLength: 0,
            },
            lineStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0, color: '#58B3CC'
                    }, {
                        offset: 1, color: '#F58158'
                    }], false),
                width: 3,
                opacity: 0.5,
                curveness: 0.15
            }
        },
            data: convertData(item[1])
          }, {
            type: 'effectScatter',
            coordinateSystem: 'geo',
            zlevel: 2,
            rippleEffect: { //涟漪特效
              period: 2, //动画时间，值越小速度越快
              brushType: 'stroke', //波纹绘制方式 stroke, fill
              scale: 2 //波纹圆环最大限制，值越大波纹越大
            },
            label: {
              normal: {
                show: false,
                position: 'bottom', //显示位置
                color:'#fff',
                offset: [5, 0], //偏移设置
                formatter: function (params) {//圆环显示文字
                  return params.data.name
                },
                fontSize: 18
              },
              emphasis: {
                show: true
              }
            },
            symbol: 'circle',
            symbolSize: function(val) {
              return 5+ val[2] * 5; //圆环大小
            },
            itemStyle: {
              normal: {
                show: false,
                color: '#31ccff'
              }
            },
            data: item[1].map(function (dataItem) {
              return {
                name: dataItem[0].name,
                value: [chinaGeoCoordMap[dataItem[0].name]].concat([dataItem[0].value])
              };
            }),
          },
          //被攻击点
          {
            type: 'scatter',
            coordinateSystem: 'geo',
            zlevel: 2,
            rippleEffect: {
              period: 4,
              brushType: 'stroke',
              scale: 4
            },
            label: {
              normal: {
                show: true,
                position: 'right',
                //offset:[5, 0],
                color: '#31ccff',
                formatter: '{b}',
                textStyle: {
                  color: "#31ccff",
                  fontSize:18
                }
              },
              emphasis: {
                show: false,
                color: "#31ccff",
                fontSize:18,
              }
            },
            symbol: 'pin',
            symbolSize: 20,
            data: [{
              name: item[0],
              value: chinaGeoCoordMap[item[0]].concat([10]),
            }],
          }
        );
      });

      option = {
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(166, 200, 76, 0.82)',
          borderColor: '#FFFFCC',
          showDelay: 0,
          hideDelay: 0,
          enterable: true,
          transitionDuration: 0,
          extraCssText: 'z-index:100;font-size:48px;line-height:60px;border-radius:20px;',
          formatter: function(params, ticket, callback) {
            //根据业务自己拓展要显示的内容
            var res = "";
            // res = "<div style='padding:40px;border-radius:40px;color:#fff,font-size:48px!important'> <span style='color:#fff;font-size:48px'>" +params.data.name + "</span><br/>数据：" + params.data.value+'</div>';
            return res;
          }
        },
        backgroundColor:"transparent",
        visualMap: { //图例值控制
          min: 0,
          max: 10000,
          calculable: true,
          show: false,
          color: ['#f44336', '#fc9700', '#ffde00', '#ffde00', '#00eaff'],
          textStyle: {
            color: '#fff'
          }
        },
        geo: {
          map: 'china',
          roam: true,
					zoom: 1.22,
					scaleLimit: {
						min: 0.2,
						max: 5
					},
					top: '10%',
					left: '26%',
					center: [114.298572, 30.584355],
          label: {
            emphasis: {
              show: true,
              color: '#fff',
              fontSize: 18,
              formatter: function (params) {
                for (var i = 0; i < data.length; i++){
                  if (params.name.indexOf(data[i].name) >=0) {
                    return params.name + '\n' + (data[i].value*100/total).toFixed(2)+'%';
                  }
                }
              }
            }
          },
          roam: false, //是否允许缩放
          itemStyle: {
            normal: {
              color: 'rgba(51, 69, 89, .5)', //地图背景色
              borderColor: '#516a89', //省市边界线00fcff 516a89
              borderWidth: 1
            },
            emphasis: {
              color: 'rgba(37, 43, 61, .5)' //悬浮背景
            }
          }
        },
        series: series
      };
      var dom = document.getElementById("city");
      var myChart = echarts.init(dom);
      if (option && typeof option === "object") {
        myChart.clear();
        myChart.setOption(option, true);
      }
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
		initCard(scaleData,color,id) {
      var ydata = scaleData;
      var option = {
          backgroundColor: "transparent",
          color:color,
          series: [{
              type: 'pie',
              clockwise: false, //饼图的扇区是否是顺时针排布
              minAngle: 25, //最小的扇区角度（0 ~ 360）
              radius: ["40%", "55%"],
              center: ["50%", "50%"],
              avoidLabelOverlap: false,
              itemStyle: { //图形样式
                  normal: {
                      borderColor: '#0E0E20',
                      borderWidth: 10,
                  },
              },
              label: {
                  normal: {
                      show: true,
                      textStyle: {
                          fontSize: 17,
                      },
                      position: 'outside',
                      formatter: function(params,index) {
                          var percent = 0;
                          var total = 0;
                          for (var i = 0; i < ydata.length; i++) {
                              total += ydata[i].value;
                          }
                        percent = ((params.value / total) * 100).toFixed(2);
                          if(params.name !== '') {
                              return params.name + '\t\t{color1|' + percent + '%}';
                          }else {
                              return '';
                          }
									},
									rich: {
										color1: {
											fontSize:26
										},
									}				
                  },
                  emphasis: {
                      show: true,
                      position: 'outside',
                            formatter: function(params,index) {
                                var percent = 0;
                                var total = 0;
                                for (var i = 0; i < ydata.length; i++) {
                                    total += ydata[i].value;
                                }
                              percent = ((params.value / total) * 100).toFixed(2);
                                if(params.name !== '') {
                                    return params.name + '\t\t{color1|' + percent + '%}';
                                }else {
                                    return '';
                                }
										},
															rich: {
										color1: {
											fontSize:26
										},
									}		,
                      textStyle: {
                          fontSize: 18,
                      }
                  },
                  
              },
              labelLine: {
                show: false
              },
              data: ydata
          }]
      };
      var dom = document.getElementById(id);
      var myChart = echarts.init(dom);
      myChart.clear();
      if (option && typeof option === "object") {
        myChart.setOption(option, true);
      }
    },
	}
});

