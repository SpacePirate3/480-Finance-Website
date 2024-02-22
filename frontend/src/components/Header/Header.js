import React from 'react';
import './Header.css';

function Header() {
    return (
        <div className="backgroundRectangle">
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
            <div className="buttons">
                <div className="text homeButton">HOME</div>
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
