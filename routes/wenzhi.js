var url = require('url');
var fetch = require('node-fetch');
var crypto = require('crypto');
var logger = require('../tools/logger');
var danmaku = require('../models/emotion');
var redis = require('../tools/redis');
var config = require('../config');
var wzSecretId = config.wzSecretId;
var wzSecretKey = config.wzSecretKey;
var wzPassWord = config.wzPassWord;

module.exports = function (req, res) {
    var ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    var query = url.parse(req.url,true).query;
    var text = query.text;
    var password = query.password;

    if (password !== wzPassWord) {
        var emotion = {
            code: 0,
            msg: '口令错误'
        };
        var sendEmotion = JSON.stringify(emotion);
        res.send(sendEmotion);
        return;
    }

    redis.client.get(`Text2EmotionWZ${text}`, function(err, reply) {
        if (reply) {
            logger.info(`Text2Emotion WZ text ${text} form redis, IP: ${ip}`);
            res.send(reply);
        }
        else {
            logger.info(`Text2Emotion WZ ${text} form origin, IP: ${ip}`);

            var random = parseInt(Math.random()* 10000, 10) + 1;
            var timestamp = Math.floor(Date.now() /1000);

            var srcURL = `GETwenzhi.api.qcloud.com/v2/index.php?Action=TextSentiment&Nonce=${random}&Region=sz&SecretId=${wzSecretId}&Timestamp=${timestamp}&content=${text}`;
            var hash = crypto.createHmac('sha1', wzSecretKey).update(srcURL).digest();
            var sign = new Buffer(hash).toString('base64');

            fetch(`https://wenzhi.api.qcloud.com/v2/index.php?Action=TextSentiment&Nonce=${random}&Region=sz&SecretId=${wzSecretId}&Timestamp=${timestamp}&Signature=${encodeURIComponent(sign)}&content=${encodeURIComponent(text)}`).then(
                response => response.json()
            ).then((data) => {
                    var sendEmotion = JSON.stringify(data);
                    res.send(sendEmotion);
                    redis.set(`Text2EmotionWZ${text}`, sendEmotion);
                }
            ).catch(
                e => logger.error("Text2Emotion WZ Error: get wzapi", e)
            );
        }
    });
};