const User = require("../models/userSchema");
const Product = require("../models/productSchema");
const Category = require("../models/categorySchema");
const Brand = require("../models/brandSchema");
const Order = require("../models/orderSchema");
const flash = require("express-flash");
const Admin = require("../models/adminSchema");
const moment = require("moment");
const bcrypt = require("bcrypt");
const pdf = require("../utility/pdf")
const orderHelper = require("../helpers/orderHelpers")
const jwt = require("jsonwebtoken");

module.exports = {
    getOrderDetails: async (req, res) => {
        try {
          const orderId = req.params._id;
          const orderDetails = await Order.findOne({ _id: orderId }).populate(
            "Items.ProductId"
          );
          
          res.render("admin/adminOrderDetails", { order: orderDetails });
        } catch (error) {
          console.log(error);
        }
      },

      getReturnRequests: async (req,res)=>{
        try {
          const page = parseInt(req.query.page) || 1;
          const perPage = 10;
          const skip = (page - 1) * perPage;
          const order = await Order.find({Status: 'Return Requested' }).skip(skip).limit(perPage)
          const totalCount = await Order.countDocuments({Status: 'Return Requested' });
          res.render('admin/returnRequests',{
            order,
            totalCount,
          currentPage: page,
          perPage,
          totalPages: Math.ceil(totalCount / perPage),
          })
        } catch (error) {
          console.log(error);
        }
      },

      getHandleRequest: async (req,res)=>{
        try {
          const orderId = req.body.orderId
          const input = req.body.input
          if(input === 'accept'){
            const order = await Order.findById(orderId).populate('Items.ProductId')
            const _id = order.UserId
            if(order.PaymentStatus === 'Paid'){
              await User.findOneAndUpdate(
                { _id: _id },
                { $inc: { WalletAmount: order.TotalPrice } }
              );
            }
            let status = "Returned"
            const updatedOrder = await Order.findByIdAndUpdate(
              orderId,
              { Status: status,PaymentStatus: "Refunded" },
              { new: true }
            );
            console.log(order.Items);
            order.Items.forEach(async(item)=>{
              await Product.updateOne(
                {_id : item.ProductId._id},
                {$inc:{AvailableQuantity: item.Quantity}}
              )
            })
          }else{
            let status = "Return Rejected"
            const updatedOrder = await Order.findByIdAndUpdate(
              orderId,
              { Status: status },
              { new: true }
            );
          }
          res.json({success: true})

        } catch (error) {
          console.log(error);
        }
      },

    
      putUpdateStatus: async (req, res) => {
        console.log("hereee");
        const orderId = req.params.orderId;
        let { status } = req.body;
    
        try {
          if(status === "Accept Request"){
            status = "Returned"
          }
          const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { Status: status },
            { new: true }
          );
    
          // If the status is "Delivered," update the payment status to "paid"
          if (status.toLowerCase() === "delivered") {
            const updatedOrder = await Order.findByIdAndUpdate(
              orderId,
              {$set:{ DeliveredDate: new Date() }},
              { new: true }
            );
            updatedOrder.PaymentStatus = "Paid";
          } else {
            updatedOrder.PaymentStatus = "Pending";
          }
    
          // If the status is "rejected," update the payment status to "order rejected"
          if (status.toLowerCase() === "rejected") {
            updatedOrder.PaymentStatus = "order rejected";
          }
    
          // Save the changes to the order
          await updatedOrder.save();
    
          // Respond with the updated order
          res.json(updatedOrder);
        } catch (error) {
          console.error("Error updating order status:", error);
          res.status(500).json({ error: "Internal Server Error" });
        }
      },


      getDownloadSalesReport: async (req,res)=>{
        console.log(req.body);
        try {
          const startDate = req.body.startDate
          const format = req.body.fileFormat
          const endDate = req.body.endDate
          const orders = await Order.find({
            PaymentStatus: 'Paid',
          }).populate('Items.ProductId')

          const totalSales = await Order.aggregate([
            {
            $match:{
              PaymentStatus: 'Paid',
            }
        },
        {
          $group: {
            _id: null,
            totalSales: {$sum: '$TotalPrice'}
          }
        }
      ])
      const sum = totalSales.length > 0 ? totalSales[0].totalSales : 0;
      pdf.downloadPdf(req,res,orders,startDate,endDate,totalSales)
      
        } catch (error) {
          console.log(error);
        }

      },

      getOrders: async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const perPage = 10;
        const skip = (page - 1) * perPage;
        const order = await Order.find().skip(skip).limit(perPage).lean();
        const returnRequestedCount = await Order.aggregate([
          {
            $match: {
              Status: 'Return Requested',
            },
          },
          {
            $count: 'count',
          },
        ]);
        const numberOfRequest = returnRequestedCount[0]?.count
        const totalCount = await Order.countDocuments();
    
        res.render("admin/adminOrders", {
          order,
          numberOfRequest,
          currentPage: page,
          perPage,
          totalCount,
          totalPages: Math.ceil(totalCount / perPage),
        });
      },
}