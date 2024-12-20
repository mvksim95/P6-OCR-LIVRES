const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    imageUrl: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    ratings: [{
        userId: { type: String, required: true }, // user
        grade: { type: Number, required : true} // note donné au livre pas l'user
    }],
    averageRating: { type: Number, required: true },

});

module.exports = mongoose.model('Book', bookSchema);