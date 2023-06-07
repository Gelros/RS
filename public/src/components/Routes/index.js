import React from 'react';
import {Routes, Route} from "react-router-dom"
import Home from '../../pages/Home';
import Profil from '../../pages/Profil';
import Trend from '../../pages/Trend';
const index = () => {
    return (
        // Import des routes et définition des chemin par rapport aux composants
            <Routes>
               <Route path='/' element={<Home />}/>
               <Route path='/profil' element={<Profil />}/>
               <Route path='/trend' element={<Trend />}/>
               <Route path='*' element={<Home />}/>
            </Routes>
        
    );
};

export default index;