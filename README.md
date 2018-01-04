# Text2Emotion

> 分析一句话的情绪值



## 介绍

有两种版本：

- 以讯飞分词接口和大连理工的情感词汇本体库为基础，分析一句话的情绪值。 https://api.prprpr.me/emotion?text=我今天很开心

- 腾讯文智自然语言处理（收费服务）。 https://api.prprpr.me/emotion/wenzhi?password=DIYgod&text=小拳拳捶你胸口

## 使用

https://api.prprpr.me/emotion?text={一句话}

https://api.prprpr.me/emotion/wenzhi?password=DIYgod&text={一句话}

## 搭建

需要环境：Node.js MongoDB Redis

把`emos.json`导入 MongoDB：
```
mongoimport -d emotion -c emos --file emos.json
```

根目录需要新建配置文件 `config.js`

```
module.exports = {
    xfkey: '',        // 讯飞开放平台密钥
    wzSecretId: '',   // 腾讯云API密钥 - SecretId
    wzSecretKey: '',  // 腾讯云API密钥 - SecretKey
    wzPassWord: ''    // 腾讯文智版调用口令
};
```

## LICENSE

MIT © [DIYgod](http://github.com/DIYgod)