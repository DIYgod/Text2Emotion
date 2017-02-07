var mongoose = require('../tools/mongodb');
var emotionSchema = new mongoose.Schema({
    word: String,
    type: String,
    emotion: String,
    strength: Number,
    polarity: Number
});
var emotion = mongoose.model('emo', emotionSchema);

module.exports = emotion;