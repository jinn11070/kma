import kma.KMA

class BootStrap {

    def init = { servletContext ->

		/*def grailsApplication = grails.util.Holders.getGrailsApplication()

		if (KMA.count() != 0) {
			KMA.executeUpdate('delete from KMA')
		}

		*//* kma *//*
		def idx = 1;
		def cctvFilePath = "resources/cctv_test.csv"
		def moveFilePath = "resources/move.csv"
		def fixFilePath = "resources/fix.csv"

		def cctvFile = grailsApplication.mainContext.getResource("classpath:$cctvFilePath").file
		def moveFile = grailsApplication.mainContext.getResource("classpath:$moveFilePath").file
//		def fixFile = grailsApplication.mainContext.getResource("classpath:$fixFilePath").file

		def direction = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]
		def opserverList = ["cctv", "move", "fix"]

		moveFile.splitEachLine(',') { fields ->

			println "======"
			println fields[0]
//			println new Date().parse("yyyy-MM-dd'T'HH:mm:ss'Z'", fields[0], TimeZone.getTimeZone('Asia/Seoul'))
			println new Date().parse("yyyy-MM-dd HH:mm", fields[0], TimeZone.getTimeZone('Asia/Seoul'))

			def kma = new KMA(
					name: fields[17].replace(".","_") + "+" + fields[18].replace(".","_"),
					title: "원주대학교 창업보육센터",
					observer: opserverList[1],
					lon: fields[18],
					lat: fields[17],
					temperature: fields[4],
					pressure: fields[6],
					rainfall: fields[7],
					winddirection: fields[20],
					windvelocity: fields[3],
					squalldirection: null,
					squallvelocity: null,
					roadbed: fields[21],
					roadsurfaceheight: fields[11],
					roadtemperature: fields[8],
					roadfreezingtemperature: fields[13],
					roadhumidity: fields[10],
					roadfreezingrate: fields[13],
					roadfriction: fields[14],
					visibility: fields[15],
					distance: null,
					date: new Date().parse("yyyy-MM-dd HH:mm", fields[0], TimeZone.getTimeZone('Asia/Seoul'))
			)

			kma.validate()

			*//*if (kma.hasErrors()){
				log.debug("Could not import line ${idx} due to ${kma.errors}")
			} else {
				log.debug("Importing line ${idx}: ${kma.toString()}")
				kma.save(failOnError: true)
			}*//*

			kma.save(failOnError: true)

		}*/


		/* 가라데이터 */
/*
//		def currentTime = new Date().format("yyyy-MM-dd HH:mm:ss", TimeZone.getTimeZone('Asia/Seoul'))
		def currentTime = new Date()
		def prev24Time;

		currentTime.downto(currentTime - 1) {
//			prev24Time = it.format("yyyy-MM-dd HH:mm:ss", TimeZone.getTimeZone('Asia/Seoul'))
			prev24Time = it
		}

		/ *time array *//*

		def calendar = new GregorianCalendar()
		def currentCal = new GregorianCalendar()
		calendar.setTime(prev24Time);
		currentCal.setTime(currentTime);
		currentCal.add(Calendar.HOUR, +1);

		def gettime;

		while ((gettime = calendar.getTime()).before(currentCal.getTime()))
		{
			Date result = gettime;
			println result

			File.splitEachLine(',') { fields ->

				def kma = new KMA(
						name: fields[1].replace(".","_") + "+" + fields[0].replace(".","_"), //128_6672318+37_68574939,
						title: fields[2] + " 지점",
						observer: opserverList[new Random().nextInt(3)],
						lon: fields[0],
						lat: fields[1],
						temperature: Math.round(new Random().nextFloat()*10) / 10,
						pressure: Math.round(new Random().nextFloat()*10) / 10,
						rainfall: Math.abs(new Random().nextInt(100) + 1),
						winddirection: direction[Math.abs(new Random().nextInt(direction.size()))],
						windvelocity: Math.round(new Random().nextFloat()*10) / 10,
						squalldirection: direction[Math.abs(new Random().nextInt(direction.size()))],
						squallvelocity: Math.round(new Random().nextFloat()*10) / 10,
						roadbed: Math.abs(new Random().nextInt(7) + 1),
						roadsurfaceheight: Math.round(new Random().nextFloat()*10) / 10,
						roadtemperature: Math.round(new Random().nextFloat()*10) / 10,
						roadfreezingtemperature: Math.round(new Random().nextFloat()*10) / 10,
						roadhumidity: Math.abs(new Random().nextInt(100) + 1),
						roadfreezingrate: Math.abs(new Random().nextInt(100) + 1),
						roadfriction: Math.round(new Random().nextFloat()*10) / 10,
						visibility: new Random().nextInt(100000) + 1,
						distance: new Random().nextInt(100000) + 1,
						date: result.format("yyyy-MM-dd HH:mm:ss", TimeZone.getTimeZone('Asia/Seoul'))
				)

				kma.validate()

				if (kma.hasErrors()){
					log.debug("Could not import line ${idx} due to ${kma.errors}")
				} else {
					log.debug("Importing line ${idx}: ${kma.toString()}")
					kma.save(failOnError: true)
				}

			}

			calendar.add(Calendar.HOUR, 1);

			idx++
		}
*/

	}
    def destroy = {
    }
}
