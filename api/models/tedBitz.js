const mongoose = require('mongoose');

const tedBitzSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    week: { type: Number, required: true},
    bitz: Array,
});

module.exports = mongoose.model('TedBitz', tedBitzSchema);
