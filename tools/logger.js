var log4js = require('log4js');
log4js.configure({
    appenders: [
        {
            type: "file",
            filename: 'logs/Text2Emotion.log',
            maxLogSize: 20480,
            backups: 3,
            category: [ 'Text2Emotion','console' ]
        },
        {
            type: "console"
        }
    ],
    replaceConsole: true
});
var logger = log4js.getLogger('Text2Emotion');
logger.setLevel('INFO');

module.exports = logger;