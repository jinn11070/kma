function TMapDistanceAxisLineChart(checkedLegend) {

	TMapChart.call(this);

	this.chartDiv;
	this.svg;
	this.g;

	this.line;
	this.area;

	this.locationInfo;
	this.checkedLegend = checkedLegend;

	this.padding = {top: 25, right: 35, bottom: 25, left: 60};
	this.width;
	this.height;

	this.svgWidth;
	this.svgHeight;

	this.left;

	this.x;
	this.y;

	this.xAxis;
	this.yAxis;

	this.color;

	this.parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
	//var parseTime = d3.timeParse("%Y%m%d");
	this.formatTime = d3.timeFormat("%Y-%m-%d %H:%M:%S");

	this.entriesData;

	this.chartType = {};

}

TMapDistanceAxisLineChart.prototype = Object.create(TMapChart.prototype);

TMapDistanceAxisLineChart.prototype.constructor = TMapDistanceAxisLineChart;

TMapDistanceAxisLineChart.prototype.setColor = function() {
	var that = this;

	switch(that.checkedLegend) {
		case "temperature":
			that.color = "#e84d38";
			break;
		case "pressure":
			that.color = "#f1ca0b";
			break;
		case "rainfall":
			that.color = "#3ccae5";
			break;
		case "winddirection":
			that.color = "#3b7376";
			break;
		case "windvelocity":
			that.color = "#3b7376";
			break;
		case "squalldirection":
			that.color = "#3b7376";
			break;
		case "squallvelocity":
			that.color = "#3b7376";
			break;
		case "roadstat":
			that.color = "#3f7b7e";
			break;
		case "roadsurfaceheight":
			that.color = "#a74e8b";
			break;
		case "roadtemperature":
			that.color = "#3c4eaa";
			break;
		case "roadfreezingtemperature":
			that.color = "#824361";
			break;
		case "roadhumidity":
			that.color = "#8370c9";
			break;
		case "roadfreezingrate":
			that.color = "#a27b51";
			break;
		case "roadfriction":
			that.color = "#5e549f";
			break;
		case "visibility":
			that.color = "#3b7376";
			break;
		default:
			break;
	}
};

TMapDistanceAxisLineChart.prototype.setData = function(locationInfo) {
	//console.log(JSON.stringify(locationInfo))
	this.locationInfo = locationInfo;
};

TMapDistanceAxisLineChart.prototype.setLegendLayout = function() {

	var that = this;

	/* draw layout */
	$("#distanceLineChartDiv").empty();

	var html = "";

	html += "	<ul id=\"" + that.checkedLegend + "\">";
	html += "		<li class=\"chart\"></li>";
	html += "	</ul>";

	$("#distanceLineChartDiv").html(html);
};

TMapDistanceAxisLineChart.prototype.isExistSvg = function() {
	var svg = d3.select(this.svg);

	if (svg.empty()) {
		return false;
	} else {
		return true;
	}
};

TMapDistanceAxisLineChart.prototype.draw = function() {
	var that = this;

	/* draw svg */
	that.chartDiv = d3.select("#distanceLineChartDiv");
	that.svg = that.chartDiv.selectAll(".chart").append("svg")
		.attr("width", "100%")
		.attr("height", "100%");

	that.left = -1;
	if (that.checkedLegend == "roadstat") {
		that.left = that.padding.left + 60;
	} else {
		that.left = that.padding.left;
	}

	//console.log("TMapDistanceAxisLineChart")
	//console.log(that.svg.node().getBoundingClientRect().width)
	//console.log(that.svg.node().getBoundingClientRect().height)

	that.svgWidth = 1280;
	that.svgHeight = 200;
};

TMapDistanceAxisLineChart.prototype.update = function() {

	var that = this;
	that.width = that.svgWidth - that.left - that.padding.right;
	that.height = that.svgHeight - that.padding.top - that.padding.bottom;

	var offsetX = ((that.width / that.locationInfo.length)) / 2;

	/* axis 설정 */
	that.x = d3.scaleBand()
		.rangeRound([0, that.width]) // 왼 -> 오
		.domain(that.locationInfo.map(function(d){return d.title;}))

	var yMin = d3.min(that.locationInfo, function(d) { return d[that.checkedLegend];} );
	var yMax = d3.max(that.locationInfo, function(d) { return d[that.checkedLegend];} );

	var keysLength = d3.keys(that.statusObject).length;

	that.y = d3.scaleLinear()
		.rangeRound([that.height, 0]);
		if (that.checkedLegend == "roadstat") {
			that.y.domain([0,keysLength])
		}
		else {
			//that.y.domain(d3.extent(that.locationInfo, function(d) { return d[that.checkedLegend];} ))
			if (yMax - yMin == 0) {
				if (yMax == 0) {
					yMax = 1;
					yMin = -1;
				} else {
					yMax = yMax + 1;
					yMin = 0;
				}
			}

			that.y.domain([yMin, yMax])
		}

	/* axis 추가 */
	that.xAxis = that.svg.append("g")
		.attr("transform", "translate(" + that.left + ", " + (that.padding.top + that.height) + ")")
		.call(d3.axisBottom(that.x)
			.ticks(that.locationInfo.length)
			//.tickFormat(d3.timeFormat("%m%d %H:%M"))
			//.tickFormat(d3.timeFormat("%H"))
		)
		.selectAll("text")
		.style("text-anchor", "end")
		.attr("dx", "-.8em")
		.attr("dy", ".15em")
		.attr("transform", "rotate(-65)");

	that.yAxis = that.svg.append("g")
		.attr("transform", "translate(" + that.left + ", " + that.padding.top + ")");

	if (that.checkedLegend == "roadstat") {
		that.yAxis.call(d3.axisLeft(that.y)
				.ticks(keysLength)
				.tickFormat(function(d) {
					if (d == 0) return "";
					else return that.statusObject[d - 1];
				})
		)
	}
	else {
		that.yAxis.call(d3.axisLeft(that.y))
	}

	/* offset */
	var strokeWidth = -1;

	if (that.checkedLegend == "roadstat") {
		strokeWidth = that.height / (keysLength-1)
	} else {
		strokeWidth = that.height / that.yAxis._groups["0"]["0"].childElementCount
	}

	/* grid line 추가 */
	var yGrid = that.svg.append("g")
		.attr("class", "grid")
		.attr("transform", "translate(" + (that.left + 1) + ", " + (that.padding.top - strokeWidth / 2) + ")")
		.call(d3.axisLeft(that.y)
			.tickSize(-(that.width))
			.tickFormat(""));

	/* y grid style */
	yGrid.selectAll(".grid .tick line")
		.attr("stroke-width", strokeWidth)
		.attr("stroke", function(d, i) {
			if (i%2 == 1) {
				return "#eeeeee"
			} else {
				return "#ffffff"
			}
		})
		.attr("stroke-opacity",.7);

	/* date 그리기 */
	that.g = that.svg.append("g")
		.attr("transform", "translate(" + (that.left + offsetX) + ", " + that.padding.top + ")");

	/* line 설정 */
	that.line = d3.line()
		.x(function(d) {
			/*var date = that.formatTime(new Date(d.date));
			date = new Date(date);*/
			return that.x(d.title)
		})
		.y(function(d) {
			if (that.checkedLegend == "roadstat") {
				return that.y(d[that.checkedLegend] + 1)
			} else {
				return that.y(d[that.checkedLegend])
			}
		});
		/*.curve(d3.curveNatural);*/

	that.area = d3.area()
		.x(function(d) {
			/*var date = that.formatTime(new Date(d.date));
			date = new Date(date);*/
			return that.x(d.title)
		})
		.y0(that.height)
		.y1(function(d) {
			if (that.checkedLegend == "roadstat") {
				return that.y(d[that.checkedLegend] + 1)
			} else {
				return that.y(d[that.checkedLegend])
			}
		});
		/*.curve(d3.curveNatural);*/

	/* focus */
	var dot = that.svg.append("g")
		.attr("transform", "translate(" + (that.left + offsetX) + ", " + that.padding.top + ")");

	dot.selectAll("circle")
		.data(that.locationInfo)
		.enter()
		.append("circle")
		.attr("r", 6)
		.attr("fill", that.color)
		.attr("stroke-width", 20)
		.attr("stroke", "transparent")
		.attr("opacity", .6)
		.attr("cx", function(d) {
			return that.x(d.title)
		})
		.attr("cy", function(d) {
			if (that.checkedLegend == "roadstat") {
				return that.y(d[that.checkedLegend] + 1)
			} else {
				return that.y(d[that.checkedLegend])
			}
		})

		.style("cursor", "pointer")
		.on("mouseover", function(d, i) {
			//console.log(that.x(d.title))

			console.log(i)

			d3.select(this)
				//.attr("r", 6)
				//.attr("class", "dot-over")
				.attr("fill", "red")
				//.attr("stroke-width", 20)
				//.attr("stroke", "transparent")
				.attr("opacity", 1)


			console.log($(".tooltip_" + i));

			d3.select(".tooltip_" + i).attr("display", "inline");
			d3.select("[name=tooltipdate_" + i + "]").attr("display", "inline");
			d3.select("[name=tooltipcontent_" + i + "]").attr("display", "inline")
		})
		.on("mouseout", function(d, i) {
			d3.select(this)
				//.attr("r", 6)
				//.attr("class", "dot-out")
				.attr("fill", that.color)
				//.attr("stroke-width", 40)
				//.attr("stroke", "transparent")
				.attr("opacity", .6)

			d3.select(".tooltip_" + i).attr("display", "none");
			d3.select("[name=tooltipdate_" + i + "]").attr("display", "none");
			d3.select("[name=tooltipcontent_" + i + "]").attr("display", "none")
		});

	/* tooltip */
	var tooltip = that.svg.append("g")
		.attr("transform", "translate(" + (that.left + offsetX) + ", " + that.padding.top + ")");

	tooltip.selectAll("rect")
		.data(that.locationInfo)
		.enter()
		.append("rect")

		.attr("class", function(d, i) {
			return "tooltip_" + i
		})
		.attr("width", 150)
		.attr("height", 50)
		.attr("rx", "3px")
		.attr("rx", "3px")
		.attr("x", function(d, i) {
			if (that.x(d.title) + 150 > that.width) {
				return that.width - 150;
			} else {
				return that.x(d.title) + 4
			}
		})
		.attr("y", function(d) {
			if (that.checkedLegend == "roadstat") {
				yPos = that.y(d[that.checkedLegend] + 1)
			} else {
				yPos = that.y(d[that.checkedLegend])
			}

			if (yPos + 50 > that.height) {
				return that.height - 50 + 4;
			} else {
				return yPos + 4;
			}
		})
		.attr("display", "none")

		.style("fill", "#30333C")
		.style("opacity", .8)
		.style("stroke", "#1C1D1F");

	tooltip.selectAll(".dataDate")
		.data(that.locationInfo)
		.enter()
		.append("text")
		.attr("class", "dataDate")
		.attr("name", function(d, i) {
			return "tooltipdate_" + i
		})
		.attr("width", 150)
		.attr("height", 50)
		.attr("x", function(d) {
			if (that.x(d.title) + 150 > that.width) {
				return that.width - 150 + 20;
			} else {
				return that.x(d.title) + 20
			}
		})
		.attr("y", function(d) {
			if (that.checkedLegend == "roadstat") {
				yPos = that.y(d[that.checkedLegend] + 1)
			} else {
				yPos = that.y(d[that.checkedLegend])
			}

			if (yPos + 50 > that.height) {
				return that.height - 50 + 20;
			} else {
				return yPos + 20;
			}
		})
		.attr("display", "none")

		.html(function(d) {
			return d.title;
		})
		.style("fill", "white");

	tooltip.selectAll(".dataContent")
		.data(that.locationInfo)
		.enter()
		.append("text")
		.attr("class", "dataContent")
		.attr("name", function(d, i) {
			return "tooltipcontent_" + i
		})
		.attr("width", 150)
		.attr("height", 50)
		.attr("x", function(d) {
			if (that.x(d.title) + 150 > that.width) {
				return that.width - 150 + 20;
			} else {
				return that.x(d.title) + 20;
			}
		})
		.attr("y", function(d) {
			var yPos = -1;

			if (that.checkedLegend == "roadstat") {
				yPos = that.y(d[that.checkedLegend] + 1)
			} else {
				yPos = that.y(d[that.checkedLegend])
			}

			if (yPos + 50 > that.height) {
				return that.height - 50 + 38;
			} else {
				return yPos + 38;
			}
		})
		.attr("display", "none")

		.html(function(d) {
			if (that.checkedLegend == "roadstat") {
				return that.statusObject[d[that.checkedLegend]];
			} else {
				return d[that.checkedLegend];
			}
		})
		.style("fill", "white")
};

TMapDistanceAxisLineChart.prototype.setFormmatType = function() {

	var that = this;
	var formmatType;

	switch(that.checkedLegend) {
		case "temperature":
			formmatType = "";
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
			result = "";
			break;
		case "roadsurfaceheight":
			break;
		case "roadtemperature":
			break;
		case "roadfreezingtemperature":
			break;
		case "roadhumidity":
			formmatType = "%";
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

	return formmatType;
};

TMapDistanceAxisLineChart.prototype.setChartType = function(type, status) {
	this.chartType[type] = status;
};

TMapDistanceAxisLineChart.prototype.redraw = function() {

	var that = this;

	that.g.select(".area").remove();
	that.g.select(".line").remove();

	that.g.append("path")
		.data([that.locationInfo])
		.attr("class", "line")
		//.attr("interplate", "monotone")
		.style("stroke", that.color)
		.attr("d", that.line);

	for(var type in that.chartType) {

		var status = that.chartType[type];

		if (type == "area") {
			if (status) {
				/*if (that.chartType.step) {
					that.area.curve(d3.curveStep);
				} else {
					that.area.curve(d3.curveNatural);
				}*/
				that.g.append("path")
					.data([that.locationInfo])
					.attr("class", "area")
					.attr("d", that.area)
					.style("fill", that.color)
			}

		}
		else if (type == "step") {
			if (status) {
				that.line.curve(d3.curveStep);
				if (that.chartType.area) that.area.curve(d3.curveStep);
			} else {
				var linetype;
				if (that.checkedLegend == "roadstat") {
					linetype = d3.curveLinear
				} else {
					linetype = d3.curveNatural
				}

				that.line.curve(linetype);
				if (that.chartType.area) {
					that.area.curve(linetype);
				}
			}

			that.g.select(".line").attr("d", that.line);
			if (that.chartType.area) that.g.select(".area").attr("d", that.area);

		}
	}
};
