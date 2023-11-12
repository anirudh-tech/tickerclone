const User = require("../models/userSchema");
const Product = require("../models/productSchema");
const Category = require("../models/categorySchema");
const Brand = require("../models/brandSchema");
const Order = require("../models/orderSchema");
const Coupon = require("../models/couponSchema");
const flash = require("express-flash");
const Admin = require("../models/adminSchema");
const moment = require("moment");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  getCoupon: async (req, res) => {
    try {
      const coupons = await Coupon.find();
      const date = new Date()
      res.render("admin/showCoupon", { coupons, date });
    } catch (error) {
      console.log(error);
    }
  },

  postAddCoupon: async (req, res) => {
    try {
      console.log(req.body);
      if (req.body.discountType === "fixed") {
        req.body.amount = req.body.amount[1];
      } else if (req.body.discountType === "percentage") {
        req.body.amount = req.body.amount[0];
      }
      if(req.body.amount <= 0 ){
        return res.json({ error: "COUPON amount cannot be 0 or negative" })
      }
      const coupon = await Coupon.create(req.body);
      if (coupon) {
        console.log("added to collection");
        res.json({ success: true });
      } else {
        console.log("not added to collection");
        res.json({ error: "COUPON already consist" });
      }
    } catch (error) {
      console.log(error);
      if(error.code === 11000){
        res.json({error: "Coupon already added"})
      }else{
        res.json({ error: "Some error occured" });
      }
    }
  },

  checkCoupon: async (req, res) => {
    try {
      console.log("inside try");
      const userId = req.session.user.user;
      let code = req.body.code;
      let total = req.body.total;
      let discount = 0;
      const couponMatch = await Coupon.findOne({ couponCode: code });
      if (couponMatch) {
        if (couponMatch.status === true) {
          let currentDate = new Date();
          let startDate = couponMatch.startDate;
          let endDate = couponMatch.endDate;
          if (startDate <= currentDate && currentDate <= endDate) {
              if (couponMatch.couponType === "public") {
                if (couponMatch.limit === 0) {
                  return res.json({ error: "Coupon already applied" });
                } else {
                  let couponUsed = await Coupon.findOne({
                    couponCode: couponMatch.couponCode,
                    "usedBy.userId": userId,
                  });
                  if (couponUsed) {
                    return res.json({ error: "You have used the coupon once" });
                  } else {
                    if (couponMatch.discountType === "fixed") {
                      console.log("insidee fixedddd");
                      console.log("total", total);
                      if (total >= couponMatch.minAmountFixed) {
                        discount = couponMatch.amount;
                        res.json({ success: true, discount });
                      } else {
                        return res.json({
                          error: `Cart should contain a minimum amount of ${couponMatch.minAmountFixed}`,
                        });
                      }
                    } else {
                      if (total >= couponMatch.minAmount) {
                        discount = total * (couponMatch.minAmount / 100);
                        res.json({ success: true, discount });
                      } else {
                        return res.json({
                          error: `Cart should contain a minimum amount of ${couponMatch.minAmount}`,
                        });
                      }
                    }
                  }
                }
              } else {
                // private coupon can be applied only to specific user
                let couponUsed = await Coupon.findOne({
                    couponCode: couponMatch.couponCode,
                    "usedBy.userId": userId,
                  });
                  if (couponUsed) {
                    return res.json({ error: "You have used the coupon once" });
                  } else {
                    if (couponMatch.discountType === "fixed") {
                      console.log("insidee fixedddd");
                      console.log("total", total);
                      if (total >= couponMatch.minAmountFixed) {
                        discount = couponMatch.amount;
                        res.json({ success: true, discount });
                      } else {
                        return res.json({
                          error: `Cart should contain a minimum amount of ${couponMatch.minAmountFixed}`,
                        });
                      }
                    } else {
                      if (total >= couponMatch.minAmount) {
                        discount = total * (couponMatch.minAmount / 100);
                        res.json({ success: true, discount });
                      } else {
                        return res.json({
                          error: `Cart should contain a minimum amount of ${couponMatch.minAmount}`,
                        });
                      }
                    }
                  }
              }
          }else{
            return res.json({error:"No such coupon found"})
          }
        }else{
            return res.json({error:"No Coupon found"});
        }
      }else{
        return res.json({error:"Coupon is expired"});
      }
    } catch (error) {
      console.log(error);
      res.json({ error: "Some error Occurred" });
    }
  },
};
