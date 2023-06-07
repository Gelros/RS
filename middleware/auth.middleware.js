const jwt = require("jsonwebtoken")
const UserModel = require("../models/user")

// Checker le token de l'utilisateur pour voir si il est connu
module.exports.checkUser = (req, res, next) => {
    //Permet de stocker le cookie "jwt" (voir si il est connu)
    const token = req.cookies.jwt
    //Si le cookie est connu on le verifie avec "jwt.verify"
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            //Si la vérification n'est pas bonne on le déconnecte et supprime son token
            if (err) {
                console.log(token);
                //Déco
                res.locals.user = null
                //Suppression token
                res.cookie('jwt', '', {maxAge: 1})
                next()
            } else {
                //stock les information du compte dans cette variable
                let user = await UserModel.findById(decodedToken.id)
                res.locals.user = user
                console.log(user);
                next()
            }
        })
        //Si il y a pas de token on le déconnecte
    } else {
        res.locals.user = null
        next()
    }
}

//Fonction qui permet de voir si la personne correspond a ce qu'on a dans la base de donée
module.exports.requireAuth = (req, res, next) => {
    const token = req.cookies.jwt

    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {
               console.log(err);
            }else {
                console.log(decodedToken.id);
                next()
            }
        })
    }else{
        console.log("no Token");
    }
}