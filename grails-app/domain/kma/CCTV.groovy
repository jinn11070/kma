package kma

class CCTV {
	long camId
	String name
	String roiErr
	String wCode
	byte level
	int fogLevel
	int sValue
	int lValue
	int vValue
	int hsl
	int roadCode

	static mapping = {
		version false
		id generator: 'identity', name:'camId'
	}

	static constraints = {
		camId (blank: true, nullable: true)
		name (blank: true, nullable: true)
		roiErr (blank: true, nullable: true)
		wCode (blank: true, nullable: true)
		level (blank: true, nullable: true)
		fogLevel (blank: true, nullable: true)
		sValue (blank: true, nullable: true)
		lValue (blank: true, nullable: true)
		vValue (blank: true, nullable: true)
		hsl (blank: true, nullable: true)
		roadCode (blank: true, nullable: true)
	}
}
