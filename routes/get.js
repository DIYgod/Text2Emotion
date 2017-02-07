var url = require('url');
var fetch = require('node-fetch');
var logger = require('../tools/logger');
var danmaku = require('../models/emotion');
var redis = require('../tools/redis');
var xfkey = require('../config').xfkey;

module.exports = function (req, res) {
    var ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    var query = url.parse(req.url,true).query;
    var text = query.text;

    redis.client.get(`Text2Emotion${text}`, function(err, reply) {
        if (reply) {
            logger.info(`Text2Emotion text ${text} form redis, IP: ${ip}`);
            res.send(reply);
        }
        else {
            logger.info(`Text2Emotion id ${text} form origin, IP: ${ip}`);
            
            fetch(`http://ltpapi.voicecloud.cn/analysis/?api_key=${xfkey}&text=${encodeURIComponent(text)}&pattern=pos&format=json`).then(
                response => response.json()
            ).then((data) => {
                    var words = [];
                    for (let i = 0; i < data[0].length; i++) {
                        words = words.concat(data[0][i]);
                    }
                    var pureWords = [];
                    var emotionNum = 0;
                    var last = 0;
                    for (let i = 0; i < words.length; i++) {
                        pureWords.push(words[i].cont);
                        if (words[i].pos !== 'wp' && !/[a-zA-Z0-9]/.test(words[i].cont)) {
                            last = i;
                            
                            danmaku.find({word: words[i].cont}, function (err, data) {
                                if (err) {
                                    logger.error(err);
                                }
                                if (data.length) {
                                    if (data[0].polarity === 1) {
                                        emotionNum += data[0].strength;
                                    }
                                    else if (data[0].polarity === 2) {
                                        emotionNum -= data[0].strength;
                                    }
                                    if (i === last) {
                                        var emotion = {
                                            code: 1,
                                            emotion: emotionNum,
                                            words: pureWords
                                        };
                                        var sendEmotion = JSON.stringify(emotion);
                                        res.send(sendEmotion);

                                        redis.set(`Text2Emotion${text}`, sendEmotion);
                                    }
                                }
                                else {
                                    if (i === last) {
                                        var emotion = {
                                            code: 1,
                                            emotion: emotionNum,
                                            words: pureWords
                                        };
                                        var sendEmotion = JSON.stringify(emotion);
                                        res.send(sendEmotion);

                                        redis.set(`Text2Emotion${text}`, sendEmotion);
                                    }
                                }
                            })
                        }
                    }
                }
            ).catch(
                e => logger.error("Text2Emotion Error: get xfapi", e)
            );
        }
    });
};