const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const { requireAuth } = require("./middlewire/authMiddleware");
const authController = require("./controllers/authController");
const { checkUser } = require("./middlewire/authMiddleware");
require("dotenv").config();

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
// app.use(bodyParser.urlencoded({extended: false}));
// app.use(bodyParser.json());

// view engine
app.set('view engine', 'ejs');

// database connection
// const dbURI = 'mongodb+srv://shaun:test1234@cluster0.del96.mongodb.net/node-auth';
const dbURI = process.env.dbURI;

console.log("about to connect to db");
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => {
      const port = process.env.PORT || 5000;
      app.listen(port);
      console.log("listening on port: " + port);
      console.log("-------------------------")
  })
  .catch((err) => console.log(err));

// routes
// app.get("*", checkUser);
// app.get('/', (req, res) => res.render('home'));
app.use(authRoutes);
// app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
// app.get("/get-cookies", authController.getCookiesTest, (req, res) => res.send("passed the middle wire"));

