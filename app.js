const express = require("express")
const app = express()
const path = require('path')
const userRouter = require('./routers/user')
const adminRouter = require('./routers/admin')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const db = require('./config/db.js')
const flash = require('express-flash');
// require('./utility/cron')
require('dotenv').config()

const ejs = require('ejs')

app.use(flash());
app.use(express.static("public"))

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.set("views",path.join(__dirname,"views"))

app.set('view engine','ejs')
app.use(session({
    secret: 'awertfhyjgfdsrestdxfhcygvjbrdxghfcgvjbm', 
    resave: false,
    saveUninitialized: true,
  }))
  app.use((req,res,next)=>{
    res.set('Cache-Control','no-store')
    next();
  })
app.use(cookieParser())

app.use("/",userRouter)
app.use('/admin',adminRouter)
app.use("*", (req,res) => {
  res.render('errorpage')
})

const PORT = process.env.PORT

app.listen(PORT,()=>{
    console.log("connected successfully");
})

