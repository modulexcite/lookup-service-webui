////////////////////////////////////////
// Utility Functions
////////////////////////////////////////

Array.prototype.contains = function(key) {
	for (var i = 0 ; i < this.length ; i++)
	{
		if(this[i] === key)
			return true;
	}
	return false;
};

Array.prototype.unique = function() {
	var unique = [];
	for (var i = 0 ; i < this.length ; i++)
	{
		if(!unique.contains(this[i]))
			unique.push(this[i]);
	}
	return unique; 
};

function compareHostnames(hostname_a, hostname_b)
{
	order = {
		"Hostname": 0,
		"IPv4": 1,
		"IPv6": 2
	};
	hostname_a = hostname_a.replace("-v6", "~");
	hostname_b = hostname_b.replace("-v6", "~");
	order_a = order[getAddressType(hostname_a)];
	order_b = order[getAddressType(hostname_b)];
	return order_a > order_b ? 1 : order_a < order_b ? -1 : hostname_a > hostname_b ? 1 : hostname_a < hostname_b ? -1 : 0;
}

function getAddressType(address)
{
	var IPv4Format = /^\[?([\d]{1,3}\.){3}[\d]{1,3}\]?(:\d*){0,1}$/;
	var IPv6Format = /^\[?([\da-fA-F]{0,4}:){3,7}[\da-fA-F]{0,4}\]?(:\d*){0,1}$/;
	if (IPv4Format.test(address))
		return "IPv4";
	else if (IPv6Format.test(address))
		return "IPv6";
	else
		return "Hostname";
}

function getHostnameFromURL(url)
{
	var hostname = getURLParser(url).hostname;
	if ((hostname) && (hostname != window.location.hostname))
		return hostname.replace(/[\[\]]+/g, "");
	else
		return url;
}

function getURLParser(url)
{
	var parser = document.createElement("a");
	parser.href = url;
	return parser;
}

function parseMetricPrefix(prefix)
{
	var shortPrefixes = [ "K", "M", "G", "T", "P", "E", "Z", "Y" ];
	var longPrefixes = [ "kilo", "mega", "giga", "tera", "peta", "exa", "zetta", "yotta" ];
	var power = 0;
	if (prefix.length > 0)
	{
		if (prefix.length > 1)
		{
			prefix = prefix.toLowerCase();
			power = ($.inArray(prefix, longPrefixes) + 1) * 3;
		}
		else
		{
			prefix = prefix.toUpperCase();
			power = ($.inArray(prefix, shortPrefixes) + 1) * 3;
		}
		if (power == 0)
			power = NaN;
	}
	return Math.pow(10, power);
}

function parseRate(rateString, nounit)
{
	var units = [ "b/s", "bit/s", "bps" ];
	var rate = parseUnitString(rateString, units, nounit);
	return rate != NaN ? rate + units[1] : null;
}

function parseSize(sizeString, nounit)
{
	var units = [ "byte", "bytes", "B" ];
	var size = parseUnitString(sizeString, units, nounit) ;
	return size != NaN ? size + units[1] : null;
}

function parseSpeed(speedString, nounit)
{
	var units = [ "hertz", "Hz" ];
	var speed = parseUnitString(speedString, units, nounit);
	return speed != NaN ? speed + units[1] : null;
}

function parseUnitString(unitString, units, nounit)
{
	var parser = new RegExp("^(\\d+\\.?\\d*)\\s*(.+)?(" + units.join("|") + ")$", "i");
	var parts = unitString.match(parser);
	if ((!parts) && (nounit))
	{
		parser = new RegExp("^(\\d+\\.?\\d*)\\s*(.+)?$", "i")
		parts = unitString.match(parser);
	}
	if ((!parts) || (parts.length < 3))
		return NaN;
	var number = parseFloat(parts[1]);
	var prefix = parts[2];
	if (prefix)
		number *= parseMetricPrefix(prefix);
	return Math.round(number);
}

function getCountryString(country)
{
	var countryCodes = {
		"AC": "Ascension Island",
		"AD": "Andorra",
		"AE": "United Arab Emirates",
		"AF": "Afghanistan",
		"AG": "Antigua and Barbuda",
		"AI": "Anguilla",
		"AL": "Albania",
		"AM": "Armenia",
		"AN": "Netherlands Antilles",
		"AO": "Angola",
		"AQ": "Antarctica",
		"AR": "Argentina",
		"AS": "American Samoa",
		"AT": "Austria",
		"AU": "Australia",
		"AW": "Aruba",
		"AZ": "Azerbaijan",
		"BA": "Bosnia and Herzegovina",
		"BB": "Barbados",
		"BD": "Bangladesh",
		"BE": "Belgium",
		"BF": "Burkina Faso",
		"BG": "Bulgaria",
		"BH": "Bahrain",
		"BI": "Burundi",
		"BJ": "Benin",
		"BM": "Bermuda",
		"BN": "Brunei",
		"BO": "Bolivia",
		"BR": "Brazil",
		"BS": "Bahamas",
		"BT": "Bhutan",
		"BV": "Bouvet Island",
		"BW": "Botswana",
		"BY": "Belarus",
		"BZ": "Belize",
		"CA": "Canada",
		"CC": "Cocos (Keeling) Islands",
		"CD": "Congo, Democratic People's Republic",
		"CF": "Central African Republic",
		"CG": "Congo, Republic of",
		"CH": "Switzerland",
		"CI": "C&ocirc;te d'Ivoire",
		"CK": "Cook Islands",
		"CL": "Chile",
		"CM": "Cameroon",
		"CN": "China",
		"CO": "Colombia",
		"CR": "Costa Rica",
		"CU": "Cuba",
		"CV": "Cape Verde",
		"CX": "Christmas Island",
		"CY": "Cyprus",
		"CZ": "Czech Republic",
		"DE": "Germany",
		"DJ": "Djibouti",
		"DK": "Denmark",
		"DM": "Dominica",
		"DO": "Dominican Republic",
		"DZ": "Algeria",
		"EC": "Ecuador",
		"EE": "Estonia",
		"EG": "Egypt",
		"EH": "Western Sahara",
		"ER": "Eritrea",
		"ES": "Spain",
		"ET": "Ethiopia",
		"FI": "Finland",
		"FJ": "Fiji",
		"FK": "Falkland Islands (Malvina)",
		"FM": "Micronesia, Federal State of",
		"FO": "Faroe Islands",
		"FR": "France",
		"GA": "Gabon",
		"GD": "Grenada",
		"GE": "Georgia",
		"GF": "French Guiana",
		"GG": "Guernsey",
		"GH": "Ghana",
		"GI": "Gibraltar",
		"GL": "Greenland",
		"GM": "Gambia",
		"GN": "Guinea",
		"GP": "Guadeloupe",
		"GQ": "Equatorial Guinea",
		"GR": "Greece",
		"GS": "South Georgia and the South Sandwich Islands",
		"GT": "Guatemala",
		"GU": "Guam",
		"GW": "Guinea-Bissau",
		"GY": "Guyana",
		"HK": "Hong Kong",
		"HM": "Heard and McDonald Islands",
		"HN": "Honduras",
		"HR": "Croatia/Hrvatska",
		"HT": "Haiti",
		"HU": "Hungary",
		"ID": "Indonesia",
		"IE": "Ireland",
		"IL": "Israel",
		"IM": "Isle of Man",
		"IN": "India",
		"IO": "British Indian Ocean Territory",
		"IQ": "Iraq",
		"IR": "Iran",
		"IS": "Iceland",
		"IT": "Italy",
		"JE": "Jersey",
		"JM": "Jamaica",
		"JO": "Jordan",
		"JP": "Japan",
		"KE": "Kenya",
		"KG": "Kyrgyzstan",
		"KH": "Cambodia",
		"KI": "Kiribati",
		"KM": "Comoros",
		"KN": "Saint Kitts and Nevis",
		"KP": "North Korea",
		"KR": "South Korea",
		"KW": "Kuwait",
		"KY": "Cayman Islands",
		"KZ": "Kazakstan",
		"LA": "Laos",
		"LB": "Lebanon",
		"LC": "Saint Lucia",
		"LI": "Liechtenstein",
		"LK": "Sri Lanka",
		"LR": "Liberia",
		"LS": "Lesotho",
		"LT": "Lithuania",
		"LU": "Luxembourg",
		"LV": "Latvia",
		"LY": "Lybia",
		"MA": "Morocco",
		"MC": "Monaco",
		"MD": "Modolva",
		"MG": "Madagascar",
		"MH": "Marshall Islands",
		"MK": "Macedonia, Former Yugoslav Republic",
		"ML": "Mali",
		"MM": "Myanmar",
		"MN": "Mongolia",
		"MO": "Macau",
		"MP": "Northern Mariana Islands",
		"MQ": "Martinique",
		"MR": "Mauritania",
		"MS": "Montserrat",
		"MT": "Malta",
		"MU": "Mauritius",
		"MV": "Maldives",
		"MW": "Malawi",
		"MX": "Mexico",
		"MY": "Maylaysia",
		"MZ": "Mozambique",
		"NA": "Namibia",
		"NC": "New Caledonia",
		"NE": "Niger",
		"NF": "Norfolk Island",
		"NG": "Nigeria",
		"NI": "Nicaragua",
		"NL": "Netherlands",
		"NO": "Norway",
		"NP": "Nepal",
		"NR": "Nauru",
		"NU": "Niue",
		"NZ": "New Zealand",
		"OM": "Oman",
		"PA": "Panama",
		"PE": "Peru",
		"PF": "French Polynesia",
		"PG": "Papua New Guinea",
		"PH": "Philippines",
		"PK": "Pakistan",
		"PL": "Poland",
		"PM": "St. Pierre and Miquelon",
		"PN": "Pitcairn Island",
		"PR": "Puerto Rico",
		"PS": "Palestinian Territories",
		"PT": "Portugal",
		"PW": "Palau",
		"PY": "Paraguay",
		"QA": "Qatar",
		"RE": "Reunion",
		"RO": "Romania",
		"RU": "Russian Federation",
		"RW": "Twanda",
		"SA": "Saudi Arabia",
		"SB": "Solomon Islands",
		"SC": "Seychelles",
		"SU": "Sudan",
		"SE": "Sweden",
		"SG": "Singapore",
		"SH": "St. Helena",
		"SI": "Slovenia",
		"SJ": "Svalbard and Jan Mayan Islands",
		"SK": "Slovakia",
		"SL": "Sierra Leone",
		"SM": "San Marino",
		"SN": "Senegal",
		"SO": "Somalia",
		"SR": "Suriname",
		"ST": "S&atilde;o Tome and Principe",
		"SV": "El Salvador",
		"SY": "Syria",
		"SZ": "Swaziland",
		"TC": "Turks and Ciacos Islands",
		"TD": "Chad",
		"TF": "French Southern Territories",
		"TG": "Togo",
		"TH": "Thailand",
		"TJ": "Tajikistan",
		"TK": "Tokelau",
		"TM": "Turkmenistan",
		"TN": "Tunisia",
		"TO": "Tonga",
		"TP": "East Timor",
		"TR": "Turkey",
		"TT": "Trinidad and Tobago",
		"TV": "Tuvalu",
		"TW": "Taiwan",
		"TZ": "Tanzania",
		"UA": "Ukraine",
		"UG": "Uganda",
		"UK": "UK",
		"UM": "US Minor Outlying Islands",
		"US": "USA",
		"UY": "Uruguay",
		"UZ": "Uzbekistan",
		"VA": "Vatican City",
		"VC": "Saint Vincent and the Grenadines",
		"VE": "Venezuela",
		"VG": "British Virgin Islands",
		"VI": "US Virgin Islands",
		"VN": "Vietnam",
		"VU": "Vanuatu",
		"WF": "Wallis and Futuna Islands",
		"WS": "Western Samoa",
		"YE": "Yemen",
		"YT": "Mayotte",
		"YU": "Yugoslavia",
		"ZA": "South Africa",
		"ZM": "Zambia",
		"ZR": "Zaire",
		"ZW": "Zimbabwe"
	};
	if (countryCodes[country])
		return countryCodes[country];
	else
		return country;
}

function getStateString(state)
{
	var stateCodes = {
		"AL": "Alabama",
		"AK": "Alaska",
		"AZ": "Arizona",
		"AR": "Arkansas",
		"CA": "California",
		"CO": "Colorado",
		"CT": "Connecticut",
		"DE": "Delaware",
		"FL": "Florida",
		"GA": "Georgia",
		"HI": "Hawaii",
		"ID": "Idaho",
		"IL": "Illinois",
		"IN": "Indiana",
		"IA": "Iowa",
		"KS": "Kansas",
		"KY": "Kentucky",
		"LA": "Louisiana",
		"ME": "Maine",
		"MD": "Maryland",
		"MA": "Massachusetts",
		"MI": "Michigan",
		"MN": "Minnesota",
		"MS": "Mississippi",
		"MO": "Missouri",
		"MT": "Montana",
		"NE": "Nebraska",
		"NV": "Nevada",
		"NH": "New Hampshire",
		"NJ": "New Jersey",
		"NM": "New Mexico",
		"NY": "New York",
		"NC": "North Carolina",
		"ND": "North Dakota",
		"OH": "Ohio",
		"OK": "Oklahoma",
		"OR": "Oregon",
		"PA": "Pennsylvania",
		"RI": "Rhode Island",
		"SC": "South Carolina",
		"SD": "South Dakota",
		"TN": "Tennessee",
		"TX": "Texas",
		"UT": "Utah",
		"VT": "Vermont",
		"VA": "Virginia",
		"WA": "Washington",
		"WV": "West Virginia",
		"WI": "Wisconsin",
		"WY": "Wyoming"
	};
	if (stateCodes[state])
		return stateCodes[state];
	else
		return state;
}