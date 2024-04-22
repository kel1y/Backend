const { User } = require('./user');
const jwt = require('jsonwebtoken');
const renv = require('dotenv');
const axios = require('axios')

renv.config({ path: 'config.env' });

const PORT = process.env.PORT || 3000;

// handle errors
module.exports.handleErrors = (err) => {
  let errors = { email: '', password: '' };

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'email is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'password is incorrect';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'email is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

const handleErrors = (err) => {
  let errors = { email: '', password: '' };

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'email is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'password is incorrect';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'email is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'backend', {
    expiresIn: maxAge,
  });
};


module.exports.signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id }); 
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json(errors); 
  }
};

module.exports.signin = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id, token });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};


































