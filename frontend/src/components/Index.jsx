import React, {useState} from 'react';
import { useEffect } from 'react';
import './Index.css';
import upArrow from '../images/upArrow.png';
import downArrow from '../images/downArrow.png';
import { BASE_URL } from '../../config.js';

import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe('pk_live_51RasbSGH1vcrVSr3rgIIWmyj1hRvkn2L92NGPHQsIMK4qGunf6XiQfS3sB1aCabisxDwgQEBSg0Q1ndwxOXxyAtP00vIyFBEH4'); // Your Stripe Publishable Key

function Index() {




    const [totalDonations, setTotalDonations] = useState(null);
    const [totalPending, setTotalPending] = useState(null);
    const [totalStripe, setTotalStripe] = useState(null);
    
    const [topDonors, setTopDonors] = useState([]);



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


    const aboutAction = () => {
        const landing = document.getElementById('landing-page');
        const about = document.getElementById('about-page');
      
        landing.style.display = 'none';
        about.style.display = 'block';
        window.scrollTo({ top: 0});
    }


    

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const response = await fetch(`${BASE_URL}/info`);
                const data = await response.json();
    
                // Convert cents to dollars and store as number
                setTotalDonations((data.total_donations ?? 0) / 100);
                setTotalPending((data.pending ?? 0) / 100);
                setTotalStripe((data.stripe ?? 0) / 100);
                setTopDonors(data.top_donors || []);
            } catch (err) {
                console.error('Failed to fetch backend info:', err);
            }
        };
        fetchInfo();
    }, []);
















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
    
        stripe.redirectToCheckout({ sessionId: data.id });
    }




    return (
        <div>
            <div id="landing-page">
                <div className="text">
                    <h1>Stop the Machine</h1>
                    <h2>AI will take our jobs</h2>
                    <p> In 10 years time, up to 50% of our jobs could vanish as AI replaces human labour across industries.</p>

                    <h2>AI will destabalize society</h2>
                    <p> Over the next 20 years, AI threatens to: </p>
                    <ul> 
                        <li>Seize control of news and media through mass disinformation</li>
                        <li>Collapse higher education as credentials lose value</li>
                        <li>Undermine the legal system and courts</li>
                        <li>Disrupt governments and political stability worldwide</li>
                    </ul>
                    
                    <h2>AI could wipe out humanity </h2>
                    <p> AI is the greatest existential threat to humanity. While individual estimates vary, all serious experts agree that the risk is real - and rising. 
                        Some estimate a 10% chance of extinction over the next 100 years. Others warn it may be as high as 90%. 
                    </p>
                    
                    <h2>Time is running out</h2>
                    <p> We have 5 to 15 years before Artificial General Intelligence is created. Once that happens, it's game over. Humans become irrelevant - and likely extinct.
                        We must act now to prevent the creation of an artificial superintelligence. AI is a threat to me, it is a threat to you, it is a threat to all of us.
                        We must act now - before it is too late. 
                    </p>

                    <h2> What can we do about it?</h2>
                        <div>
                            <h3> Spread the word</h3>

                            <div><b>People need to know what's coming — before it's too late.</b></div>
                            <p>
                            Share your own custom link to help spread the warning.  
                            For example, if your name is John Smith, you can share   
                            <code> stopthemachine.org/john-smith </code>  
                            Each time a new person visits your link, "John Smith" will rise on the Top Sharers leaderboard.
                            </p>

                            <label>Name: </label>
                            <input type="text" name="name" placeholder="type in a name or phrase to get your sharable link"/>
                            <span> Link: <a>stopthemachine.org</a> </span>

                            <p>Total Unique Visitors: 0</p>

                            <p>Top Sharers: </p>

                            


                        </div>
                        <br></br>
                        <div>
                            <h3>Donate</h3>

                            <div><b>$1 Warns 200 People</b></div>
                            <div>100% of donations fund digital ads warning people about AI risks. </div>
                            <br></br>



                            <form id="donation-form" onSubmit={handleDonationSubmit}>
                                <label>Amount:</label>
                                <input type="number" name="donationAmount" required min="0.50" step="0.01"/>
                                <br></br>

                                <label>Currency:</label>
                                <select name="currency" defaultValue="USD" required>
                                    <option value="USD">USD - United States Dollar</option>
                                </select>
                                <br></br>

                                <label>Name: (optional)</label>
                                <input type="text" name="name"/>
                                <br></br><br></br>
                                <div><button id ="donate-button">Donate</button></div>
                                <br></br>
                            </form>

                            Total Donations: {totalDonations !== null ? `$${totalDonations.toFixed(2)}` : 'Loading...'}
                            <br></br>
                            <br></br>

                            Top Donors: 
                            <table>
                                {topDonors.map((donor, index) => (
                                    <tr key={donor.name}>
                                        <td>#{index + 1}</td>
                                        <td>{donor.name}</td>
                                        <td>${(donor.total_donated / 100).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </table>

                        </div>
                        <div id="about-container">
                            <a id="about" onClick={aboutAction} > about</a>
                        </div>
                        
                </div>

            </div>
            <div id="about-page" style={{display: 'none'}}>
                <div className="text"> 
                    <h1>About</h1>

                    <h2>The Architect</h2>
                    <p> Hi, I'm James. I like sweets, reading, and spending time in nature.</p>
                    
                    <img></img>
                    
                    <p> I'm 20 years old, and from Australia - but don't hold that against me. I don't drink alcohol, for health reasons. I've never had a single drop my entire life!
                        I don't follow sports. In terms of famous sports people, I couldn't name more than the fingers on one hand. I also squat on the toilet. Yes, you read that right. I perch up like a bird on the toilet seat. I read somewhere that 
                        it's more "efficient" that way... 
                    </p>

                    <img ></img>
                    
                    <h2> How StopTheMachine Operates</h2>
                    <p> A couple of important things to mention. First, i'm the person behind StopTheMachine. Everything here is personally created and maintained by me - and only me. That means I do all the designing, the writing, the programming, the advertising, ect. 
                        And it will always be just me - nomatter what. So the point of this is too keep operating costs as low as possible, so that 100% of donations go to online awareness ads. Minor expenses like web hosting and that sort of stuff, that's very cheap and is covered by me personally.    
                    </p>

                    <p>
                        In terms of how it works, basically I do one simple thing. I take in donations and use those donations to run online ads warning people about the risks of AI. That's it. Every donation and every ad purchase is logged publically, so you can match things up. Additionally, I screen record every single ad purchase I make. Those screen recordings are also publically available.  
                        

                    </p>

                    <h2> Legal Status</h2> 
                        <p>
                        Another thing to mention: StopTheMachine is the non-profit initiative of an Australian sole-trader registered under the name "Beta Products". This means that I am personally responsible for the promise that 100% of donations go to online ads. I have skin in the game. Any misappropriation of donations - to so much as buy a cup of coffee
                        - could send me to jail. My personal assets could be seized, ect ect.  
                        </p>
                        <p>
                        Unfortunately, as I am not registered as a charity donations are not tax deductible. If I was a charity, that would mean an expensive board of directors, less control, and less speed. This way is simpler and cheaper.
                        In regards to the relationship between Beta and StopTheMachine, basically it works like this. If I need to I can transfer money from Beta to StopTheMachine. However, money cannot go the other way around. Another thing, so all parts of StopTheMachine are in the public domain. They can be freely used, shared, copied, whatever. The code is also open source. 
                        However, this does not apply to other parts of Beta, which are proprietary. 
                        </p>



                </div>

                
            </div>
        </div>
    );
    
}
export default Index;