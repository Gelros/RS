const UserModel = require("../models/user")

//Contrôler que les ID sont reconnus par la base de donnée
const ObjectId = require("mongoose").Types.ObjectId



module.exports.getAllUsers = async (req, res) => {
    const users = await UserModel.find().select("-password")
    res.status(200).json(users)
}



//Récuperer un utilisateur
module.exports.getOneUser = (req, res) => {
//req.params est ce qui est passé dans l'url
console.log(req.params);
if (!ObjectId.isValid(req.params.id)) {
    res.status(400).send(`Id unknown : ${req.params.id}`)
} else {
    UserModel.findOne({_id : req.params.id})
    .select("-password")
    .then((user) => {
        if (user) res.send(user)
        else console.log("Id unknown :" + req.params.id);
    })
}}



// Modification
module.exports.updateUser = async (req, res) => {
 if (!ObjectId.isValid(req.params.id)) {
    res.status(400).send(`Id unknown : ${req.params.id}`)
 } 

 try {
    await UserModel.findOne({_id : req.params.id})
    .then((bio) => {
        if (bio.id === req.params.id) {
            UserModel.updateOne(
                { _id: req.params.id},

                {
                    $set : {
                        bio : req.body.bio
                    }
                },
                
                { new: true, upsert: true, setDefaultsOnInsert:true },
            ).then(() => res.status(200).json({message: "Objet modifié"}))
            .catch((err) => res.status(500).json({message: err}))
        }
    })
 } catch (err) {
    res.status(500).send({message: err})
 }
}



//Suppression

module.exports.deleteUser = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).send(`Id unknown : ${req.params.id}`)}
        try {
            await UserModel.deleteOne({_id: req.params.id}).exec()
            return res.status(200).json({message: "Supprimé"})
        } catch (err) {
            return res.status(500).json({message: err})
        }
    
}



//Follow et UnFollow

module.exports.follow = async (req, res) => {
    if (
      !ObjectId.isValid(req.params.id) ||
      !ObjectId.isValid(req.body.idToFollow)
    )
      return res.status(400).send("ID unknown : " + req.params.id);
  
    try {
        const filter =  {_id: req.params.id}
        const update = { $addToSet: { following: req.body.idToFollow }}
        
      // add to the follower list
      
        const following = await UserModel.findOneAndUpdate(filter, update, {
        new: true,
        upsert: true,
        rawResult: true // Return the raw result from the MongoDB driver
      });
      res.json(following)
      
      
      // add to following list
     const filterFollowers = {_id: req.body.idToFollow}
     const updateFollowers = {$addToSet : { followers: req.params.id}}

       await UserModel.findOneAndUpdate(filterFollowers, updateFollowers, {
        new: true,
        upsert: true,
        rawResult: true
      });
      
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  };


  //Unfollow un utilisateur

module.exports.unFollow = async (req,res) => {
    if (
        !ObjectId.isValid(req.params.id) ||
        !ObjectId.isValid(req.body.idToUnFollow)
      )
        return res.status(400).send("ID unknown : " + req.params.id);

    try {
        
        const filter =  {_id: req.params.id}
        const update = { $pull: { following: req.body.idToUnFollow }}

      
        const following = await UserModel.findOneAndUpdate(filter, update, {
        new: true,
        upsert: true,
        rawResult: true // Return the raw result from the MongoDB driver
      });
      res.json(following)
      
      
     
     const filterFollowers = {_id: req.body.idToUnFollow}
     const updateFollowers = {$pull : { followers: req.params.id}}

       await UserModel.findOneAndUpdate(filterFollowers, updateFollowers, {
        new: true,
        upsert: true,
        rawResult: true
      });
        
    }catch (err) {
        return res.status(500).json({message: err})
    }
}