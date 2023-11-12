const User = require("../models/userSchema");
const Product = require("../models/productSchema");
const Category = require("../models/categorySchema");
const Brand = require("../models/brandSchema");
const Order = require("../models/orderSchema");
const Offer = require('../models/offerSchema')
const Cart = require("../models/cartSchema");
const flash = require("express-flash");
const Admin = require("../models/adminSchema");
const moment = require("moment");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports= {
    getOffers: async (req,res)=>{
        try {
            console.log('helloo');
            const categories = await Category.find()
            const categoryOffers = await Offer.find({})
            console.log(categoryOffers);
            const formattedExpiryDate = categoryOffers.expiryDate;
            res.render('admin/offers',{categories,categoryOffers,formattedExpiryDate: formattedExpiryDate})
        } catch (error) {
            
        }
    },
    

    addCategoryOffer: async (req, res)=>{
        try {
            const addedCategory = await Offer.create(req.body)
            const currentDate = new Date()
            const categoryOffers = await Offer.find({
            status:'Active',
            expiryDate: {$gte: currentDate}
            })
            if(categoryOffers){
                for (const offer of categoryOffers) {
                    const categoryName =  offer.categoryName
                    const discountAmount = offer.offerPrice
               
                    const category = await Category.find({Name: categoryName})
               
                  await Product.updateMany({Category: category[0]._id},{$inc:{DiscountAmount: -discountAmount }})
                }
            }

            res.redirect('/admin/offers')
        } catch (error) {
            console.log(error);
            res.redirect('/admin/offers')
        }
    },

    offerStatus: async (req,res)=>{
        try {
            console.log(req.body);
            let id = req.params._id;
            const offer = await Offer.findById(id)
            console.log(offer);
            const newStatus = await Offer.updateOne({_id:id},{status: req.body.status }, { new: true });
            console.log(newStatus);
            const currentDate = new Date()
            const categoryOffers = await Offer.find({
            status:'Active',
            expiryDate: {$gte: currentDate}
            })
            if(categoryOffers){
                for (const offer of categoryOffers) {
                    const categoryName =  offer.categoryName
                    const discountAmount = offer.offerPrice
               
                    const category = await Category.find({Name: categoryName})
               
                  await Product.updateMany({Category: category[0]._id},{$inc:{DiscountAmount: -discountAmount }})
                }
            }
            let success = true;
            res.json(success)
        } catch (error) {
            console.log(error);
            res.json(
                {
                    statusCode : 500 ,
                    message : "Internal Server Error"
                    }
            )
        }
    }

}
