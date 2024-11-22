const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  cartItems: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Produit" },
      name: String,
      price: Number,
      quantity: Number,
      cover: String,
    },
  ],
  cartItemPerso: [
    {
      id: String,
      type: String,
      persoPrice: Number,
      quantity: Number,
      cover: String,
    },
  ],
  selectedCommune: String,
  selectedMethod: String,
  deliveryMethod: String,
  deliveryPrice: Number,
  totalPrice: Number,
  phoneNumber: String,
  ticketNumber: String,
  orderDate: String,
  deliveryPersonName: { 
    type: String, 
    default: null 
  },
  status: { 
    type: String, 
    enum: ['Nouveau', 'Confirmé', 'Production', 'Livraison', 'Terminé'], 
    default: 'Nouveau'
  },
  isAssigned: {
    type: Boolean,
    default: false
  },
});

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
