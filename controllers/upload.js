const UserModel = require('../models/user')
const { uploadErrors } = require('../utils/errors.utils')


// module.exports.uploadProfil = async (req, res) => {
//     try {
//         // Vérification du format 
//         if (
//          req.file.detectedMimeType !== "image/jpg" &&
//          req.file.detectedMimeType !== "image/png" &&
//          req.file.detectedMimeType !== "image/jpeg"
//         )
//         throw Error( "invalid file")
        
//         // 5000000 se mesure en ko
//         if ( req.file.size > 500000) throw Error("max size")
        
//     }catch (err){
//         const errors = uploadErrors(err)
//         return res.status(400).json( errors)
//     }
    
//     //Nom du fichier (il sera en jpg quoi qu'il arrive)
//     const fileName = req.body.name + ".jpg"

//     await pipeline(
//         res.file.stream,
//         //création du fichier et le chemin qu'il emprunte
//         fs.createWriteStream(
//             `${__dirname}/../client/public/uploads/profil/${fileName}`
//         )
//     )
// }

module.exports.uploadProfil = async (req, res) => {
  try {
             // Vérification du format 
             if (
              req.file.detectedMimeType == "image/jpg" ||
              req.file.detectedMimeType == "image/png" ||
              req.file.detectedMimeType == "image/jpeg"
             )
             throw Error( "invalid file")
            
             // 5000000 se mesure en ko
             if ( req.file.size > 500000) throw Error("max size")
            
         }catch (err){
             const errors = uploadErrors(err)
             return res.status(400).json( errors)
         }
  
   await UserModel.findOne({_id: req.params.id})
  .then((data) => {
    UserModel.updateOne(
      {_id: req.body.userId},
      {$set : {picture: `../public/images/${req.file.filename}
      `}},
      {new: true, upsert: true, setDefaultsOnInsert: true}
    ).then(() => {
      res.status(201).json("Objet enregistré")
      
    }).catch((err) => {
      res.status(400).json({message: err + " userId inconnu"})
    })
  })


}