const Config = {
    ttAppId: 'testAppId',
    ttSecret: 'testAppSecret',
    ttBaseUrl: 'https://developer.toutiao.com/api/apps',
    sessionExpires: 86400,
    maxPageSize: 10,

    chatServers: [
        {
            'apiUrl': 'http://127.0.0.1:5000/api',
            'wsUrl': 'ws://127.0.0.1:5000/ws/liveRoom',
        }
    ]
};

module.exports = Config;