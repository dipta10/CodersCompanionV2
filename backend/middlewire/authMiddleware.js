const jwt = require('jsonwebtoken');
const User = require("../models/User");

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    // check json web token exists & is verified
    if (token) {
        jwt.verify(token, 'LoveExtendsCode', (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/login');
                next();
            } else {
                console.log(decodedToken);
                next();
            }
        });
    } else {
        res.redirect('/login');
        next();
    }
};

const checkUser = async (req, res, next) => {
    const token = req.cookies.jwt;
    res.locals.user_email = null;
    if (token) {
        jwt.verify(token, "LoveExtendsCode", async (err, decodedToken) =>  {
            if (!err) {
                const user = await User.findById(decodedToken.id);
                res.locals.user_email = user.email;
                console.log("USER IS LOGGED IN!!!!!!!)");
                console.log("returned user", user);
                console.log("locals.user_email", res.locals.user_email);
                next();
            } else {
                console.log(err);
                next();
            }
        });
    } else {
        next();
    }
};

module.exports = { requireAuth, checkUser }
