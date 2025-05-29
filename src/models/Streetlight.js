const mongoose = require('mongoose');

const streetlightSchema = new mongoose.Schema({
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  lastMaintenance: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Streetlight', streetlightSchema); 