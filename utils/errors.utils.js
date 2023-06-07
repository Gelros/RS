module.exports.signUpErrors = (error) => {
  let errors = {pseudo : "", email:"", password:""}

  if (error.message.includes('pseudo')) {
    errors.pseudo = "Pseudo incorrect ou déjà pris"
  }

  if (error.message.includes('email')) {
    errors.email = "Email incorrect"
  }

  if (error.message.includes('password')) {
    errors.password = "Le mot de passe doit faire 6 caractères minimum"
  }

  if (error.code === 11000 && Object.keys(error.keyValue)[0].includes("pseudo")) {
    errors.pseudo = "Ce pseudo est déjà pris"
  }

  if (error.code === 11000 && Object.keys(error.keyValue)[0].includes("email")) {
    errors.email = "Email déjà prise"
  }

  return errors
}

module.exports.signInErrors = (error) => {
    let errors = { email:"", password:""}
  
  
    if (error.message.includes('email')) {
      errors.email = "Email incorrect"
    }
  
    if (error.message.includes('password')) {
      errors.password = "Mot de passe incorrect"
    }
  
    return errors
  }

  module.exports.uploadErrors = (err) => {
    let errors = {format: "", maxsize: ""}

    if (err.message.includes('invalid file'))
    errors.format = "Format incompatible"

    if (err.message.includes('max size'))
    errors.maxsize = "Ke fichier dépasse 500ko"

    return errors
  }