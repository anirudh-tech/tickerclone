const mongoose = require('mongoose');

const { Schema, ObjectId } = mongoose;

const ShippedAddressSchema = new Schema({
  Name: { type: String, required: true },
  Address: { type: String, required: true },
  Pincode: { type: String, required: true },
  City: { type: String, required: true },
  State: { type: String, required: true },
  Mobile: { type: Number, required: true },
});


const OrdersSchema = new Schema({
  UserId: { type: Schema.Types.ObjectId },
  Status: { type: String, default:"Attempted"},
  Items: [{
     ProductId: { type: Schema.Types.ObjectId , ref: "Products" },
     Quantity: { type: Number },
  }],

  PaymentMethod: {type: String},
  OrderDate: { type: Date },
  ShippedDate: { type: Date },
  DeliveredDate: { type: Date },
  TotalPrice: { type: Number },
  PaymentStatus: {type: String, default: "Pending"},
  CouponId: { type: Schema.Types.ObjectId },
  Address: { type: ShippedAddressSchema },
  ReturnReason: String
});

const Orders = mongoose.model('Orders', OrdersSchema);

module.exports = Orders

