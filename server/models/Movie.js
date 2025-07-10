const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    year: { type: Number, required: true },
    genres: { type: [String], required: true },
    rating: { type: Number, required: true, min: 1, max: 10 },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Movie', movieSchema);
