import React from 'react';
import Header from '../Header/Header';
import './AboutUs.css';

const people = [
    { id: 1, name: 'Michael Barry', github: 'https://github.com/Mike124892' },
    { id: 2, name: 'Dillon Bridgewater', github: 'https://github.com/SpacePirate3' },
    { id: 3, name: 'Steiner Christensen', github: 'https://github.com/SteinerChris' },
    { id: 4, name: 'Angel Lopez', github: 'https://github.com/AngelL-015' },
    { id: 5, name: 'Jeff Spinner', github: 'https://github.com/SpinnerJ' },
    { id: 6, name: 'Issa', github: 'https://github.com/Issa-73' }
];

const AboutUs = () => {
    return (
        <div>
            <Header />
            <div className="about-us-container">
                <h1>About The Project</h1>
                <div className="project-description">
                    <p>Welcome to our finance project!</p>
                    <p>Here's a brief overview of what we do...</p>
                    {/* Add more project description here as needed */}
                </div>
                <h2>Our Team</h2>
                <div className="people-container">
                    {people.map(person => (
                        <div className="person-card" key={person.id}>
                            <div className="person-content">
                                <h3>{person.name}</h3>
                                <a href={person.github} target="_blank" rel="noopener noreferrer">
                                    GitHub
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
