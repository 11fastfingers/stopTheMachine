import React, {useState} from 'react';
import './Index.css';
import upArrow from '../images/upArrow.png';
import downArrow from '../images/downArrow.png';
import BASE_URL from '../../config.js';

import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe('pk_live_51RasbSGH1vcrVSr3rgIIWmyj1hRvkn2L92NGPHQsIMK4qGunf6XiQfS3sB1aCabisxDwgQEBSg0Q1ndwxOXxyAtP00vIyFBEH4'); // Your Stripe Publishable Key

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

    const handleDonationSubmit = async (event) => {
        event.preventDefault();

        const form = event.target;
        const amount = parseFloat(form.donationAmount.value);
        const currency = form.currency.value;
        const name = form.name.value || 'Anonymous';


        const response = await fetch(`${BASE_URL}/donate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount, currency, name }),
        });
    
        const data = await response.json();
        const stripe = await stripePromise;
    
        stripe.redirectToCheckout({ url: data.url });
    }




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
                                    <li>StopAI <a href="https://stopai.info">https://stopai.info</a></li>
                                    <li>Statement on AI risk of Extinction: <a href="https://en.wikipedia.org/wiki/Statement_on_AI_risk_of_extinction">https://en.wikipedia.org/wiki/Statement_on_AI_risk_of_extinction</a></li>
                                </ul>

                            </div>
                            
                            
                        ))}
                    </li>
                    <li>
                        {renderDropdown("Avoid AI Products", "Avoid AI Products", (
                            <div>
                                <br></br>
                                <b>Don't Make AI smarter</b>
                                <p>    
                                    By using AI products, AI models get smarter and smarter. 
                                    So avoid using AI products whenever possible.
                                </p>
                                <p>
                                    If you must use AI, avoid giving feedback. Human feedback is essential to the development of large language models. 
                                    Even better, give misinformation. E.g if ChatGPT asks you which of two options you prefer, 
                                    choose the option you like the least.
                                </p>

                                <b>Vote with your Dollars</b> 
                                <p>
                                   Do not purchase any AI products. You will be directly funding AI development. 
                                   If you must use AI, always use the free version. If you are a decision maker at a company, think twice
                                   before integrating AI. The short term savings and productivity gains are tempting. But long term you will be funding your own replacement. 
                                </p>
                                <p>
                                   Do not invest in AI. Startup AI companies are especially dangerous to invest in. They can move fast, can innovate rapidly, and are reckless in their development of artificial intelligence.
                                </p>
                                <p>
                                   Even if you are wealthy, investing in AI is a bad idea. AI is a direct threat to all of your non-ai investments. 
                                   More importantly, you cannot own something vastly more intelligent than you are. Once artificial general intelligence is created, 
                                   you will lose control. Your wealth will be destroyed. You could die. 
                                </p>
                            </div>
                        ))}
                    </li>
                    <li>
                        {renderDropdown("Join the Movement", "Join the Movement", (
                            <div>
                                <br></br>
                                <div>Reddit: <a href="https://www.reddit.com/r/stopthemachine/">https://www.reddit.com/r/stopthemachine/</a></div>
                                <div>Discord: <a href="https://discord.gg/jutT6WB9">https://discord.gg/jutT6WB9</a></div>
                            
                            </div>
                            
                        ))}
                    </li>
                    <li>
                        {renderDropdown("Donate", "Donate", (
                            <div>
                                <br></br>
                                <form id="donation-form" onSubmit={handleDonationSubmit}>

                                    <label>Amount:</label>
                                    <input type="number" name="donationAmount" required min="1" step="0.01"/>
                                    <br></br>

                                    <label>Currency:</label>
                                    <select name="currency" defaultValue="USD" required>
                                        <option value="AED">AED - United Arab Emirates Dirham</option>
                                        <option value="AUD">AUD - Australian Dollar</option>
                                        <option value="BRL">BRL - Brazilian Real</option>
                                        <option value="CAD">CAD - Canadian Dollar</option>
                                        <option value="CHF">CHF - Swiss Franc</option>
                                        <option value="CNY">CNY - Chinese Yuan</option>
                                        <option value="CZK">CZK - Czech Koruna</option>
                                        <option value="DKK">DKK - Danish Krone</option>
                                        <option value="EUR">EUR - Euro</option>
                                        <option value="GBP">GBP - British Pound</option>
                                        <option value="HKD">HKD - Hong Kong Dollar</option>
                                        <option value="HRK">HRK - Croatian Kuna</option>
                                        <option value="HUF">HUF - Hungarian Forint</option>
                                        <option value="IDR">IDR - Indonesian Rupiah</option>
                                        <option value="ILS">ILS - Israeli New Shekel</option>
                                        <option value="INR">INR - Indian Rupee</option>
                                        <option value="JPY">JPY - Japanese Yen</option>
                                        <option value="KRW">KRW - South Korean Won</option>
                                        <option value="MXN">MXN - Mexican Peso</option>
                                        <option value="MYR">MYR - Malaysian Ringgit</option>
                                        <option value="NOK">NOK - Norwegian Krone</option>
                                        <option value="NZD">NZD - New Zealand Dollar</option>
                                        <option value="PHP">PHP - Philippine Peso</option>
                                        <option value="PLN">PLN - Polish Złoty</option>
                                        <option value="RON">RON - Romanian Leu</option>
                                        <option value="SAR">SAR - Saudi Riyal</option>
                                        <option value="SEK">SEK - Swedish Krona</option>
                                        <option value="SGD">SGD - Singapore Dollar</option>
                                        <option value="THB">THB - Thai Baht</option>
                                        <option value="TRY">TRY - Turkish Lira</option>
                                        <option value="TWD">TWD - New Taiwan Dollar</option>
                                        <option value="USD">USD - United States Dollar</option>
                                        <option value="ZAR">ZAR - South African Rand</option>
                                    </select>
                                    <br></br>

                                    <label>Name: (optional)</label>
                                    <input type="text" name="name"/>
                                    <div><button>Donate</button></div>
                                    
                                    <br></br>

                                </form>


                                <p> Total Donations: $0</p>
                                <p> Donation Leaderboard</p>
                                <p> Spending Distribution</p>
                            </div>
                           
                        ))}
                    </li>
                    <li>
                        {renderDropdown("Volunteer", "Volunteer", (
                            <div>
                                <br></br>
                                <ul>Major Contributors:
                                    <li> James Spencer (founder)
                                        
                                        <div> -leadership and vision</div>
                                        <div> -community building</div>
                                        <div> -recruitment</div>
                                        <div> -web development</div>
                                        <div> -graphic design</div>
                                        
                                    </li>
                                    
                                </ul>

                            </div>
                            
                        ))}
                        <br></br>
                    </li>
                    
                </ol>
                

            </div>
        </div>
    );
}
export default Index;