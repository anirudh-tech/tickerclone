const User = require("../models/userSchema");
const Product = require("../models/productSchema");
const Category = require("../models/categorySchema");
const Brand = require("../models/brandSchema");
const Order = require("../models/orderSchema");
const Cart = require("../models/cartSchema");
const flash = require("express-flash");
const Admin = require("../models/adminSchema");
const moment = require("moment");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  checkStock: async (req, res) => {
    const userId = req.session.user.user;
    const userCart = await Cart.findOne({ UserId: userId });

    console.log("userCart===", userCart);
    if (userCart) {
      const existingCart = userCart.Items.map(async (cartItem) => {
        const product = await Product.findById(cartItem.ProductId);
        if (product) {
          return { 
            productId: cartItem.ProductId,
            availableQuantity: product.AvailableQuantity,
            requestedQuantity: cartItem.Quantity
           };
        } else{
            res.json({error:"No products found"})
        }
      });
      Promise.all(existingCart).then((results)=>{
        const itemsWithInsufficientStock = results.filter(
            (result) =>
              result.availableQuantity < result.requestedQuantity
          );
          if (itemsWithInsufficientStock.length > 0) {
            res.json({error:"Insufficient stock for some items",itemsWithInsufficientStock})
            console.log('Insufficient stock for some items:', itemsWithInsufficientStock);
          } else {
            res.json({success:true})
            console.log('All items have sufficient stock.');
          }
        })
        .catch((error) => {
            console.error('Error while checking stock:', error);
          });
    }
  },
};
