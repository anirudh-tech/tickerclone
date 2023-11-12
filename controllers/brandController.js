const User = require("../models/userSchema");
const Product = require("../models/productSchema");
const Category = require("../models/categorySchema");
const Brand = require("../models/brandSchema");
const Order = require("../models/orderSchema");
const flash = require("express-flash");
const Admin = require("../models/adminSchema");
const moment = require("moment");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
    getAddBrand: (req, res) => {
        res.render("admin/addBrand");
      },
    
      postAddBrand: async (req, res) => {
        try {
          const brands = await Brand.create(req.body);
          res.redirect("/admin/categoriesandbrands");
        } catch (error) {
          console.log(error);
          req.flash("error", "Error Adding the Brand");
          res.redirect("/admin/categoriesandbrands");
        }
      },

      getEditBrand: async (req,res) =>{
        const _id = req.params._id;
        const brand = await Brand.findById(_id);
        res.render("admin/editBrand",{brand})
      },

      postEditBrand: async (req,res)=>{
          const _id = req.params._id;
          try {
            let brand = await Brand.updateOne({_id : _id},{$set : req.body})
            res.redirect('/admin/categoriesandbrands')
        } catch (error) {
            if (error.code === 11000) {
                req.flash("error", "Brand already exist");
                res.redirect(`/admin/editBrand/${_id}`);
            } else {
              req.flash("error", "Error Adding the Brand");
              res.redirect(`/admin/editBrand/${_id}`);
            }
        }
      }
}