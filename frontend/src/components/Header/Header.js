import './Header.css';
import {Link} from "react-router-dom";
import React, { useState } from 'react';
import './Header.css';
import Menu from './menu';
import AboutUs from '../AboutUsPage/AboutUs.js';


function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="backgroundRectangle">
            <Link to={"/"} className={"logoLink"}>
                <div className="logo">
                    <div className="graphic">
                        {/* Rectangles are ordered from smallest to largest, bottom to top */}
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
                <Link to={"/about"}><div className="text homeButton">ABOUT US</div></Link> {/* Link to About Us page */}
                {/* Attach toggleMenu function to onClick event */}
                <div className="stock-contaner-menu" onClick={toggleMenu}>
                    <div className="stock-line-menu"></div>
                    <div className="stock-line-menu"></div>
                    <div className="stock-line-menu"></div>
                </div>
            </div>
            {/* Render the Menu component conditionally based on isMenuOpen state */}
            {isMenuOpen && <Menu />}
        </div>
    );
}

export default Header;
