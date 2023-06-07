const multer = require("multer")

//Destination du fichier et genere un nom de fichier unique
const storage = multer.diskStorage({

    //La destination de stockage du fichier
    destination : (req, file, callback) => {
        callback(null, "public/posts")
    },
    filename : (req, file, callback) => {
        //Nome du fichier
        const name = req.body.posterId + Date.now() + ".jpg"
            callback(null, name);
    }
})

//export du middleware
module.exports = multer({storage}).single("image")