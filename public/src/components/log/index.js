import React, { useState } from 'react';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

const Log = (props) => {

     const [signUp, setSignUp] = useState(props.signup)
     const [signIn, setSignIn] = useState(props.signin)

     const handleSign = (e) => {
       if(e.target.id === "register") {
         setSignUp(true)
         setSignIn(false)
       }else if(e.target.id === "login") {
        setSignUp(false)
        setSignIn(true)
       }
     }
     
    return (
        <div className="connection-form">
            <div className="form-container">
              <ul>
                  <li onClick={handleSign} id="register" className={signUp ? 'active-btn' : null}>
                    S'inscrire
                  </li>
                  <li onClick={handleSign} id="login" className={signIn ? 'active-btn' : null}>
                    Se connecter
                  </li>
              </ul>
              {signUp && <SignUpForm/>}
              {signIn && <SignInForm/>}
            </div>
        </div>
    );
};

export default Log;