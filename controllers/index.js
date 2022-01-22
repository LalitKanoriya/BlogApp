const express = require('express');
const router = require('../routes/main');
const ba_router = require('../routes/blog_app');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = new require('connect-mongo')(session);
const methodOverride = require('method-override');

const app = express()
const port = 3000

// mongoose.connect('mongodb://localhost:27017/BlogApp');
mongoose.connect('mongodb+srv://lucifer_27:Rohit%402001@cluster0.dbsej.mongodb.net/BlogApp?retryWrites=true&w=majority');

const db = mongoose.connection;

app.use(session({
  secret : 'cnhdihcpoJDU318R84TF73RUVJC2OJZJojoj08787ij',
  resave : false,
  saveUninitialized : true,
  store : new MongoStore({
    mongooseConnection : db
  })
}))

// The body-parser middleware to parse form data
app.use(express.urlencoded({ extended: true }))

// setup static and middleware
app.use(express.static('../public'))

app.use(methodOverride('_method'));

// setup template engine
app.set('views', '../views');
app.set('view engine', 'ejs');

// setup routes
app.use('', router);
app.use('', ba_router);

db.on('open', () => {
  console.log('DB connected successfully!');
  app.listen(port, () => {
    console.log(`Blog App listening at http://localhost:${port}`)
  })
})