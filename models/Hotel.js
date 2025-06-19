const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    pricePerNight: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        default: 'XOF'
    },
    image: { 
        type: String,
        default: ''
    },
});
hotelSchema.pre('save', function(next) {
  console.log('Tentative de sauvegarde:', this);
  next();
});
module.exports = mongoose.model('Hotel', hotelSchema);