function TMapChart(width, height) {
	//Chart.call(this, id, "TMapChart");

	this.divId = "#tmap";
	this.margin = {top: 30, right: 0, bottom: 40, left: 0};

	this.width = width - this.margin.left - this.margin.right;
	this.height = height - this.margin.top - this.margin.bottom;

	this.propertyList = [];
	this.property = {};

	this.timestamp = [];
	this.time = 1000;

	this.map = null;

	this.centerX = null;
	this.centerY = null;

	this.zoom = 10;
	this.mousePos = new Tmap.Control.MousePosition();

	this.keyboardPos = new Tmap.Control.KeyboardDefaults();
	this.overviewMap = new Tmap.Control.OverviewMap();

	this.dataList;
	this.dateKeyList;
	this.locationKeyList;

	this.selectedPopup;
	this.selectedMarker;
	this.prevSelectedMarker;
	this.searchedDataObject = [];
	this.checkedLegend = "";
	/*
	 this.tData = new Tmap.TData();
	 this.tData.events.register("onComplete", this.tData, function?);
	 */

	this.pr_3857 = new Tmap.Projection("EPSG:3857");
	this.pr_4326 = new Tmap.Projection("EPSG:4326");

	this.popup = null;
	this.currentTime;

	this.markerLayers;
	this.marker;

	this.statusObject = {0:"Dry", 1:"Damp", 2:"Wet", 3:"Ice", 4:"Snow/Ice", 5:"Chemically Wet", 6:"Critically Wet", 7:"Snow"};
	//this.statusObject = {0: "", 1:"Dry", 2:"Damp", 3:"Wet", 4:"Ice", 5:"Snow/Ice", 6:"Chemically Wet", 7:"Critically Wet", 8:"Snow"};
	this.tmapTimeAxisLineChart;
	this.tmapDistanceAxisLineChart;
	this.randomColor = ["#009a52", "#00bec7", "#007bfe", "#2B2B2B", "#e57e65", "#b04eee", "#fa4e6f", "#c83043"];

	this.parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%SZ");

	this.playSetTime;
	this.playMax = -1;
	this.playMin = -1;
	this.playerDates = [];
	this.playerSpeed = 400;

	this.startDate = "";
	this.endDate = "";

	this.routeLayers = [];
}

TMapChart.prototype.constructor = TMapChart;


/*TMapChart.prototype.dataUpdate = function (data) {
	this.dataList = data;
}*/

TMapChart.prototype.getData = function() {
	var that = this;

	$.ajax({
		url: "/kma/getData",
		async: false,
		data: {
			startDate: that.startDate,
			endDate: that.endDate
		},
		success: function(receive) {

			that.dataList = receive
		},
		error: function() {

		}

	})
};
TMapChart.prototype.dataParsing = function() {
	var that = this;

	that.dateKeyList = d3.nest()
		//.key(function(d) { return that.parseTime(d.date); })
		.key(function(d) { return d.date + ""; })
		//.key(function(d) { return d.name; })
		.entries(that.dataList);

	that.locationKeyList = d3.nest()
		.key(function(d) { return d.name })
		.entries(that.dataList);

};

TMapChart.prototype.draw = function() {

	var div = d3.select(this.divId);

	if (!div.empty()) {
		$(this.divId).empty()
	}

	this.map = new Tmap.Map({div:this.divId.substr(1), width:this.width, height:this.height, animation:true});

	//this.map.setCenter(new Tmap.LonLat(this.centerX, this.centerY).transform(this.pr_4326, this.pr_3857), this.zoom);
	this.map.addControl(this.mousePos);
};

TMapChart.prototype.update = function(selectedData) {

	var that = this;

	if (that.dateKeyList.length == 0) {
		alert("일차히는 데이터가 없습니다.");
		return false;
	}

	if (selectedData == undefined) {
		that.currentTime = that.dateKeyList[0].key;
	} else {
		that.currentTime = selectedData;
	}

	that.dateKeyList.forEach(function(row, i) {

		var date = row.key;
		var dateValue = row.values;

		if (date == that.currentTime) {
			that.drawMarkerPopup(dateValue, date)
		}

	});
};

TMapChart.prototype.addZeros = function(num, digit) { // 자릿수 맞춰주기
	var zero = '';
	num = num.toString();
	if (num.length < digit) {
		for (i = 0; i < digit - num.length; i++) {
			zero += '0';
		}
	}
	return zero + num;
};

TMapChart.prototype.drawDistanceAxisLineChart = function() {

	var that = this;

	/* selected legend */
	that.checkedLegend = $(".weatherInfo:checked").attr("id");
	that.playerDates = that.dateKeyList.map(function(d) { return d.key;	});
	var selectedTickDate = that.playerDates[$("#slider").slider("value")]

	that.dateKeyList.forEach(function(d) {
		if (d.key == selectedTickDate) {
			that.locationInfo = d.values;
		}
	})

	/* draw chart */
	that.tmapDistanceAxisLineChart = new TMapDistanceAxisLineChart(that.checkedLegend);
	that.tmapDistanceAxisLineChart.setLegendLayout();
	that.tmapDistanceAxisLineChart.setData(that.locationInfo);
	that.tmapDistanceAxisLineChart.setColor();

	if (!that.tmapDistanceAxisLineChart.isExistSvg()) {
		that.tmapDistanceAxisLineChart.draw();
	}
	that.tmapDistanceAxisLineChart.update();
	//tmapTimeAxisLineChart.update();

	//tmapTimeAxisLineChart.redraw($("input[name=chartType]:checked"));

	that.tmapDistanceAxisLineChart.initChartTypeCheck();

	$("input[name=chartType]").on("change", function() {
		that.handleChartTypeCheck($(this), that.tmapDistanceAxisLineChart);
		that.tmapDistanceAxisLineChart.redraw();
	});

};

TMapChart.prototype.drawTimeAxisLineChart = function() {

	var that = this;

	/* selected legend */
	that.checkedLegend = $(".weatherInfo:checked").attr("id");

	var dateInfo = [];
	that.locationKeyList.forEach(function(row) {
		if (row.key === $("#location").attr("name")) {
			row.values.forEach(function(it) {
				dateInfo.push(it);
			});
		}
	});

	/*set startDate endDate */
	var startDate = dateInfo[0].date.substring(0, 10);
	var endDate = dateInfo[dateInfo.length - 1].date.substring(0, 10);

	$("#startDate").html(startDate);
	$("#endDate").html(endDate);

	/* draw chart */
	that.tmapTimeAxisLineChart = new TMapTimeAxisLineChart(that.checkedLegend);
	that.tmapTimeAxisLineChart.setLegendLayout();
	that.tmapTimeAxisLineChart.setData(dateInfo);
	that.tmapTimeAxisLineChart.setColor();
	if (!that.tmapTimeAxisLineChart.isExistSvg()) {
		that.tmapTimeAxisLineChart.draw();
	}
	that.tmapTimeAxisLineChart.update();

	//tmapTimeAxisLineChart.update();

	//tmapTimeAxisLineChart.redraw($("input[name=chartType]:checked"));

	that.tmapTimeAxisLineChart.initChartTypeCheck();

	$("input[name=chartType]").on("change", function() {
		that.handleChartTypeCheck($(this), that.tmapTimeAxisLineChart);
		that.tmapTimeAxisLineChart.redraw();
	});

};

TMapChart.prototype.initChartTypeCheck = function() {
	var that = this;

	$("input[name=chartType]").each(function() {
		that.handleChartTypeCheck($(this), that);
	});


	//that.handleChartTypeCheck($(this))
	this.redraw();
};

TMapChart.prototype.handleChartTypeCheck = function($this, that) {
	var type = $this.val();
	var status = $this.is(":checked");

	that.setChartType(type, status);
};

TMapChart.prototype.setCurrentTimeClock = function() {
	var that = this;

	$.ajax({
		url: '/kma/getTime',
		method: 'post',
		data: {},
		async: false,
		success: function(receive) {
			if (receive === null) {
				that.setCurrentTimeClock();
			}

			that.currentTime = receive;
		},
		error: function(p1,p2,p3) {
			console.log(p1); // object
			console.log(p2); // result type
			alert(p3); // error type
			return false;
		}
	});

	$("#clock").html(that.currentTime);

	setTimeout(function(){ that.setCurrentTimeClock() }, 1000);
};

TMapChart.prototype.transformLonLat = function(lon, lat) {

	var that = this;
	var lonlat = new Tmap.LonLat(lon, lat).transform(that.pr_4326, that.pr_3857);

	return new Tmap.Geometry.Point(lonlat.lon, lonlat.lat)
};

TMapChart.prototype.showPolylineSvg = function(value) {

	var dateTime = this.playerDates[value];

	$("svg[id$=_svgRoot] g").css("visibility", "hidden");

	$("svg[id$=_svgRoot] polyline").each(function() {

		var id = $(this).attr("id");

		if (id.split("/")[1] == dateTime) {
			$(this).parent().css("visibility", "visible");
			$(this).parent().parent().css("visibility", "visible")
		}
	})

};

TMapChart.prototype.setViewPolyLineOrMarker = function(observerType, polyOrMarker) {

	var that = this;

	/* polyLine */
	if (polyOrMarker == "polyLine") {

		$("#polyLegend").show();
		/*$("#distanceLineChartDiv").css("visibility", "visible");
		$("#timeLineChartDiv").css("visibility", "hidden");*/
		$("#distanceLineChartDiv").show();
		$("#timeLineChartDiv").hide();
		$("#markerLegend").hide();
		$("#polyPlayer").show();
		$(".ui-slider-handle").focus();

		that.showPolylineSvg($("#slider").slider("value"));

		/* marker */
		var $marker = $("div[id^=Tmap_Layer_Markers_]");
		var $markerImg = $("div[id^=OL_Icon_] img");
		//$marker.css({"z-index":10000, "left": $marker.attr("left") + 10, "top":$marker.attr("top")+ 10 })
		$markerImg.css({"width":"25px", "height":"25px"})
		$marker.css({"z-index":10000})


		/* distance line chart */
		$("#timeLineChartDiv svg").remove();
		that.drawDistanceAxisLineChart();
		//that.mapPosLineString();
		that.drawLineString();
	}
	/* marker */
	else {
		$("#polyLegend").hide();
		/*$("#distanceLineChartDiv").css("visibility", "hidden");
		$("#timeLineChartDiv").css("visibility", "visible");*/
		$("#distanceLineChartDiv").hide();
		$("#timeLineChartDiv").show();
		$("#markerLegend").show();
		$("#polyPlayer").hide();
		$(".ui-slider-handle").blur();

		/* hide poly */
		var $polyline = $("[id^=Tmap_Layer_Vector_]");
		$polyline.prop("disalbed", true);
		$polyline.css("visibility", "hidden");

		that.setViewMarkersByType(observerType);

		/* marker */
		var $marker = $("div[id^=Tmap_Layer_Markers_]");
		var $markerImg = $("div[id^=OL_Icon_] img");
		//$markerImg.css({"width":"30px", "height":"30px"})

		/* view popup */
		that.togglePopup(that.selectedPopup);

		/* time line chart */
		$("#distanceLineChartDiv svg").remove();
		this.drawTimeAxisLineChart();
		//that.onClickMarker(that.selectedPopup, that.selectedMarker)
		//that.selectedPopup.show();
	}
};

TMapChart.prototype.removePolyLine = function() {

	this.routeLayers.forEach(function(it) {
		//it.events.register("featureremoved", it, null);
		it.destroy();
	})

}

TMapChart.prototype.mapPosLineString = function() {
	var that = this;

	that.removePolyLine();

	for (var i = 0; i<that.locationInfo.length; i++) {

		var pointList = [];
		var pointObject = {};

		for (var j = i; j <= i + 1; j++) {
			var pos = that.locationInfo[j];

			if (pos == undefined) {
				return;
			}

			pointObject = that.transformLonLat(pos.lon, pos.lat);
			pointObject["id"] = pos.date;
			pointList.push(pointObject);

		}

		//pointObject = that.transformLonLat(locationList[0].lon, locationList[0].lat);
		//pointObject["id"] = locationList[0].date;
		//pointList.push(pointObject);
		//
		//pointObject = that.transformLonLat(locationList[1].lon, locationList[1].lat);
		//pointObject["id"] = locationList[1].date;
		//pointList.push(pointObject);

		var routeFormat = new Tmap.Format.KML({extractStyles: true, extractAttributes: true});

		var urlStr = that.getUrl(pointList)

		var line_Style = {
			//fillColor: "#bbbbbb",
			//fillOpacity:1,
			//strokeColor: "#ff0000",
			strokeColor: that.setPolylineColor(pos[that.checkedLegend]),
			strokeOpacity: 1,
			strokeWidth: 6,
			//strokeDashstyle: "solid",
			//title: "[" + pos.title + "]" + pos.date
		};

		var prtcl = new Tmap.Protocol.HTTP({
			url: urlStr,
			format: routeFormat
		});

		var routeLayer = new Tmap.Layer.Vector("route", {protocol: prtcl, strategies: [new Tmap.Strategy.Fixed()]});

		routeLayer.events.register("featuresadded", routeLayer, null);

		that.map.addLayer(routeLayer);


		var svgId = $("div#" + routeLayer.id + " svg").attr("id")

		that.routeLayers.push(routeLayer);
	}

	$("[id^=Tmap_Geometry_Point_]").css("visibility", "hidden")
};

TMapChart.prototype.getUrl = function (value) {
	var startX = value[0].x
	var startY = value[0].y
	var endX =value[1].x
	var endY = value[1].y

	var urlStr = "https://apis.skplanetx.com/tmap/routes?version=1&format=xml";
	urlStr += "&startX=" + startX;
	urlStr += "&startY=" + startY;
	urlStr += "&endX=" + endX;
	urlStr += "&endY=" + endY;
	urlStr += "&appKey=72869396-c011-3f94-9e22-c08c831cc254";

	return urlStr;
}
TMapChart.prototype.drawLineLegend = function(legendType) {
	var that = this;

	var ul = d3.select("#polyLegend ul.poly-legend");

	var statusObject = that.getLegendInterval(legendType);
	var statusObjectKey = d3.keys(statusObject);
	var statusObjectValue = d3.values(statusObject);

	var li = ul.selectAll("li")
		.data(statusObjectKey)
		.enter()
		.append("li")
		.style("float", "left")
		.style("margin-right", "20px");

		li.append("svg")
		.attr("width", 10)
		.attr("height", 7)
		.append("rect")
		.attr("width", 7)
		.attr("height", 3)
		.attr("x", 0)
		.attr("y", 2)
		.style("fill", function(d) {
			return that.randomColor[d]
		});

		li.append("span")
		.text(function(d) {
			return statusObject[d];
		})
};

TMapChart.prototype.getLegendInterval = function(legendType) {
	var that = this;
	var polyLegendList = "";

	switch(that.checkedLegend) {
		case "temperature":
			break;
		case "pressure":
			break;
		case "rainfall":
			break;
		case "winddirection":
			break;
		case "windvelocity":
			break;
		case "squalldirection":
			break;
		case "squallvelocity":
			break;
		case "roadstat":
			polyLegendList = that.statusObject;
			break;
		case "roadsurfaceheight":
			break;
		case "roadtemperature":
			break;
		case "roadfreezingtemperature":
			break;
		case "roadhumidity":

			break;
		case "roadfreezingrate":
			break;
		case "roadfriction":
			break;
		case "visibility":
			break;
		default:
			break;
	}

	//return color;
	return polyLegendList;

};

TMapChart.prototype.drawLineString = function() {

	var that = this;

	for (var i = 0; i <= that.locationInfo.length; i++) {

		var pointList = [];
		var pointObject = {};

		if (i == that.locationInfo.length - 1) {
			return false;
		}

		//var startPos = locationList[i];
		//var endPos = locationList[i+1];
		//
		//console.log(JSON.stringify(startPos))
		//console.log(JSON.stringify(endPos))

		for (var j = i; j <= i+1; j++) {

			var pos = that.locationInfo[j];

			//console.log(j + ":" + JSON.stringify(pos));

			pointObject = that.transformLonLat(pos.lon, pos.lat);
			pointObject["id"] = pos.date;
			pointList.push(pointObject);

			var line_Style = {
				fillColor: "#bbbbbb",
				fillOpacity:1,
				//strokeColor: "#ff0000",
				strokeColor: that.setPolylineColor(pos[that.checkedLegend]),
				strokeWidth: 6,
				strokeDashstyle: "solid",
				title: "[" + pos.title + "]" + pos.date
			};
		}

		var lineString = new Tmap.Geometry.LineString(pointList);

		lineString.id = lineString.id + "/" + pos.date;
		var mLineFeature = new Tmap.Feature.Vector(lineString, null, line_Style);

		var vectorLayer = new Tmap.Layer.Vector("vectorLayerID");
		that.map.addLayer(vectorLayer);

		vectorLayer.addFeatures([mLineFeature]);
	}
};

TMapChart.prototype.setStartEndDateTime = function() {
	this.startDate = $("#startDate").val();
	this.endDate = $("#endDate").val();


	var startDateType = new Date(this.startDate).getTime()
	var endDateType = new Date(this.endDate).getTime()

	var gap = endDateType - startDateType;
	var min_gap = gap / 1000 /60;

	if (min_gap > 30) {
		alert("30분 이전의 시간은 검색하실 수 없습니다.");

		this.startDate = new Date(endDateType - 30 * 60 * 1000);

		var year = this.startDate.getFullYear();
		var month = this.startDate.getMonth() + 1;
		month =  month < 10 ? "0" + month : month;
		var day = this.startDate.getDate();
		day =  day < 10 ? "0" + day : day;

		var hour = this.startDate.getHours();
		var minute = this.startDate.getMinutes();
		minute = minute < 10 ? "0" + minute : minute;

		//2017-01-01 0:10
		this.startDate = [year, month, day].join('-') + " " + [hour, minute].join(":")

		$("#startDate").val(this.startDate);
	}

	$("#startDateText").text(this.startDate);
	$("#endDateText").text(this.endDate);
}

TMapChart.prototype.setSliderTicks = function(e) {
	var that = this;

	var $slider =  $(e);
	this.playMax =  $slider.slider("option", "max");
	this.playMin =  $slider.slider("option", "min");

	var interval = $("#slider").width() / this.playMax;

	$slider.append("<div id=\"ticks\"></div>");
	$slider.find('#ticks').empty();
	$slider.find('#ticks').append("<div id=\"ticksTime\"></div>");
	$slider.find('#ticks').prepend("<div id=\"ticksDate\"></div>");

	for (var i = this.playMin; i <= this.playMax; i++) {
		var month = that.playerDates[i].substring(5, 7);
		var date = that.playerDates[i].substring(8, 10);
		var hour = that.playerDates[i].substring(11, 12);

		/*if (i%3 == 0) {
			$("<li class=\"ui-slider-tick-mark\" style=\"width:"+ interval +"px;\">" + that.playerDates[i].substring(11, 16) + "</li>").appendTo($("#ticksTime"));
		} else {
			$("<li class=\"ui-slider-tick-mark\" style=\"width:"+ interval +"px;\">&nbsp;</span>").appendTo($("#ticksTime"));
		}*/

		if (i == this.playMax) {
			$("<li class=\"ui-slider-tick-mark\" style=\"width:10px; background: url(assets/kma/player_interval.png) no-repeat;\">" + that.playerDates[i].substring(13, 15) + "</li>").appendTo($("#ticksTime"));
		} else {
			$("<li class=\"ui-slider-tick-mark\" style=\"width:"+ interval +"px; background: url(assets/kma/player_interval.png) no-repeat;\">" + that.playerDates[i].substring(13, 15) + "</li>").appendTo($("#ticksTime"));
		}

		if (i == this.playMin || i == this.playMax) {
			var timePoint = (i == this.playMin) ? "PAST" : "NOW";
			var float = (i == this.playMin) ? "" : "float:right";
			$("<li class=\"ui-slider-tick-mark\" style=\"width: 60px; " + float + "\">" + timePoint + " " + Number(month) + "/" + Number(date) + " " + Number(hour) + "시</li>").appendTo($("#ticksDate"));
		}

	}
};

TMapChart.prototype.drawPlayer = function() {
	var that = this;
	var html = "";

	that.playerDates = that.dateKeyList.map(function(d) {
		return d.key;
	});

	var maxValue = that.playerDates.length - 1;

	$("#slider").slider({
		animate: true,
		range: "min",
		value: 1,
		min: 0,
		max: maxValue,
		step: 1,
		create: function(event, ui) {
			that.setSliderTicks(event.target, that.playerDates);

		},
		slide: function(event, ui) {
		},
		change: function(event, ui) {
			that.showPolylineSvg(ui.value);
			that.drawDistanceAxisLineChart();
			that.drawLineString();
			//that.mapPosLineString();

		}
	});

	$(".playerBtn").on("click", function() {
		that.controlPlayer($("#slider").slider("value"), this.id);
	});

	$(".speed").on("click", function() {
		that.controlSpeed(this.id);
	})
};

TMapChart.prototype.controlSpeed = function(type) {

	var that = this;

	if (type == "normal") {
		that.playerSpeed = 400
	} else if (type == "fast") {
		that.playerSpeed = 100
	} else {
		that.playerSpeed = 600
	}
};

TMapChart.prototype.controlPlayer = function(currentPosition, type) {
	var that = this;

	if (type == "next") {
		if (currentPosition == that.playMax) {
			$("#slider").slider("value", 0);
		} else {
			$("#slider").slider("value", currentPosition + 1);
		}
	} else if (type == "prev") {
		if (currentPosition == that.playMin) {
			$("#slider").slider("value", 0);
		} else {
			$("#slider").slider("value", currentPosition - 1);
		}
	} else if (type == "play") {

		if (currentPosition == that.playMax) {
			$("#slider").slider("value", 0);
			that.controlPlayer($("#slider").slider("value"), "pause")
		} else {
			$("#slider").slider("value", currentPosition + 1);

			that.playSetTime = setTimeout(function(){ that.controlPlayer($("#slider").slider("value"), type) }, that.playerSpeed);
		}
	} else {
		clearTimeout(that.playSetTime);
	}

	that.drawDistanceAxisLineChart();
	//that.mapPosLineString();
	that.drawLineString();


};


TMapChart.prototype.setPolylineColor = function(target) {
	var that = this;
	var color = "";

	switch(that.checkedLegend) {
		case "temperature":
			break;
		case "pressure":
			break;
		case "rainfall":
			break;
		case "winddirection":
			break;
		case "windvelocity":
			break;
		case "squalldirection":
			break;
		case "squallvelocity":
			break;
		case "roadstat":
			color = that.randomColor[target];
			break;
		case "roadsurfaceheight":
			break;
		case "roadtemperature":
			break;
		case "roadfreezingtemperature":
			break;
		case "roadhumidity":

			break;
		case "roadfreezingrate":
			break;
		case "roadfriction":
			break;
		case "visibility":
			break;
		default:
			break;
	}

	//return color;
	return color
};

/*TMapChart.prototype.routeRegister = function(layer, that) {
	layer.events.register("featuresadded", layer, function() {
		that.onDrawnFeatures(this, that)
	});
}*/

TMapChart.prototype.onDrawnFeatures = function($this, that) {
	that.map.zoomToExtent($this.getDataExtent());
};

TMapChart.prototype.setViewMarkersByType = function(observerType) {

	console.log(observerType)
	console.log()


	if (typeof observerType == "string") {
		if (observerType == "all") {
			$("div[id^=OL_Icon_]").show()
		} else {
			$(".tmPopup").hide();
			$("div[id^=OL_Icon_]").each(function() {
				var src = $(this).find("img").attr("src");

				if (src.indexOf(observerType) != -1) {
					$(this).show();
				} else {
					$(this).hide();
				}
			});
		}

	} else {
		if (observerType) {
			$("div[id^=OL_Icon_]").show()
		} else {
			$(".tmPopup").hide();
			$("div[id^=OL_Icon_]").hide()
		}
	}


};

TMapChart.prototype.setMarker = function(observerType, lon, lat, width, height) {
	var that = this;

	that.markerLayers = new Tmap.Layer.Markers( "MarkerLayer" );
	that.map.addLayer(that.markerLayers);
	var lonlat = new Tmap.LonLat(lon, lat).transform(that.pr_4326, that.pr_3857);

	var size = null;
	var offset = null;

	//if (roadstat != 0) {
	size = new Tmap.Size(width, height);
	//offset = new Tmap.Pixel(-(size.w/2), -size.h);
	offset = new Tmap.Pixel(-(size.w/2), -size.h);
	//}

	var iconImage = "";

	if (observerType == "fix") {
		iconImage = "/assets/kma/map_marker_fix.png";
	} else if (observerType == "move") {
		iconImage = "/assets/kma/map_marker_move.png";
	} else if (observerType == "cctv") {
		iconImage = "/assets/kma/map_marker_cctv.png";
	}

	//var icon = new Tmap.Icon('https://developers.skplanetx.com/upload/tmap/marker/pin_b_m_a.png', size, offset);
	var icon = new Tmap.Icon(iconImage, size, offset);

	that.marker = new Tmap.Marker(lonlat, icon);
	that.marker.events.element.name = "markerImg";
	that.markerLayers.addMarker(that.marker);

};

TMapChart.prototype.drawMarkerPopup = function(dataList, date) {
	var that = this;
	that.searchedDataObject = dataList;

	//var middlePos = that.searchedDataObject[(that.searchedDataObject.length -1) / 2]
	var middlePos = that.searchedDataObject[that.searchedDataObject.length -1]

	that.centerX = middlePos.lon;
	that.centerY = middlePos.lat;

	this.map.setCenter(new Tmap.LonLat(this.centerX, this.centerY).transform(this.pr_4326, this.pr_3857), this.zoom);

	that.searchedDataObject.forEach(function(location) {

		var id = location.name;
		var title = location.title;
		var observerType = location.observerType;
		var lon = location.lon;
		var lat = location.lat;
		var temperature = location.temperature;
		var pressure = location.pressure;
		var rainfall = location.rainfall;
		var winddirection = location.winddirection;
		var windvelocity = location.windvelocity;
		var squalldirection = location.squalldirection;
		var squallvelocity = location.squallvelocity;
		var roadstat = location.roadstat;
		var roadsurfaceheight = location.roadsurfaceheight;
		var roadtemperature = location.roadtemperature;
		var roadfreezingtemperature = location.roadfreezingtemperature;
		var roadhumidity = location.roadhumidity;
		var roadfreezingrate = location.roadfreezingrate;
		var roadfriction = location.roadfriction;
		var visibility = location.visibility;
		var date = location.date;

		/* marker */
		that.setMarker(observerType, lon, lat, 30, 30)

		/* popup */
		var html = "";

		html += "<div>";
		html += "	<div class=\"title\"><span id=\"" + id + "\" name=\"" + observerType + "\">" + title + "</span><a href=\"#\" id=\"closePopup\" style=\"float:right\">x</a></div>";
		html += "	<div class=\"content\">";
		html += "	<table id=\"tpr\">";
		html += "		<tr>";
		html += "			<td>";
		html += "				<img src=\"/assets/kma/temperature.png\">";
		html += "				<span style=\"font-size: 25px; color: #f2f9fd;\">" + (Math.floor(temperature * 100) / 100) + "˚</span>";
		html += "				<span class=\"unit\"></span>";
		html += "			</td>";
		html += "			<td>";
		html += "				<img src=\"/assets/kma/presure.png\">";
		html += "				<span style=\"font-size: 25px; color: #f2f9fd;\">" + (Math.floor(pressure * 100) / 100) + "</span>";
		html += "				<span class=\"unit\">mb</span>";
		html += "			</td>";
		html += "			<td>";
		html += "				<img src=\"/assets/kma/rain.png\">";
		html += "				<span style=\"font-size: 25px; color: #f2f9fd;\">" + rainfall + "</span>";
		html += "				<span class=\"unit\">mm</span>";
		html += "			</td>";
		html += "		</tr>";
		html += "	</table>";
		html += "	<table id=\"wind\">";
		html += "		<tr>";
		html += "			<th class=\"head\">풍   향</th>";
		html += "			<td><img src=\"/assets/kma/Compass_" + winddirection + ".png\"><div>" + winddirection + "</div><div style=\"color:#1c8ad5\">" + windvelocity + "m/s</div></td>";
		html += "			<th class=\"head\">돌풍풍향</th>";
		//html += "			<td><img src=\"/assets/kma/Compass_" + squalldirection + ".png\"><div>" + squalldirection + "</div><div style=\"color:#1c8ad5\">" + squallvelocity + "m/s</div></td>";
		html += "			<td><img src=\"/assets/kma/Compass_" + that.setSqualldirection(squalldirection) + ".png\"><div>" + that.setSqualldirection(squalldirection) + "</div><div style=\"color:#1c8ad5\">" + squallvelocity + "m/s</div></td>";
		html += "		</tr>";
		html += "	</table>";
		html += "	<table id=\"road\">";
		html += "		<tr>";
		html += "			<th><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"10px\" height=\"10px\">";
		html += "				<circle fill=\"#3f7b7e\" cx=\"5\" cy=\"5\" r=\"5\" />";
		html += "			</svg>노면상태</th>";
		html += "			<td>" + that.statusObject[roadstat] + "</td>";
		html += "			<th><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"10px\" height=\"10px\">";
		html += "				<circle fill=\"#a74e8b\" cx=\"5\" cy=\"5\" r=\"5\" />";
		html += "			</svg>노면수막높이</th>";
		html += "			<td>" + roadsurfaceheight + "</td>";
		html += "		</tr>";
		html += "		<tr>";
		html += "			<th><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"10px\" height=\"10px\">";
		html += "				<circle fill=\"#3c4eaa\" cx=\"5\" cy=\"5\" r=\"5\" />";
		html += "			</svg>노면온도</th>";
		html += "			<td>" + roadtemperature + "˚C</td>";
		html += "			<th><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"10px\" height=\"10px\">";
		html += "				<circle fill=\"#824361\" cx=\"5\" cy=\"5\" r=\"5\" />";
		html += "			</svg>노면동결온도</th>";
		html += "			<td>" + roadfreezingtemperature + "˚C</td>";
		html += "		</tr>";
		html += "		<tr>";
		html += "			<th><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"10px\" height=\"10px\">";
		html += "				<circle fill=\"#8370c9\" cx=\"5\" cy=\"5\" r=\"5\" />";
		html += "			</svg>노면습도</th>";
		html += "			<td>" + roadhumidity + "%</td>";
		html += "			<th><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"10px\" height=\"10px\">";
		html += "				<circle fill=\"#a27b51\" cx=\"5\" cy=\"5\" r=\"5\" />";
		html += "			</svg>노면동결율</th>";
		html += "			<td>" + roadfreezingrate + "%</td>";
		html += "		</tr>";
		html += "		<tr>";
		html += "			<th><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"10px\" height=\"10px\">";
		html += "				<circle fill=\"#53498f\" cx=\"5\" cy=\"5\" r=\"5\" />";
		html += "			</svg>노면마찰</th>";
		html += "			<td>" + roadfriction + "</td>";
		html += "			<th><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"10px\" height=\"10px\">";
		html += "				<circle fill=\"#c3a40b\" cx=\"5\" cy=\"5\" r=\"5\" />";
		html += "			</svg>시정</th>";
		html += "			<td>" + visibility + "</td>";
		html += "		</tr>";
		html += "	</table>";
		html += "	</div>";
		html += "</div>";

		that.popup = new Tmap.Popup(id,
			new Tmap.LonLat(lon, lat).transform(that.pr_4326, that.pr_3857),
			new Tmap.Size(330, 240), html, false);

		that.map.addPopup(that.popup);

		that.popup.hide();
		$(".tmPopup").css({"background-color":"#2f333c"});

		//marker.events.register("mouseover", popup, onOverMarker);
		//marker.events.register("mouseout", that.popup, that.onClickMarker);

		//that.markerRegister(that.popup);

		/* onclick marker */
		that.marker.events.register("click", that.popup, function(event) {
			that.onClickMarker(this, event.target.attributes['id'].value);
		});

	});
};

TMapChart.prototype.togglePopup = function(selectedPopup) {

	/* target popup show */
	$(".tmPopup").hide();
	selectedPopup.show();

	$("#" + selectedPopup.id).css("z-index", 200000)

	/* onclick x close */
	var x_button = selectedPopup.div.childNodes["0"].childNodes["0"].childNodes["0"].childNodes[1].childNodes[1];
	$(x_button).on("click", function() {
		selectedPopup.hide();
	})
};

TMapChart.prototype.onClickMarker = function(selectedPopup, selectedMarker) {
	var that = this;

	/* set selected popup */
	that.selectedPopup = selectedPopup;
	that.selectedMarker = selectedMarker;

	/* set popup title, id */

	var location_title = that.selectedPopup.div.childNodes["0"].childNodes["0"].childNodes["0"].childNodes[1].childNodes["0"].innerText;
	var location_id = that.selectedPopup.id;
	var location_observer = that.selectedPopup.div.childNodes["0"].childNodes["0"].childNodes["0"].childNodes[1].childNodes["0"].attributes[1].nodeValue;

	$("#location").prev("img").attr("src", "/assets/kma/map_icon_" + location_observer + ".png");
	$("#location").html(location_title);
	$("#location").attr("name", location_id);

	/* set default legend roadstat */
	$(".weatherInfo#roadstat").attr("checked", true);

	if (that.prevSelectedMarker != undefined ) {
		$("#" + that.prevSelectedMarker).attr("src", that.setMarkerObserverType(that.prevSelectedMarker, false));
		$("#" + that.prevSelectedMarker).css({width:'30px', height:'30px'});
	}

	$("#" + selectedMarker).attr("src", that.setMarkerObserverType(selectedMarker, true));
	$("#" + selectedMarker).css({width:'40px', height:'40px'});

	that.togglePopup(that.selectedPopup);

	/* set selected marker */
	that.prevSelectedMarker = selectedMarker;

	/* draw line chart*/
	that.setViewPolyLineOrMarker($("input[name=observerType]:checked").val(), $("input[name=viewPolyLineOrMarker]:checked").val());
};

TMapChart.prototype.setSqualldirection = function(squalldirection) {

	var squalldirection_txt = "";

	if (0 < squalldirection && squalldirection <= 22.5) {
		squalldirection_txt = "N";
	}
	else if (22.5 < squalldirection && squalldirection <= 45) {
		squalldirection_txt = "NNE";
	}
	else if (45 < squalldirection && squalldirection <= 67.5) {
		squalldirection_txt = "NE";
	}
	else if (67.5 < squalldirection && squalldirection <= 90) {
		squalldirection_txt = "ENE";
	}
	else if (90 < squalldirection && squalldirection <= 112.5) {
		squalldirection_txt = "E";
	}
	else if (112.5 < squalldirection && squalldirection <= 135) {
		squalldirection_txt = "ESE";
	}
	else if (135 < squalldirection && squalldirection <= 157.5) {
		squalldirection_txt = "SE";
	}
	else if (157.5 < squalldirection && squalldirection <= 180) {
		squalldirection_txt = "SSE";
	}
	else if (180 < squalldirection && squalldirection <= 202.5) {
		squalldirection_txt = "S";
	}
	else if (202.5 < squalldirection && squalldirection <= 225) {
		squalldirection_txt = "SSW";
	}
	else if (225 < squalldirection && squalldirection <= 247.5) {
		squalldirection_txt = "SW";
	}
	else if (247.5 < squalldirection && squalldirection <= 270) {
		squalldirection_txt = "WSW";
	}
	else if (270 < squalldirection && squalldirection <= 292.5) {
		squalldirection_txt = "W";
	}
	else if (292.5 < squalldirection && squalldirection <= 315) {
		squalldirection_txt = "WNW";
	}
	else if (315 < squalldirection && squalldirection <= 337.5) {
		squalldirection_txt = "NW";
	}
	else if (337.5 < squalldirection && squalldirection <= 360) {
		squalldirection_txt = "NNW";
	}
	else if (squalldirection = 0) {
		squalldirection_txt = "N";
	}

	return squalldirection_txt;
}

TMapChart.prototype.setMarkerObserverType = function(target, isFocus) {
	var iconImage = "";
	var iconImageFocus = "";

	var observer = $("#" + target).attr("src");

	if (observer == undefined) {
		return false;
	}

	if (observer.indexOf("fix") != -1) {
		iconImage = "/assets/kma/map_marker_fix.png";
		iconImageFocus = "/assets/kma/map_marker_fix_focus.png"
	} else if (observer.indexOf("move") != -1) {
		iconImage = "/assets/kma/map_marker_move.png";
		iconImageFocus = "/assets/kma/map_marker_move_focus.png"
	} else if (observer.indexOf("cctv") != -1) {
		iconImage = "/assets/kma/map_marker_cctv.png";
		iconImageFocus = "/assets/kma/map_marker_cctv_focus.png"
	}

	if (isFocus) {
		return iconImageFocus;
	} else {
		return iconImage;
	}
};
