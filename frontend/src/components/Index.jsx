import React, {useState} from 'react';
import './Index.css';
import upArrow from '../images/upArrow.png';
import downArrow from '../images/downArrow.png';


function Index() {



    const [openDropdowns, setOpenDropdowns] = useState({
        Info: false,
        terms: false,
        privacy: false,
        contact: false
    });

    const toggleDropdown = (key) => {
        setOpenDropdowns(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const renderDropdown = (key, title, content) => (
        <div className={`dropdown ${openDropdowns[key] ? 'open' : ''}`}>
            <div className="dropdown-header" onClick={() => toggleDropdown(key)}>
                <span>{title}</span>
                <img
                    src={openDropdowns[key] ? upArrow : downArrow}
                    alt="toggle dropdown"
                    className="arrow"
                />
            </div>
            {openDropdowns[key] && (
                <div className="dropdown-content">{content}</div>
            )}
        </div>
    );

    return (
        <div>
            <div id="text">
                <h1>Stop the Machine</h1>
                <h2>AI will take our jobs.</h2>
                <p> In ten years time, up to 50% of our jobs could vanish as AI replaces human labour across industries.</p>

                <h2>AI will destabalize society.</h2>
                <p> Over the next 20 years, AI threatens to: 
                    <ul> 
                        <li>Seize control of news and media through mass disinformation</li>
                        <li>Collapse higher education as credentials lose value</li>
                        <li>Undermine the legal system and courts</li>
                        <li>Disrupt governments and political stability worldwide</li>
                    </ul>
                </p>
                <h2>AI could wipe out humanity. </h2>
                <p> AI is the greatest existential threat to humanity. While individual estimates vary, all serious experts agree that the risk is real - and rising. 
                    Some estimate a 10% chance of extinction over the next 100 years. Others warn it may be as high as 90%. 
                </p>
                
                <h2>Time is running out</h2>
                <p> We have 5 to 15 years before Artificial General Intelligence is created. Once that happens, it's game over. Humans become irrelevant - and likely extinct.
                    We must act now to prevent the creation of an artificial superintelligence. AI is a threat to me, it is a threat to you, it is a threat to all of us.
                    We must act now - before it is too late. 
                </p>

                <h2> What can we do about it?</h2>
                <ol>
                    <li>
                        {renderDropdown("Spread the Word", "Spread the Word", (
                            <div>
                                <ul>
                                    <li>Tell your friends and family</li>
                                    <li>Post on Social media</li>
                                    <li>Mention AI risk at school or work</li>
                                    <li>Contact your Government</li>
                                </ul>

                            <span> links:  </span>
                                <ul> 
                                    <li>Stop The Machine: <a href="https://stopthemachine.org">https://stopthemachine.org</a></li>
                                    <li>PauseAI <a href="https://pauseai.info">https://pauseai.info</a></li>
                                    <li>Statement on AI risk of Extinction: <a href="https://en.wikipedia.org/wiki/Statement_on_AI_risk_of_extinction">https://en.wikipedia.org/wiki/Statement_on_AI_risk_of_extinction</a></li>
                                </ul>

                            </div>
                            
                            
                        ))}
                    </li>
                    <li>
                        {renderDropdown("Avoid AI Products", "Avoid AI Products", (
                            <div>
                                <ul>
                                    <li>By using AI products, AI models get smarter and smarter</li>
                                    <li>Do not spend money on AI services </li>
                                    <li>Do not invest in AI</li>
                                </ul>
                            </div>
                        ))}
                    </li>
                    <li>
                        {renderDropdown("Join the Movement", "Join the Movement", (
                            <p>
                                Most people have no idea about this. 
                            </p>
                        ))}
                    </li>
                    <li>
                        {renderDropdown("Donate", "Donate", (
                            <button>Donate</button>
                        ))}
                    </li>
                    <li>
                        {renderDropdown("Volunteer", "Volunteer", (
                            <p>
                                Most people have no idea about this. 
                            </p>
                        ))}
                    </li>
                    
                </ol>
                

                
                <h2>Donation Leaderboard</h2>
                <h2>Donation Spending</h2>
                <h2>Volunteer Leaderboard</h2>
            </div>
        </div>
    );
}
export default Index;