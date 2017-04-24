<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8"/>
	<meta http-equiv="X-UA-Compatible" content="IE=Edge" />
	<asset:javascript src="/kma/jquery-1.9.1.js"/>
	<asset:javascript src="/kma/jquery-ui.min.js"/>
	<asset:stylesheet src="/kma/jquery-ui.min.css"/>

	<!-- d3 tmap -->
	<script  type="text/javascript" src="https://apis.skplanetx.com/tmap/js?version=1&format=javascript&appKey=282a5b3a-926e-3d8b-a535-43dafe9f51e8"></script>
	<asset:javascript src="/kma/d3/d3.min.js"/>
	<asset:javascript src="/kma/TMapChart.js"/>
	<asset:javascript src="/kma/TMapTimeAxisLineChart.js"/>
	<asset:javascript src="/kma/TMapDistanceAxisLineChart.js"/>
	<asset:javascript src="/kma/d3/d3.slider.js"/>

	<!-- icheck -->
	<asset:javascript src="/kma/icheck/icheck.min.js"/>
	<asset:stylesheet src="/kma/icheck/line/red.css"/>

	<!-- datetime picker -->
	<asset:javascript src="/kma/addonmaster/jquery-ui-timepicker-addon.min.js"/>
	<asset:javascript src="/kma/addonmaster/i18n/jquery-ui-timepicker-addon-i18n.min.js"/>
	<asset:javascript src="/kma/addonmaster/jquery-ui-sliderAccess.js"/>
	<asset:stylesheet src="/kma/addonmaster/jquery-ui-timepicker-addon.min.css"/>
	<asset:stylesheet src="/kma/timepicker.css"/>
	<asset:stylesheet src="/kma/line.css"/>

	<asset:javascript src="/kma/nav.js"/>
	<asset:javascript src="/kma/timmer.js"/>

	%{--<asset:stylesheet src="/kma/index_pc_kr.css"/>--}%
	<asset:stylesheet src="/kma/d3.slider.css"/>
	<asset:stylesheet src="/kma/sub-cpc_kr.css"/>
	%{--<asset:stylesheet src="/kma/dialog-style.css"/>--}%
	<asset:stylesheet src="/kma/tmap.css"/>
	<title>평창동계올림픽 스마트 기상지원 시스템</title>
</head>
<body>
<script type="text/javascript">

	$(document).ready(function() {

//		var tmapChart = new TMapChart(1300, 700);
		var tmapChart = new TMapChart(940, 500);

		tmapChart.setStartEndDateTime()
		tmapChart.getData();
		tmapChart.dataParsing();
		tmapChart.setCurrentTimeClock();

		tmapChart.draw();

		tmapChart.update();
		tmapChart.onClickMarker(tmapChart.popup, tmapChart.marker.events.element.id + "_innerImage");

		tmapChart.drawLineLegend($(".weatherInfo:checked").attr("id"));

		tmapChart.drawPlayer();

//		tmapChart.setViewPolyLineOrMarker($("input[name=observerType]:checked").val(), $("input[name=viewPolyLineOrMarker]:checked").val());

		/* click change */
		$(".weatherInfo").on("ifChecked", function(e) {
			var id = $(this).attr("id");

			var text = $(this).val();

			$(".item").html(text);

			var viewType = $("input[name=viewPolyLineOrMarker]:checked").val();
			if (viewType == "marker") {
				tmapChart.drawTimeAxisLineChart();
			} else {
				tmapChart.drawDistanceAxisLineChart();
			}
		});

		$("#applyDate").on("click", function() {
			tmapChart.setStartEndDateTime()
			tmapChart.getData()

			tmapChart.dataParsing();
			tmapChart.setCurrentTimeClock();

			tmapChart.draw();
			tmapChart.update();

			tmapChart.onClickMarker(tmapChart.popup, tmapChart.marker.events.element.id + "_innerImage");

			tmapChart.drawLineLegend($(".weatherInfo:checked").attr("id"));

			tmapChart.drawPlayer();
			tmapChart.setSliderTicks("#slider")

			tmapChart.setViewPolyLineOrMarker($("input[name=observerType]:checked").val(), $("input[name=viewPolyLineOrMarker]:checked").val());
		});

		/*$("input[name=viewRoadVisualData]").on("change", function() {
			tmapChart.setViewLineString($(this).is(":checked"), $("input[name=viewMarker]").is(":checked"));
		});
		$("input[name=viewMarker]").on("change", function() {
			tmapChart.setViewLineString($("input[name=viewRoadVisualData]").is(":checked"), $(this).is(":checked"));
		});*/
		$("input[name=viewPolyLineOrMarker]").on("change", function() {
			tmapChart.setViewPolyLineOrMarker($("input[name=observerType]:checked").val(), $("input[name=viewPolyLineOrMarker]:checked").val());
		});

		$("input[name=observerType]").on("change", function() {
			tmapChart.setViewMarkersByType($("input[name=observerType]:checked").val());
		});

		/* weatherInfo */
		$(".weatherInfo").each(function(){

			var self = $(this),
					label = self.next(),
					label_text = label.text();

			label.remove();
			self.iCheck({
				checkboxClass: 'icheckbox_line-red ' + self.attr("id"),
				radioClass: 'iradio_line-red ' + self.attr("id"),
				insert: '<div class="icheck_line-icon"></div>' + label_text
			});
		});
	});
</script>
<div id="wrap">
	<div id="header">
		<header>
			<div id="topnav">
				<dl class="topnav">
					<dt class="blind">top menu</dt>
					<!-- <dd><a href="/kr/forecast/main.do">Old site</a></dd> -->
					<dd><a href="/kr/specialized/wa.do">Weather alert</a></dd>

					<dd class="last"><a href="/setChangeLocale.do?locale=en&amp;url=/kr/main_pc.do">English</a></dd>
				</dl>
			</div><!--//topnav-->
			<div class="logos">
				<h1 id="logo"><a href="/kr/main_pc.do"><img src="/assets/kma/logo-kr.jpg" alt="logo"/></a></h1>
				<div id="count">
					<div id="D_100" class="count-img"></div>
					<div id="D_10" class="count-img"></div>
					<div id="D_1" class="count-img"></div>
					<div id="H_10" class="count-img"></div>
					<div id="H_1" class="count-img"></div>
					<div id="M_10" class="count-img"></div>
					<div id="M_1" class="count-img"></div>
					<div id="S_10" class="count-img"></div>
					<div id="S_1" class="count-img"></div>
				</div>
				<h1 id="ologo"><a href="http://www.pyeongchang2018.com/horizon/eng/index.asp" target="_blank">Pyeongchang olympic logo</a></h1>
			</div><!--//logos-->
			<nav class="navi">
				<h2 class="blind">main menu</h2>
				<ul id="gnb">
					<li class="m1"><a href="#" onmouseout="MM_swapImgRestore()" onmouseover="MM_swapImage('m1','','/assets/kma/gnb01-kr_over.jpg',1)"><img src="/assets/kma/gnb01-kr.jpg" alt="PyeongChang Mountain Cluster" width="310" height="38" id="m1" /></a>
						<ul>
							<li><a href="/kr/mountain/jac.do?std_id=111">- 알펜시아 스키점프 센터</a></li>
							<li><a href="/kr/mountain/jac.do?std_id=112">- 알펜시아 바이애슬론 센터</a></li>
							<li><a href="/kr/mountain/jac.do?std_id=114">- 알펜시아 크로스컨트리 센터</a></li>
							<li><a href="/kr/mountain/jac.do?std_id=113">- 알펜시아 슬라이딩 센터</a></li>
							<li><a href="/kr/mountain/jac.do?std_id=115">- 용평 알파인 경기장</a></li>
							<li><a href="/kr/mountain/jac.do?std_id=119">- 정선 알파인 경기장</a></li>
							<li><a href="/kr/mountain/jac.do?std_id=117">- 보광 스노 경기장</a></li>
							<!-- <li><a href="/kr/mountain/jac.do?std_id=118">- 보광 스노 경기장 (P)</a></li> -->
						</ul>
					</li>
					<li class="m2"><a href="#" onmouseout="MM_swapImgRestore()" onmouseover="MM_swapImage('m2','','/assets/kma/gnb02-kr_over.jpg',1)"><img src="/assets/kma/gnb02-kr.jpg" alt="Gangnueng Costal Cluster" width="320" height="38" id="m2" /></a>
						<ul id="m22">

							<li><a href="/kr/mountain/jac.do?std_id=116">- 강릉 올림픽 파크</a></li>
						</ul>
					</li>
					<li class="m3" style="z-index: 9999999999999"><a href="#" onmouseout="MM_swapImgRestore()" onmouseover="MM_swapImage('m3','','/assets/kma/gnb03-kr_over.jpg',1)"><img src="/assets/kma/gnb03-kr.jpg" alt="Specialised Information" width="310" height="38" id="m3" /></a>
						<ul>
							<li><a href="/kr/specialized/si.do">- 위성영상</a></li>
							<li><a href="/kr/specialized/ri.do">- 레이더영상</a></li>
							<li><a href="/kr/specialized/sc.do">- 적설</a></li>
							<li><a href="/kr/specialized/os.do">- 경기장별 통계 분석</a></li>
							<li><a href="/kr/specialized/wac.do">- 예상일기도</a></li>
							<li><a href="/kr/specialized/cpc.do">- 평창의기후</a></li>
							<li><a href="/kr/specialized/trs.do">- 성화봉송구간</a></li>
							<li><a href="/kr/specialized/wir.do">- 도로위험기상정보</a></li>
							<li><a href="/">- 도로기상 Dashboard</a></li>
						</ul>
					</li>
				</ul>
			</nav><!-- navs -->
		</header>
	</div>
	<div class="content1">
		<div id="title">
			<h2 class="small">특화정보</h2>
			<h2 class="big">도로기상 Dashboard</h2>
		</div>
		<a href="javascript:withforecast()"><img id="tschart" src="/assets/kma/help-kr.jpg" alt="Help"></a>
	</div>


	<div class="content2">
		<div style="height:20px;">
			<span style="float: right; font-size: 11px; font-weight: bold;">현재시각 <span id="clock" style="color: #64a8bc"></span>
			</span>
		</div>

		<table class="ds-table">
			<tr>
				<th>
					<span style="float: left">
						관측시작일시 <input type="text" id="startDate" style="color: #64a8bc" value="2017-01-01 0:10">
						~ 관측종료일시 <input type="text" id="endDate" style="color: #64a8bc" value="2017-01-01 0:25">
					</span>
					<button id="applyDate" class="speed">적용</button>
				</th>
			</tr>
			%{--<tr>
				<th>
					<img src="/assets/kma/map_info_content_title.png">
					<span id="location"></span>
					<span id="observer">
						<label for="all"><input type="radio" value="all" id="all" name="observerType" checked="checked"/>모두보기</label>
						<label for="fix"><input type="radio" value="fix" id="fix" name="observerType" />고정식</label>
						<label for="move"><input type="radio" value="move" id="move" name="observerType"/>이동식</label>
						<label for="cctv"><input type="radio" value="cctv" id="cctv" name="observerType"/>CCTV</label>
					</span>
				</th>
			</tr>--}%
			<tr id="weatherInfoRadioArea">
				<th>항목
					<input type="radio" value="노면상태" id="roadstat" class="weatherInfo" name="iCheck"/><label for="roadstat">노면상태</label>
					<input type="radio" value="노면온도" id="roadtemperature" class="weatherInfo" name="iCheck"/><label for="roadtemperature">노면온도</label>
					<input type="radio" value="노면습도" id="roadhumidity" class="weatherInfo" name="iCheck"/><label for="roadhumidity">노면습도</label>
					<input type="radio" value="노면마찰" id="roadfriction" class="weatherInfo" name="iCheck"/><label for="roadfriction">노면마찰</label>
					<input type="radio" value="노면수막높이" id="roadsurfaceheight" class="weatherInfo" name="iCheck"/><label for="roadsurfaceheight">노면수막높이</label>
					<input type="radio" value="노면동결온도" id="roadfreezingtemperature" class="weatherInfo" name="iCheck"/><label for="roadfreezingtemperature">노면동결온도</label>
					<input type="radio" value="노면결빙율" id="roadfreezingrate" class="weatherInfo" name="iCheck"/><label for="roadfreezingrate">노면결빙율</label>
					<input type="radio" value="시정" id="visibility" class="weatherInfo" name="iCheck"/><label for="visibility">시정</label>
					<input type="radio" value="기온" id="temperature" class="weatherInfo" name="iCheck"/><label for="temperature">기온</label>
					<input type="radio" value="기압" id="pressure" class="weatherInfo" name="iCheck"/><label for="pressure">기압</label>
					<input type="radio" value="강우량" id="rainfall" class="weatherInfo" name="iCheck"/><label for="rainfall">강우량</label>
				</th>
			</tr>
			<tr id="legendTitle">
				<th class="grey">
					<img src="/assets/kma/icon_map.png">&nbsp;<span class="item">노면상태</span>
					<label style="float: right" for="polyLine"><input type="radio" id="polyLine" value="polyLine" name="viewPolyLineOrMarker" />시계열 데이터 보기</label>
					<label style="float: right" for="marker"><input type="radio" id="marker" value="marker" name="viewPolyLineOrMarker" checked="checked"/>거점 데이터 보기</label>
				</th>
			</tr>
			<tr id="polyLegend" style="display:none;">
				<th>
					<ul></ul>
				</th>
			</tr>
			<tr id="markerLegend" style="display:none;">
				<th>
					<img src="/assets/kma/map_info_content_title.png">
					<span id="location"></span>
					<span id="observer">
						<label for="all"><input type="radio" value="all" id="all" name="observerType" checked="checked"/>모두보기</label>
						<label for="fix"><input type="radio" value="fix" id="fix" name="observerType" />고정식</label>
						<label for="move"><input type="radio" value="move" id="move" name="observerType"/>이동식</label>
						<label for="cctv"><input type="radio" value="cctv" id="cctv" name="observerType"/>CCTV</label>
					</span>
				</th>
			</tr>
			<tr>
				<th id="tmap">지도</th>
			</tr>
			<tr id="polyPlayer" style="display:none;">
				<td>
					<div style="margin-left: 25px; margin-right: 15px;">
						<button id="prev" class="playerBtn"></button>
						<button id="play" class="playerBtn"></button>
						<button id="next" class="playerBtn"></button>
						<button id="pause" class="playerBtn"></button>
					</div>
					<div id="timeBar">
						<form>
							<div style="height: 20px;">
								<div class="bar-left"></div><div id="slider"></div><div class="bar-right"></div>
							</div>
						</form>
					</div>
					<div style="position: relative; right: -7px;">
						<button id="slow" class="speed">SLOW</button>
						<button id="normal" class="speed" autofocus>NORMAL</button>
						<button id="fast" class="speed">FAST</button>
					</div>
				</td>
			</tr>
		</table>
		<br>
		<table class="ds-table">
			<tr>
				<th class="grey">
					<img src="/assets/kma/icon_chart.png">&nbsp;<span class="item">노면상태</span>
					<input type="checkbox" name="chartType" value="area">Area
					<input type="checkbox" name="chartType" value="step">Step
					<span style="float: right">
						관측시작일시 <span id="startDateText" style="color: #64a8bc"></span>
						~ 관측종료일시 <span id="endDateText" style="color: #64a8bc"></span>
					</span>
				</th>
			</tr>
			<tr id="timeLineChartDiv">
				<td></td>
			</tr>
			<tr id="distanceLineChartDiv">
				<td></td>
			</tr>
		</table>
	</div>
	<br>

	<div id="footer">
		<footer>
			<h1><img alt="bottom logo" src="/assets/kma/btm-logo-kr.jpg"></h1>
			<p class="copy"><img alt="bottom copy" src="/assets/kma/copy-kr.jpg"></p>
		</footer>
	</div>
</div>
</body>
</html>