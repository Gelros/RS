const router = require('express').Router()
const authController = require("../controllers/auth")
const userController = require("../controllers/user")
const uploadController = require("../controllers/upload")
const multer = require("../middleware/multer_config")

//auth

router.post("/register", authController.signUp)
router.post("/login", authController.signIn)
router.get("/logout", authController.logout)

//user

router.get("/", userController.getAllUsers)
router.get("/:id", userController.getOneUser)
router.put("/:id", userController.updateUser)
router.delete("/:id", userController.deleteUser)
router.patch("/follow/:id", userController.follow)
router.patch("/unFollow/:id", userController.unFollow)

//Upload

router.post('/upload',multer ,uploadController.uploadProfil)

module.exports = router