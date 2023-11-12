const express = require('express')
const router = express.Router()
const productController = require('../controllers/productController')
const brandController = require('../controllers/brandController')
const categoryController = require('../controllers/categoryController')
const orderController = require('../controllers/orderController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
const couponController = require('../controllers/couponController')
const offerController = require('../controllers/offerController')
const upload = require('../middlewares/upload')
const adminAuth = require('../middlewares/adminAuth')
const { route } = require('./user')


router.route("/")
    .get(adminController.initial)
router.route("/login")
    .get(adminAuth.adminExist,adminController.getLogin)
    .post(adminController.postLogin)
router.route('/userslist')
    .get(adminAuth.adminTokenAuth,adminController.getUser)
router.route('/userlist/:_id')
    .get(adminAuth.adminTokenAuth,adminController.blockUser)
    router.route('/count-orders-by-day')
    .get(adminAuth.adminTokenAuth,adminController.getCount)
router.route('/count-orders-by-month')
    .get(adminAuth.adminTokenAuth,adminController.getCount)
router.route('/count-orders-by-year')
    .get(adminAuth.adminTokenAuth,adminController.getCount)
router.route('/latestOrders')
.get(adminAuth.adminTokenAuth,adminController.getOrdersAndSellers)
router.route("/dashboard")
    .get(adminAuth.adminTokenAuth,adminController.getDashboard)
router.route('/categoriesandbrands')
    .get(adminAuth.adminTokenAuth,adminController.getCategoriesAndBrands)




router.route("/product")
    .get(adminAuth.adminTokenAuth,productController.getProduct)

router.route('/editproduct/:_id')
    .get(adminAuth.adminTokenAuth,productController.getEditProduct)
    .post(upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }]),productController.postEditProduct)

router.route('/product/:_id')
    .get(adminAuth.adminTokenAuth,productController.blockProduct)

router.route("/addproduct")
    .get(adminAuth.adminTokenAuth,productController.getAddProduct)
    .post(upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }]),productController.postAddProduct)






router.route('/addcategory')
    .get(adminAuth.adminTokenAuth,categoryController.getAddCategory)
    .post(upload.single('image'),categoryController.postAddCategory)

router.route('/editCategory/:_id')
    .get(adminAuth.adminTokenAuth,categoryController.getEditCategory)
    .post(upload.single('image'),categoryController.postEditCategory)



router.route('/order/details/:_id')
    .get(adminAuth.adminTokenAuth,orderController.getOrderDetails)

router.route('/orders/return-request')
    .get(adminAuth.adminTokenAuth,orderController.getReturnRequests)

router.route('/order/handleRequest')
    .post(adminAuth.adminTokenAuth,orderController.getHandleRequest)




router.route('/order/update-status/:orderId')
    .put(adminAuth.adminTokenAuth,orderController.putUpdateStatus)

router.route('/download-sales-report')
    .post(adminAuth.adminTokenAuth,orderController.getDownloadSalesReport)

router.route("/order")
    .get(adminAuth.adminTokenAuth,orderController.getOrders)



router.route("/addbrand")
    .get(adminAuth.adminTokenAuth,brandController.getAddBrand)
    .post(brandController.postAddBrand)

router.route("/editBrand/:_id")
    .get(adminAuth.adminTokenAuth,brandController.getEditBrand)
    .post(adminAuth.adminTokenAuth,brandController.postEditBrand)


router.route('/coupons')
    .get(adminAuth.adminTokenAuth,couponController.getCoupon)

router.route('/addCoupon')
    .post(adminAuth.adminTokenAuth,couponController.postAddCoupon)


router.route('/offers')
    .get(adminAuth.adminTokenAuth,offerController.getOffers)

router.route('/addCategoryOffer')
    .post(adminAuth.adminTokenAuth,offerController.addCategoryOffer)

router.route("/offers/disableAndEnableOffer/:_id")
    .post(adminAuth.adminTokenAuth,offerController.offerStatus)





router.route("/logout")
    .get(adminController.getAdminLogout)

module.exports = router;