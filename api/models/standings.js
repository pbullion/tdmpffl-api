const mongoose = require('mongoose');

const standingsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    win: String,
    loss: String,
    winningPercentage: String
});

module.exports = mongoose.model('Standings', standingsSchema);
