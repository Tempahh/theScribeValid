const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    instructor: { type: String, required: true },
    duration: {type: Number, required: true},
    price: {type: Number, required: true},
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Course', courseSchema);