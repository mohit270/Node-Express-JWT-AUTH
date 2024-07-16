const jwt = require("jsonwebtoken");
const User = require("../models/User");

const requireAuth = (req,res,next)=>{
    const token = req.cookies.jwt;
    // check json web token exists & is verified
    if(token){
        jwt.verify(token,"Mohit@1211",(error,decodedToken)=>{
            if(error) res.redirect("/login");
            else {
                req.user = decodedToken;
                next();
            }
        });
    }else {
        res.redirect("/login");
    }
}


const checkUser = (req,res,next)=>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token,"Mohit@1211", async (error,decodedToken)=>{
            if(error) {
                res.locals.user = null;
                console.log(error);
                next();
            }
            else {
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        });
    }else {
        res.locals.user = null;
        next();
    }
}


module.exports = {requireAuth,checkUser}; 