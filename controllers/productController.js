const User = require("../models/userSchema");
const Product = require("../models/productSchema");
const Category = require("../models/categorySchema");
const Brand = require("../models/brandSchema");
const Order = require("../models/orderSchema");
const cropImage = require("../utility/imageCrop")
const flash = require("express-flash");
const Admin = require("../models/adminSchema");
const moment = require("moment");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cron = require('node-cron')
require('dotenv').config();

module.exports = {

getProduct: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1; 
      const perPage = 10; 
      const skip = (page - 1) * perPage;

      const products = await Product.find().skip(skip).limit(perPage).lean();

      const totalCount = await Product.countDocuments();

      res.render("admin/adminShowProducts", {
        products,
        currentPage: page,
        perPage,
        totalCount,
        totalPages: Math.ceil(totalCount / perPage),
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },

  getAddProduct: async (req, res) => {
    const categories = await Category.find();
    const brands = await Brand.find();
    res.render("admin/addProduct", { categories, brands });
  },

  postAddProduct: async (req, res) => {
    try {
      console.log(req.files);
      const images = [];
      const productType = req.body.ProductType;
      const variations = [];
      const category = await Category.findOne({ Name: req.body.Category });
      const BrandName = await Brand.findOne({ Name: req.body.BrandName });
      if (productType === "watches") {
        const watchColors = req.body.watches;
        variations.push({ value: watchColors });
      } else if (productType === "perfumes") {
        const perfumeQuantity = req.body.perfumes;
        variations.push({ value: perfumeQuantity });
      }
      console.log(variations[0]);

      for (let i = 1; i <= 3; i++) {
        const fieldName = `image${i}`;
        if (req.files[fieldName] && req.files[fieldName][0]) {
          images.push(req.files[fieldName][0].filename);
        }
      }
      let Status;
      cropImage(images)
      if (req.body.AvailableQuantity <= 0) {
        Status = "Out of Stock";
      } else {
        Status = "In Stock";
      }
      const newProduct = new Product({
        ProductName: req.body.ProductName,
        Price: req.body.Price,
        Description: req.body.Description,
        BrandName: BrandName._id,
        Tags: req.body.Tags,
        AvailableQuantity: req.body.AvailableQuantity,
        Category: category._id,
        Status: Status,
        Display: "Active",
        Specification1: req.body.Specification1,
        Specification2: req.body.Specification2,
        Specification3: req.body.Specification3,
        Specification4: req.body.Specification4,
        DiscountAmount: req.body.DiscountAmount,
        Variation: variations[0].value,
        ProductType: req.body.ProductType,
        UpdatedOn: new Date(),
        images: images,
      });
      newProduct.save();
      res.redirect("/admin/product");
    } catch (error) {
      console.log(`An error happened ${error}`);
    }
  },

  getEditProduct: async (req, res) => {
    const _id = req.params._id;
    const categories = await Category.find();
    const brands = await Brand.find();
    const product = await Product.findOne({ _id }).populate('Category BrandName')
    // console.log(product);

    res.render("admin/editProduct", {
      product: product,
      categories,
      brands,
    });
  },
  blockProduct: async (req, res) => {
    try {
      const _id = req.params._id;
      const productData = await Product.findOne({ _id: _id });
      if (productData.Display === "Active") {
        const product = await Product.findByIdAndUpdate(_id, {
          Display: "Inactive",
        });
        res.redirect("/admin/product");
      } else if (productData.Display === "Inactive") {
        const product = await Product.findByIdAndUpdate(_id, {
          Display: "Active",
        });
        res.redirect("/admin/product");
      }
    } catch (error) {
      const alertMessage = "This is an alert message.";
      req.session.alert = alertMessage;
      res.redirect("/admin/product");
    }
  },

  postEditProduct: async (req, res) => {
    const _id = req.params._id;
    console.log(_id);
    try {
      let images = [];
      const productType = req.body.ProductType;
      const existingProduct = await Product.findById(_id);
      if (existingProduct) {
        images.push(...existingProduct.images); 
    }
    
    const variations = [];
    
    for (let i = 0; i < 3; i++) {
        const fieldName = `image${i+1}`;
        if (req.files[fieldName] && req.files[fieldName][0]) {
            images[i] = req.files[fieldName][0].filename;
        }
    }
    const category = await Category.findOne({ Name: req.body.Category });
    const BrandName = await Brand.findOne({ Name: req.body.BrandName });
    
    if (productType === "watches") {
      const watchColors = req.body.watches;
      variations.push({ value: watchColors });
    } else if (productType === "perfumes") {
      const perfumeQuantity = req.body.perfumes;
      variations.push({ value: perfumeQuantity });
    }
    
    console.log(variations);
    req.body.Variation = variations[0].value;
    req.body.Category = category._id;
    req.body.BrandName = BrandName._id;
    req.body.images = images;
    cropImage(images)
    
      if (req.body.AvailableQuantity <= 0) {
        req.body.Status = "Out of Stock";
      }else{
        req.body.Status = "In Stock"
      }
      const updatedProduct = await Product.updateOne({_id: _id}, {$set: req.body});
      res.redirect("/admin/product");
    } catch (error) {
      console.log(`An error happened ${error}`);
    }
  },
}