
// 사용예) $>node app.js stage

var config = {
	development: {
		mode: 'development',
		port: 3000,
		database: {
			type: "mongodb",
			host: '127.0.0.1',
			port: process.env.PORT || 27017
		}
	},
	stage: {
		mode: 'stage',
		port: 4000,
		database: {
			type: "mongodb",
			host: '127.0.0.1',
			port: process.env.PORT || 27017
		}
	},
	production: {
		mode: 'production',
		port: 5000,
		database: {
			type: "mongodb",
			host: '127.0.0.1',
			port: process.env.PORT || 27017
		}
	}
};

// https://www.npmjs.com/package/satellizer
var auth = {
	
	TOKEN_SECRET: process.env.TOKEN_SECRET || 'A hard to guess string',

	// Google Client Secret
	GOOGLE_SECRET: process.env.GOOGLE_SECRET || 'ZlCsE7fazbW_WdevCP9yp2AP',
	// Facebook App Secret
	FACEBOOK_SECRET: process.env.FACEBOOK_SECRET || 'f968cea09f67d43f0dac0d4df3d3ec89',

	// Twitter Consumer Key
	TWITTER_KEY: process.env.TWITTER_KEY || '2t65a5w1OTvKUyEsOtsROMu4b',
	// Twitter Consumer Secret
	TWITTER_SECRET: process.env.TWITTER_SECRET || 'sCWkFzzVEOPPWuTGBPfkVQRWw8vFx1DKBxyaage9oBlvzwkob3',
	// Twitter Callback Url
	// http://127.0.0.1:3000/client/templates/auth/twitter_callback.html
	// http://127.0.0.1:3000/history - http://bit.ly/1ybndS8
	TWITTER_CALLBACK: process.env.TWITTER_CALLBACK || 'http://bit.ly/1ybndS8',

	/*
	// Windows Live Secret
	WINDOWS_LIVE_SECRET: process.env.WINDOWS_LIVE_SECRET || 'Windows Live Secret',
	FOURSQUARE_SECRET: process.env.FOURSQUARE_SECRET || 'Foursquare Client Secret',
	GITHUB_SECRET: process.env.GITHUB_SECRET || 'GitHub Client Secret',
	LINKEDIN_SECRET: process.env.LINKEDIN_SECRET || 'LinkedIn Client Secret',
	YAHOO_SECRET: process.env.YAHOO_SECRET || 'Yahoo Client Secret'
	*/
};

module.exports = {
	server : function(mode) {
		mode = mode || process.argv[2] || 'development';
		return config[mode];
	},
	auth : auth
};








