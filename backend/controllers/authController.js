const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("colors");

const handleErrors = (err) => {
  let errors = { email: '', password: '' };

  if (err.message === 'incorrect email') {
    errors.email = 'This email is not registered';
  }
  if (err.message === 'incorrect password') {
    errors.password = 'password is not correct';
  }
  if (err.message) {
    console.log("returning".red);
    console.log(errors);
    return errors;
  }

  if (err.code === 11000) {
    errors.email = 'this email already exists!';
    return errors;
  }
  Object.values(err.errors).forEach(({properties}) => {
    errors[properties.path] = properties.message;
  });

  return errors;
}

const maxAge = 3 * 24 * 60 * 60;
const createToken = function (id) {
  return jwt.sign({ id }, "LoveExtendsCode", {
    expiresIn: maxAge,
  });
};

module.exports.signup_post = async (req, res) => {
  const {email, password} = req.body;
  console.log("email", email);
  try {
    const user = await User.create({ email, password });
    const token = await createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch(err) {
    // res.json(Object.values(err.errors));
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
}


module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
    console.log("token created and about to redirect to the home page")
  } catch(err) {
    const errors = handleErrors(err);
    res.status(200).json({errors});
  }
}
