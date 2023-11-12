const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const couponController = require('../controllers/couponController')
const cartController = require('../controllers/cartController')
const userAuth = require('../middlewares/userAuth')


router.route('/')
    .get(userController.initial)

router.route('/homepage')
    .get(userAuth.userTokenAuth,userController.home)

router.route('/shop')
    .get(userAuth.userTokenAuth,userController.getShop)

router.route('/search-product')
    .post(userAuth.userTokenAuth,userController.getSearch)

router.route('/category/:_id')
    .get(userAuth.userTokenAuth,userController.getShop)

router.route('/brand/:_id')
    .get(userAuth.userTokenAuth,userController.getShop)

router.route('/signup')
    .get(userAuth.userExist,userController.getUserSignup)
    .post(userController.postUserSignup)

router.route('/signup/:_id')
    .get(userAuth.userExist,userController.getUserSignupWithReferralCode)


router.route('/emailVerification')
    .get(userAuth.userExist,userController.getEmailVerification)
    .post(userController.otpAuth,userController.postEmailVerification)

router.route('/resendOtp')
    .get(userAuth.userExist,userController.resendOtp)
    .post(userController.otpAuth)

router.route('/login')
    .get(userAuth.userExist,userController.getUserLogin)
    .post(userController.postUserLogin)

router.route('/forgotpassword')
    .get(userAuth.userExist,userController.getForgotPassword)
    .post(userController.postForgotPassword)

router.route('/otpVerification')
    .get(userAuth.userExist,userController.getOtpVerification)
    .post(userController.passwordOtpAuth,userController.postOtpVerification)

router.route('/createNewPassword')
    .get(userAuth.userExist,userController.getCreateNewPassword)
    .post(userAuth.userExist,userController.postCreateNewPassword)

router.route('/passwordResendOtp')
    .get(userAuth.userExist,userController.PasswordResendOtp)

router.route('/checkout')
    .get(userAuth.userTokenAuth,userController.getCheckout)
    .post(userAuth.userTokenAuth,userController.postCheckout)

router.route('/verify-payment')
    .post(userAuth.userTokenAuth, userController.verifyPayment);

router.route('/orderSuccess')
    .get(userAuth.userTokenAuth,userController.getOrderSucces)

router.route('/addAddress')
    .post(userAuth.userTokenAuth, userController.postAddressForm)

router.route('/addAddress-Checkout')
    .post(userAuth.userTokenAuth,userController.addAddressCheckout)

router.route('/editAddress')
    .get(userAuth.userTokenAuth,userController.getEditAddress)

router.route('/editAddress/:_id')
    .post(userAuth.userTokenAuth,userController.postEditAddress)

router.route('/updateQuantity')
    .post(userAuth.userTokenAuth,userController.updatingQuantity)

router.route('/profile')
    .get(userAuth.userTokenAuth,userController.profile)

router.route('/changePassword')
    .post(userAuth.userTokenAuth,userController.changePassword)


// product
router.route('/product/:_id')
    .get(userAuth.userTokenAuth,userController.getProduct)


// cart
router.route('/addtocart/:_id')
    .get(userAuth.userTokenAuth ,userController.addToCart)

router.route('/cart')
    .get(userAuth.userTokenAuth,userController.cart)
    .post(userAuth.userTokenAuth,userController.postCart)

router.route('/removefromcart/:_id')
    .get(userAuth.userTokenAuth, userController.removeFromCart)

router.route('/checkStock')
    .get(userAuth.userTokenAuth, cartController.checkStock)


// order
router.route('/orderList')
    .get(userAuth.userTokenAuth,userController.getOrderList)

router.route('/order/details/:_id')
    .get(userAuth.userTokenAuth,userController.getOrderDetails)

router.route('/order/cancel/:_id')
    .get(userAuth.userTokenAuth,userController.cancelOrder)

router.route('/order/return/:_id')
    .post(userAuth.userTokenAuth,userController.returnOrder)
    
router.route('/download-invoice')
    .post(userAuth.userTokenAuth,userController.downloadInvoice)

router.route('/download-invoice/:_id')
    .get(userAuth.userTokenAuth,userController.downloadfile)

router.route("/trackOrder")
    .get(userAuth.userTokenAuth,userController.getTrackOrder)

router.route("/wishlist")
    .get(userAuth.userTokenAuth,userController.getWishlist)
    
    
    //coupon
router.route("/checkCoupon")
    .post(userAuth.userTokenAuth,couponController.checkCoupon)
    

//wishlist
router.route('/addToWishlist/:_id')
    .get(userAuth.userTokenAuth ,userController.addToWishlist)

router.route('/removeFromWishlist/:_id')
    .get(userAuth.userTokenAuth ,userController.removeFromWishlist)

router.route('/logout')
    .get(userController.getUserLogout)



module.exports = router;