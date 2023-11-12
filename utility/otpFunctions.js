const nodemailer = require("nodemailer");
const OTP = require("../models/otpSchema");
const flash = require("express-flash");

require("dotenv").config();

//generate OTP
module.exports = {
  generateOTP: () => {
    return `${Math.floor(1000 + Math.random() * 9000)}`;
  },
  sendOTP: async (req, res, Email, otpToBeSent) => {
    try {
      const transporter = nodemailer.createTransport({
        port: 465,
        service: 'Gmail',
        auth: {
          user: "tickerpage@gmail.com",
          pass: "vfte pvyn gvat uylk",
        },
        secure: true,
      });

      const duration = 30;
      const newOTP = new OTP({
        Email: Email,
        otp: otpToBeSent,
        createdAt: Date.now(),
        expiresAt: Date.now() + duration * 1000,
      });

      const createdOTPRecord = await newOTP.save();
      console.log(createdOTPRecord);

      // Mail data
      const message = "Enter This OTP to Continue";
      const mailData = {
        from: "tickerpage@gmail.com",
        to: Email,
        subject: "OTP FROM TICKER",
        html: `<p>${message}</p> <p style="color: tomato; font-size: 25px; letter-spacing: 2px;"><b>${otpToBeSent}</b></p><p>This Code <b>expires in ${duration} minutes(s)</b>.</p>`,
      };

      transporter.sendMail(mailData, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log("Successfully sent otp");
      });
      res.redirect("/emailVerification");
    } catch (error) {
      console.error(error);
      req.flash("error", "Error Sending OTP");
      res.redirect("/signup");
    }
  },

  resendOTP: async (req, res, Email, otpToBeSent) => {
    try {
      const transporter = nodemailer.createTransport({
        port: 465,
        service: 'Gmail',
        auth: {
          user: "tickerpage@gmail.com",
          pass: "vfte pvyn gvat uylk",
        },
        secure: true,
      });

      const duration = 30;
      const newOTP = new OTP({
        Email: Email,
        otp: otpToBeSent,
        createdAt: Date.now(),
        expiresAt: Date.now() + duration * 1000,
      });

      const createdOTPRecord = await newOTP.save();
      console.log(createdOTPRecord);

      const message = "Enter This OTP to Continue";
      const mailData = {
        from: "tickerpage@gmail.com",
        to: Email,
        subject: "OTP FROM TICKER",
        html: `<p>${message}</p> <p style="color: tomato; font-size: 25px; letter-spacing: 2px;"><b>${otpToBeSent}</b></p><p>This Code <b>expires in ${duration} hour(s)</b>.</p>`,
      };

      // Sending mail
      transporter.sendMail(mailData, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log("Success");
      });
      req.flash("success", "OTP resend Successfully");
      res.redirect("/emailVerification");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error sending OTP");
    }
  },

  passwordSendOTP: async (req, res, Email, otpToBeSent) => {
    try {
      const transporter = nodemailer.createTransport({
        port: 465,
        service: 'Gmail',
        auth: {
          user: "tickerpage@gmail.com",
          pass: "vfte pvyn gvat uylk",
        },
        secure: true,
      });

      const duration = 30;
      const newOTP = new OTP({
        Email:Email,
        otp: otpToBeSent,
        createdAt: Date.now(),
        expiresAt: Date.now() + duration * 60000, // Convert hours to milliseconds
      });

      // Save the OTP record to the database
      const createdOTPRecord = await newOTP.save();

      // Mail data
      const message = "Enter This OTP to Continue";
      const mailData = {
        from: "tickerpage@gmail.com",
        to: Email,
        subject: "OTP FROM TICKER",
        html: `<p>${message}</p> <p style="color: tomato; font-size: 25px; letter-spacing: 2px;"><b>${otpToBeSent}</b></p><p>This Code <b>expires in ${duration} second(s)</b>.</p>`,
      };

      transporter.sendMail(mailData, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log("Success");
      });
      res.redirect("/otpVerification");
    } catch (error) {
      console.error(error);
      req.flash("error", "Error Sending OTP");
      res.redirect("/login");
    }
  },
  passwordResendOTP: async (req, res, Email, otpToBeSent) => {
    try {
      const transporter = nodemailer.createTransport({
        port: 465,
        service: 'Gmail',
        auth: {
          user: "tickerpage@gmail.com",
          pass: "vfte pvyn gvat uylk",
        },
        secure: true,
      });

      const duration = 1;

      const message = "Enter This OTP to Continue";
      const mailData = {
        from: "tickerpage@gmail.com",
        to: Email,
        subject: "OTP FROM TICKER",
        html: `<p>${message}</p> <p style="color: tomato; font-size: 25px; letter-spacing: 2px;"><b>${otpToBeSent}</b></p><p>This Code <b>expires in ${duration} hour(s)</b>.</p>`,
      };

      // Sending mail
      transporter.sendMail(mailData, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log("Success");
      });
      req.flash("success", "OTP resend Successfully");
      res.redirect("/otpVerification");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error sending OTP");
    }
  },
};
