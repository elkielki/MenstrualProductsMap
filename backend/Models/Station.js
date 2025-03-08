const mongoose = require('mongoose');

const StationSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    padQuantity: {
        type: Number,
    },
    tamponQuantity: {
        type: Number,
    },
    otherQuantity: {
        type: Number,
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
})

const StationModel = mongoose.model("stations", StationSchema)

module.exports = StationModel;