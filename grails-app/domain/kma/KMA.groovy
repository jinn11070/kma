package kma

class KMA {
	String name
	String title
	String observer
	double lat
	double lon
	float temperature
	float pressure
	int rainfall
	String winddirection
	float windvelocity
	String squalldirection
	float squallvelocity
	byte roadbed
	float roadsurfaceheight
	float roadtemperature
	float roadfreezingtemperature
	int roadhumidity
	long roadfreezingrate
	float roadfriction
	String visibility
	long distance
	String date

	static mapping = {
		version false
		id false
//		id column: 'id', type: 'String'
//		id generator: 'identity', name: 'name'
	}

	static constraints = {
		title blank: false, nullable: true
		observer blank: false, nullable: true
		lat blank: false, nullable: true
		lon blank: false, nullable: true
		temperature blank: false, nullable: true
		pressure blank: false, nullable: true
		rainfall blank: false, nullable: true
		winddirection blank: false, nullable: true
		windvelocity blank: false, nullable: true
		squalldirection blank: false, nullable: true
		squallvelocity blank: false, nullable: true
		roadbed blank: false, nullable: true
		roadsurfaceheight blank: false, nullable: true
		roadtemperature blank: false, nullable: true
		roadfreezingtemperature blank: false, nullable: true
		roadhumidity blank: false, nullable: true
		roadfreezingrate blank: false, nullable: true
		roadfriction blank: false, nullable: true
		visibility blank: false, nullable: true
		distance blank: false, nullable: true
		date blank: false, nullable: true
	}
}
