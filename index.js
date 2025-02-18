const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const authRoutes = require('./authroutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser, preventUser } = require('./authreq');

const app = express();

dotenv.config({ path: 'config.env' });
const PORT = process.env.PORT || 3000;

app.use(morgan('tiny'));

app.use(bodyparser.urlencoded({ extended: true }));


// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

// database connection
const dbURI = 'mongodb+srv://kelly:VYjwWXBOrIha1n1M@cluster0.xwewes7.mongodb.net/'; 
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) =>
    app.listen(PORT, () => console.log(`The server is running on port ${PORT}`))
  )
  .catch((err) => console.log(err));

app.use(authRoutes);



