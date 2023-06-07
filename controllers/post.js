const PostModel = require("../models/post")

const UserModel = require("../models/user")

const { uploadErrors } = require("../utils/errors.utils")

const ObjectId = require('mongoose').Types.ObjectId


// *******CRUD*********

//Identifie tous les posts
module.exports.readPost = async (req, res) => {
await PostModel.find()
.then((data) => {
   res.status(200).json(data)
})
.catch((err) => res.status(400).json(console.log("data impossible" + err)))
// Le ".sort({ createdAt: -1})" permet de récupérer les posts du plus récents aux plus anciens
.sort({ createdAt: -1})
}
//**************************


//Sert a créer des posts sur sa page
module.exports.createPost = async (req, res) => {
    
    if(req.file !== null)
    {
    //     try {
    //     // Vérification du format 
    //     if (
    //      req.file.detectedMimeType == "image/jpg" ||
    //      req.file.detectedMimeType == "image/png" ||
    //      req.file.detectedMimeType == "image/jpeg"
    //     )
    //     throw Error( "invalid file")
       
    //     // 5000000 se mesure en ko
    //     if ( req.file.size > 500000) throw Error("max size")
       
    // }catch (err){
    //     const errors = uploadErrors(err)
    //     return res.status(400).json( errors)
    // }
    
   await PostModel.findOne({_id: req.params.id})
  .then((data) => {
    PostModel.updateOne(
      {_id: req.body.posterId},
      {$set : {picture: `./public/posts/${req.file.filename}
      `}},
      {new: true, upsert: true, setDefaultsOnInsert: true}
    ).then(() => res.status(201).json(data))
     .catch(() => res.status(400))
  })
    }


    const newPost = new PostModel(
        {
            posterId: req.body.posterId,
            message: req.body.message,
            picture: req.file !== null ? "./public/posts/" + req.file.filename : "",
            video: req.body.video,
            likers: [],
            comments: []
        }
    )

    try{
        const post = await newPost.save()
        return res.status(201).json(post)
    } catch (err) {
        return res.status(400).send(err)
    }
}
//**************************


//Met à jour les posts
module.exports.updatePost = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).send(`Id unknown : ${req.params.id}`)
     } 


     const updatedRecord = {
        message: req.body.message
     }

     await PostModel.findOne({_id: req.params.id})
     .then((data) => {
        PostModel.updateOne(
        {_id: req.params.id},
        {$set: updatedRecord},
        {new: true},
        ).then(() => res.status(200).send(data))
         .catch((err) => res.status(500).json( err))
     })
}

//**************************

module.exports.deletePost = (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).send(`Id unknown : ${req.params.id}`)
     } 

     PostModel.findOne({_id: req.params.id})
     .then((data) => {
        PostModel.deleteOne( 
            {_id: req.params.id}
        )
        .then(() => res.status(200).send(data))
        .catch((err) => console.log("Delete error " + err))
     })
}

//************************



//******Likes******/

module.exports.likePost = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).send(`Id unknown : ${req.params.id}`)
     } 

    try {
        
        //Celle-ci permet de voir qui a liké ce post
        await PostModel.findOne({_id: req.params.id})
        .then(() => {
            
            PostModel.updateOne(
                {_id: req.params.id},
                {$addToSet: {likers: req.body.id}},
                {new: true}
            )
            .catch((err) => res.status(400).send(err))
            
        })
        
        //Celle-ci permet de montrer quel post elle a liké
        await UserModel.findOne({_id: req.body.id})
        .then((data) => {
            
            UserModel.updateOne(
                {_id: req.body.id},
                {$addToSet: {likes: req.params.id}},
                {new: true}
            )
            .then(() => res.send(data))
            .catch((err) => res.status(400).send(err))
            
        })
    } catch (err) {
        res.status(500).send({message: err})
    }
}
//**************************


//**************************
module.exports.unLikePost = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).send(`Id unknown : ${req.params.id}`)
     } 

     try {
        
        
        await PostModel.findOne({_id: req.params.id})
        .then(() => {
            
            PostModel.updateOne(
                {_id: req.params.id},
                {$pull: {likers: req.body.id}},
                {new: true}
            )
            .catch((err) => res.status(400).send(err))
            
        })
        
       
        await UserModel.findOne({_id: req.body.id})
        .then((data) => {
            
            UserModel.updateOne(
                {_id: req.body.id},
                {$pull: {likes: req.params.id}},
                {new: true}
            )
            .then(() => res.send(data))
            .catch((err) => res.status(400).send(err))
            
        })
    } catch (err) {
        res.status(500).send({message: err})
    }

}

//**************************



//*******Comment********

module.exports.commentPost = (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).send(`Id unknown : ${req.params.id}`)
     } 

     try {
        return PostModel.findOne({_id: req.params.id})
        .then((data)=> {
            PostModel.updateOne(
                {_id:req.params.id},
                //Récupère puis envoie dans la base donnée les données de l'utilisateur qui commente
                {$push: {
                    comments: {
                      commenterId: req.body.commenterId,
                      commenterPseudo: req.body.commentPseudo,
                      text: req.body.text,
                      timestamp: new Date().getTime()
                    }
                }},
                {new: true}

        )
        .then(() => res.send(data))
        .catch((err) => res.status(400).send(err))
        })
     } catch (err) {
        return res.status(400).send(err)
     }
}
//**************************


//**************************
module.exports.editCommentPost = (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).send(`Id unknown : ${req.params.id}`)
     } 

     try {
        return PostModel.findOne({_id:req.params.id})
        .then((data)=> {
            //Variable qui récupère les données du commentaire ciblé
            const comment = data.comments.find((comment) => 
            comment._id.equals(req.body.commentId)
            )
            //*********

            console.log(req.body.commentId, comment);

            if(!comment) return res.status(404).send('Comment not found')
            comment.text = req.body.text 
            
            // .save() permet d'enregistrer dans la base de donnée
            return data.save()
            .then((data) => {
              res.status(200).send(data)
            })
            .catch((err) => res.status(500).send(err))
        })
     } catch (err) {
        return res.status(400).send(err)
     }
}
//**************************


//**************************
module.exports.deleteCommentPost = (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).send(`Id unknown : ${req.params.id}`)
     } 

     try {
        return PostModel.findOne({_id: req.params.id})
        .then((data)=> {
            PostModel.updateOne(
                {_id: req.params.id},
                {
                    $pull: {
                        comments : {
                            _id : req.body.commentId,
                        }
                    }
                },
                {new : true}
            )
            .then(() => res.send(data))
            .catch((err) => res.status(400).send(err))
        })

     } catch (err) {
        return res.status(400).send(err)

     }
}

//**************************