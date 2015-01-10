
// 사용예) $>node app.js stage

var config = {
	local: {
		mode: 'local',
		port: 8000,
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

var auth = {
	TOKEN_SECRET: process.env.TOKEN_SECRET || 'A hard to guess string',

	FACEBOOK_SECRET: process.env.FACEBOOK_SECRET || 'Facebook App Secret',
	FOURSQUARE_SECRET: process.env.FOURSQUARE_SECRET || 'Foursquare Client Secret',
	GOOGLE_SECRET: process.env.GOOGLE_SECRET || 'Google Client Secret',
	GITHUB_SECRET: process.env.GITHUB_SECRET || 'GitHub Client Secret',
	LINKEDIN_SECRET: process.env.LINKEDIN_SECRET || 'LinkedIn Client Secret',
	WINDOWS_LIVE_SECRET: process.env.WINDOWS_LIVE_SECRET || 'Windows Live Secret',
	TWITTER_KEY: process.env.TWITTER_KEY || 'Twitter Consumer Key',
	TWITTER_SECRET: process.env.TWITTER_SECRET || 'Twitter Consumer Secret',
	TWITTER_CALLBACK: process.env.TWITTER_CALLBACK || 'Twitter Callback Url',
	YAHOO_SECRET: process.env.YAHOO_SECRET || 'Yahoo Client Secret'
};

module.exports = {
	server : function(mode) {
		mode = mode || process.argv[2] || 'local';
		return config[mode];
	},
	auth : auth
};








