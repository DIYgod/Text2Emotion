# Text2Emotion

> 分析一句话的情绪值

## 介绍

Demo：https://api.prprpr.me/emotion?text=我今天很开心

以讯飞分词接口和大连理工的情感词汇本体库为基础，分析一句话的情绪值。

## 使用

https://api.prprpr.me/emotion?text={一句话}

## 搭建

需要环境：Node.js MongoDB

把`emos.json`导入 MongoDB：
```
mongoimport -d emotion -c emos --file emos.json
```

## LICENSE

MIT © [DIYgod](http://github.com/DIYgod)