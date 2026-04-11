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
            type: mongoose.Types.ObjectId,
            ref: 'Tour'
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    },{
        timestamps: true
    }
)
