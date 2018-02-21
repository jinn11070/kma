create table cctv
(
	cam_id bigint not null,
	name varchar(255) null,
	roi_err varchar(255) null,
	w_code varchar(255) null,
	level tinyint null,
	fog_level int null,
	s_value int null,
	l_value int null,
	v_value int null,
	hsl int null,
	road_code int null
)
;

create table kma
(
	id bigint not null auto_increment
		primary key,
	date varchar(255) null,
	distance bigint null,
	lat double null,
	lon double null,
	name varchar(255) not null,
	observer varchar(255) null,
	pressure float null,
	rainfall int null,
	roadbed tinyint null,
	roadfreezingrate bigint null,
	roadfreezingtemperature float null,
	roadfriction float null,
	roadhumidity int null,
	roadsurfaceheight float null,
	roadtemperature float null,
	squalldirection varchar(255) null,
	squallvelocity float null,
	temperature float null,
	title varchar(255) null,
	visibility varchar(255) null,
	winddirection varchar(255) null,
	windvelocity float null
)
;

create table observer
(
	id bigint null,
	observer_type varchar(255) null,
	date varchar(255) null,
	record varchar(255) null,
	winddirection double null,
	windvelocity float unsigned null,
	squalldirection double null,
	squallvelocity float null,
	temperature float null,
	roadhumidity double null,
	pressure double null,
	rainfall bigint null,
	rainordry tinyint null,
	roadtemperature float null,
	roadsurfaceheight float null,
	roadfreezingtemperature float null,
	roadsaltrate int null,
	roadstat tinyint null,
	roadfreezingrate int null,
	roadsnow int null,
	roadfriction float null,
	roadweather_txt varchar(255) null,
	visibility int null,
	pw int null,
	winddirection_txt varchar(255) null,
	rainordry_txt varchar(255) null,
	roadstat_txt varchar(255) null,
	lon varchar(50) null,
	lat varchar(50) null,
	title varchar(255) null
)
;

