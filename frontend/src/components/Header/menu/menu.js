import React, { useState } from 'react';
import './Menu.css'; 

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="menu">
      <button className="menu-button" onClick={toggleMenu}>
        Menu
      </button>
      {isOpen && (
        <div className="menu-content">
          <ul>
            <li>Indices</li>
            <li>
              Stocks
              <ul>
                <li>Stock 1</li>
                <li>Stock 2</li>
                {/* Add stocks dynamically based on data from Django */}
              </ul>
            </li>
            <li>
              Popular Tech Stocks
              <ul>
                <li>Tech Stock 1</li>
                <li>Tech Stock 2</li>
                {/* Add popular tech stocks dynamically based on data from Django */}
              </ul>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Menu;
