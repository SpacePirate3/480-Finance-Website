import React, { useState } from 'react';
import './Header.css';
import { Link } from "react-router-dom";
import Menu from './menu/menu.js';

function Header() {
    // Define the state hook directly inside the functional component
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="backgroundRectangle">
            <Link to={"/"}>
                <div className="logo">
                    <div className="graphic">
                        <div className="rectangle rectangle1"></div>
                        <div className="rectangle rectangle2"></div>
                        <div className="rectangle rectangle3"></div>
                    </div>
                    <div>
                        <div className="text textGlance">AT-A-GLANCE</div>
                        <div className="text textFinance">FINANCE</div>
                    </div>
                </div>
            </Link>
            <div className="buttons">
                <Link to={"/"}><div className="text homeButton">HOME</div></Link>
                <div className="text homeButton">ABOUT US</div>
                <button className="menuButton" onClick={toggleMenu}>Menu</button> {/* Menu button */}
            </div>
            {isMenuOpen && <Menu />} {/* Render the menu conditionally */}
        </div>
    );
}

export default Header;
