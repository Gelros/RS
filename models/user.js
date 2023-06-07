const mongoose = require('mongoose')

const {isEmail} = require('validator')

const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema(
    {
        pseudo: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 55,
            unique: true,
            //trim supprime les espaces
            trim: true
          },
          email: {
            type: String,
            required: true,
            validate: [isEmail],
            lowercase: true,
            unique: true,
            trim: true,
          },
          password: {
            type: String,
            required: true,
            max: 1024,
            minlength: 6
          },
          picture: {
            type: String,
            default: "./uploads/profil/random-user.png"
          },
          bio :{
            type: String,
            max: 1024,
          },
          followers: {
            type: [String]
          },
          following: {
            type: [String]
          },
          likes: {
            type: [String]
          }
        },
        {
          timestamps: true,
    }
    
)

//Cryptage du MDP

userSchema.pre("save", async function(next){
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Permet lors du login de comparer le MDP de l'utilisateur et le MDP hashé
userSchema.statics.login = async function(email, password){
  //Récupère l'email
  const user = await this.findOne({email})
  if (user) {
    //Si l'email est correct bcrypt compare le mdp et le mdp hashé
    const auth = await bcrypt.compare(password, user.password)
    //Si c'est correct il connecte
    if (auth) {
      return user
      //le trhow permet d'arreter tout processus et d'utiliser le message pour l'afficher sur le front
    }
    throw Error("Mot de passe incorrect")
  }
  throw Error("Email incorrect")
}


const userModel = mongoose.model("user", userSchema)

module.exports = userModel