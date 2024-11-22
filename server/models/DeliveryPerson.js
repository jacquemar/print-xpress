const mongoose = require('mongoose');

const deliveryPersonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: false }, // Make email optional
  status: { type: String, enum: ['disponible', 'occupé'], default: 'disponible' },
  activeOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }]
});

const DeliveryPerson = mongoose.model('DeliveryPerson', deliveryPersonSchema);
module.exports = DeliveryPerson;