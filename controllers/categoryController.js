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
    getAddCategory: async (req, res) => {
        res.render("admin/addCategory",{messages: req.flash()});
      },
    
      postAddCategory: async (req, res) => {
        try {
          console.log(req.file);
          req.body.image = req.file.filename;
          const uploaded = await Category.create(req.body);
          res.redirect("/admin/categoriesandbrands");
        } catch (error) {
          console.log(error);
          if (error.code === 11000) {
              req.flash("error", "Category already exist");
              res.redirect("/admin/addcategory");
          } else {
            req.flash("error", "Error Adding the Category");
            res.redirect("/admin/categoriesandbrands");

          }
        }
      },
      getEditCategory: async (req, res) => {
        const _id = req.params._id;
        const category = await Category.findById(_id);
        res.render("admin/editCategory", { category });
      },

      postEditCategory: async(req,res)=>{
          const id = req.params._id
        try {
            if(req.file){
              req.body.image = req.file.filename
            }
            let category = await Category.updateOne({_id : id},{$set : req.body})
            res.redirect('/admin/categoriesandbrands') 
        } catch (error) {
            if (error.code === 11000) {
                req.flash("error", "Category already exist");
                res.redirect(`/admin/editCategory/${id}`);
            } else {
              req.flash("error", "Error Adding the Category");
              res.redirect(`/admin/editCategory/${id}`);
  
            }
        }
    
      }
}