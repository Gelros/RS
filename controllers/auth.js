const User = require("../models/user")
const jwt = require("jsonwebtoken")
const {signUpErrors, signInErrors} = require("../utils/errors.utils")


const maxAge = 3 * 24 * 60 * 60 * 1000
const createToken = (id) => {
  return jwt.sign({id}, process.env.TOKEN_SECRET, {
    expiresIn: maxAge
  })
}
//Fonction qui permet de créer un compte

module.exports.signUp = async(req, res) => {
  console.log(req.body);

  //Déstructuring, req.body = pseudo,email, password
  const {pseudo, email, password} = req.body

  try {

    const user = await User.create({pseudo, email, password})
    res.status(201).json({user: user._id})
    
  } catch (error) {
    const errors = signUpErrors(error)
    res.status(400).send( {errors})
  }
}


//Fonction qui permet de se connecter à un compte

module.exports.signIn = async(req, res) => {
  const {email, password} = req.body

  try {
    const user = await User.login(email, password)
    const token = createToken(user._id)
    //Permet de lui attribuer un cookie qui contient le token secret
    console.log(token);
    res.cookie("jwt", token, {httpOnly: true, maxAge})
    res.status(200).json({user: user._id})
    
  } catch (error) {
    const errors = signInErrors(error)
    res.status(400).json({errors})
  }
}


//Fonction qui permet la déconnection

module.exports.logout = async(req, res) => {
  //Permet de lui retirer le cookie
  res.cookie('jwt', "", {maxAge: 1})
  res.redirect('/')
}