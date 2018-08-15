const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true},
    body: String,
    date: String
});

module.exports = mongoose.model('Message', messageSchema);
