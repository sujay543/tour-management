const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
    {
        ratings: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        }, review: {
            type: String,
            required: [true,'review cannot be empty'],
            trim: true
        },
        tour: {
            type: mongoose.Schema.ObjectId,
            ref: 'Tour'
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    },{
        timestamps: true
    }
)

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;