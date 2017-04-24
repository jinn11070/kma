package kma

import grails.converters.JSON

class KmaController {
	def new0003() {
	}

	def getTime() {
		def currentTime = new Date()

		currentTime = currentTime.format("yyyy-MM-dd HH:mm:ss", TimeZone.getTimeZone('Asia/Seoul'))

		render currentTime
		return
	}

	def getData() {

		def startDate = params.startDate
		def endDate = params.endDate

		println startDate
		println endDate

		def fixList = Observer.executeQuery(
				"select new map(" +
					"CONCAT(REPLACE(lon,'.','_'),'-',REPLACE(lat,'.','_')) as name, " +
					"title as title, " +
					"observerType as observerType, " +
					"lon as lon, " +
					"lat as lat, " +
					"temperature as temperature, " +
					"pressure as pressure, " +
					"rainfall as rainfall, " +
					"winddirectionTxt as winddirection, " +
					"windvelocity as windvelocity, " +
					"squalldirection as squalldirection, " +
					"squallvelocity as squallvelocity, " +
					"roadstat as roadstat, " +
					"roadsurfaceheight as roadsurfaceheight, " +
					"roadtemperature as roadtemperature, " +
					"roadfreezingtemperature as roadfreezingtemperature, " +
					"roadhumidity as roadhumidity, " +
					"roadfreezingrate as roadfreezingrate, " +
					"roadfriction as roadfriction, " +
					"visibility as visibility, " +
					"date as date" +
				") from Observer " +
				"where STR_TO_DATE(date, '%Y-%m-%d %k:%i') >= ? and STR_TO_DATE(date, '%Y-%m-%d %k:%i') <= ? " +
				"order by id",
				[startDate, endDate]
		)

		println fixList as JSON

		render fixList as JSON
		return
	}
}
