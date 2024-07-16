const User = require("../models/User");
const jwt = require("jsonwebtoken");


//handler error
const handlerError = (error)=>{
    console.log(error.message,error.code);

    let err = {email: "",password: ""};

    if(error.message === 'Incorrect email'){
        err.email = "that email is not registered";
    }
    if(error.message === 'Incorrect password'){
        err.password = "that password is incorrect";
    }

    // duplicate errors code
    if(error.code === 11000) {
        err.email = "that email is already registered";
        return err;
    }

    // validation errors
    if(error.message.includes("user validation failed")){
        Object.values(error.errors).forEach(({properties})=>{
            err[properties.path] = properties.message; 
        });
    }
    
    return err;
}
const maxAge = 3*24*60*60;
const createToken = (id)=>{
    return jwt.sign({id},"Mohit@1211",{
        expiresIn: maxAge,
    });
}

module.exports.signup_get = (req,res)=>{
    res.render('signup');
}
module.exports.login_get = (req,res)=>{
    res.render('login');
}
module.exports.signup_post = async (req,res)=>{
    const {email,password} = req.body;
    console.log(email,password);
    try {
        const user = await User.create({email,password});
        const token = createToken(user._id);
        res.cookie("jwt",token,{httpOnly:true,maxAge:maxAge*1000});
        res.status(201).json({user: user._id});
    } catch (error) {
        const err = handlerError(error);
        res.status(400).json({err});
    }
}
module.exports.login_post = async (req,res)=>{
    const {email,password} = req.body;
    try {
        const user = await User.login(email,password);
        const token = createToken(user._id);
        res.cookie("jwt",token,{httpOnly:true,maxAge:maxAge*1000});
        res.status(200).json({user: user._id});
    } catch (error) {
        const err = handlerError(error);
        res.status(400).json({err});
    }
}
module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        maxAge: 1,
    });
    res.redirect('/');
};
