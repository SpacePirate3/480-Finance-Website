import React from 'react';
import './Header.css';
import {Link} from "react-router-dom";

function Header() {
    return (
        <div className="backgroundRectangle">
            <Link to={"/"}>
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
                <div className="text homeButton">ABOUT US</div>
                <div className="hamburger-menu">
                    <div className="hamburger"></div>
                    <div className="hamburger"></div>
                    <div className="hamburger"></div>
                </div>
            </div>
        </div>
    );
}

export default Header;
