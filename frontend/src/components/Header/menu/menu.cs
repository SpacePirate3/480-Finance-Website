.menu {
    position: absolute; /* Position the menu relative to its containing element */
    top: 10vh; /* Adjust as needed to position the menu below the header */
    right: 0; /* Align the menu to the right */
    background-color: #232A31; /* Background color */
    width: 200px; /* Width of the menu */
    padding: 1em; /* Add some padding */
    transition: transform 0.3s ease; /* Smooth transition for sliding animation */
    transform: translateX(100%); /* Initially hide the menu off the screen */
}

.menu.open {
    transform: translateX(0); /* Slide the menu into view when open */
}

.menu-button {
    background-color: transparent; /* Transparent background */
    border: none; /* Remove border */
    color: #FFFFFF; /* Text color */
    font-size: 16px; /* Font size */
    cursor: pointer; /* Show pointer cursor on hover */
    outline: none; /* Remove outline on focus */
}

.menu-content {
    margin-top: 1em; /* Add some margin between the button and menu content */
}

.menu ul {
    list-style-type: none; /* Remove default list styles */
    padding: 0; /* Remove default padding */
    margin: 0; /* Remove default margin */
}

.menu ul li {
    color: #FFFFFF; /* Text color */
    padding: 0.5em 0; /* Add some padding top and bottom */
    cursor: pointer; /* Show pointer cursor on hover */
}

.menu ul li:hover {
    background-color: #37404B; /* Darker background color on hover */
}
