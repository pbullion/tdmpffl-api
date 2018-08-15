const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    expoToken: { type: String, required: true}
});

module.exports = mongoose.model('User', userSchema);
