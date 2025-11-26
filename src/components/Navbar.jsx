import React from "react";
import '../Styles/Navbar.scss';

const Navbar = () => {
    return (
        <div className='navbar'>
            <img src="" alt="" className="Logo" />
            <ul>
                <li>Accueil</li>
                <li>Présentation</li>
                <li>Compétence</li>
                <li>Projet</li>
                <li>Contact</li>
            </ul>
        </div>  
    )
}

export default Navbar