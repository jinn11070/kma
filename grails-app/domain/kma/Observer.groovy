package kma

class Observer {
	String observerType
	String date
	String record
	double winddirection
	float windvelocity
	double squalldirection
	float squallvelocity
	float temperature
	double roadhumidity
	double pressure
	long rainfall
	byte rainordry
	float roadtemperature
	float roadsurfaceheight
	float roadfreezingtemperature
	int roadsaltrate
	byte roadstat
	int roadfreezingrate
	int roadsnow
	float roadfriction
	String roadweatherTxt
	int visibility
	int pw
	String winddirectionTxt
	String rainordryTxt
	String roadstatTxt
	String lon
	String lat
	String title

	static mapping = {
		version false
	}

	static constraints = {
		observerType (blank: false, nullable: false)
		date (blank: true, size: 4..200, nullable: true)
		record (blank: true, nullable: true)
		winddirection (blank: true, nullable: true)
		windvelocity (blank: true, nullable: true)
		squalldirection (blank: true, nullable: true)
		squallvelocity (blank: true, nullable: true)
		temperature (blank: true, nullable: true)
		roadhumidity (blank: true, nullable: true)
		pressure (blank: true, nullable: true)
		rainfall (blank: true, nullable: true)
		rainordry (blank: true, nullable: true)
		roadtemperature (blank: true, nullable: true)
		roadsurfaceheight (blank: true, nullable: true)
		roadfreezingtemperature (blank: true, nullable: true)
		roadsaltrate (blank: true, nullable: true)
		roadstat (blank: true, nullable: true)
		roadfreezingrate (blank: true, nullable: true)
		roadsnow (blank: true, nullable: true)
		roadfriction (blank: true, nullable: true)
		roadweatherTxt (blank: true, nullable: true)
		visibility (blank: true, nullable: true)
		pw (blank: true, nullable: true)
		winddirectionTxt (blank: true, nullable: true)
		rainordryTxt (blank: true, nullable: true)
		roadstatTxt (blank: true, nullable: true)
		lon (blank: true, nullable: true)
		lat (blank: true, nullable: true)
		title (blank: true, nullable: true)
	}
}
