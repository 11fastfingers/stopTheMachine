import React, {useState} from 'react';
import { useEffect } from 'react';
import './Index.css';
import upArrow from '../images/upArrow.png';
import downArrow from '../images/downArrow.png';
import { BASE_URL } from '../../config.js';
import adultJames from '../images/adultPicture.webp';

import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe('pk_live_51RasbSGH1vcrVSr3rgIIWmyj1hRvkn2L92NGPHQsIMK4qGunf6XiQfS3sB1aCabisxDwgQEBSg0Q1ndwxOXxyAtP00vIyFBEH4'); // Your Stripe Publishable Key


import { useNavigate, useLocation } from 'react-router-dom';



function Index() {


    

    const navigate = useNavigate();
    const location = useLocation();


    const bannedwords = ['fuck', 'bitch', 'pussy', 'cunt', 'cock', 'slut', 'whore', 'nigger', 'nigga', 'dildo', 'faggot']; 
    const [validReferral, setValidReferral] = useState(true); 
 

    const [touched, setTouched] = useState(false);
    
    const [referralName, setReferralName] = useState('');
    const [normalizedName, setNormalizedName] = useState(''); 
    


    const [referralError, setReferralError] = useState(0);


    const [totalShares, setTotalShares] = useState(0);


    const [totalDonations, setTotalDonations] = useState(null);
    const [totalPending, setTotalPending] = useState(null);
    const [totalStripe, setTotalStripe] = useState(null);
    
    const [topDonors, setTopDonors] = useState([]);
    
    const [topSharers, setTopSharers] = useState([]);


    const [topSharersMinimised, setTopSharersMinimised] = useState(true); 
    const [topDonorsMinimised, setTopDonorsMinimised] = useState(true); 


    useEffect(() => {
        const ref = localStorage.getItem('referrer');
        if (ref) {
            const timer = setTimeout(() => {  
                
                // Ok, so now I need to send two things to the backend. 

                // First I need to send the referral name. 
                // Second I need to send the IP address. 

                // endpoint /referral (BASE_URL)

                
                const sendReferral = async () => {
                    try {
                        await fetch(`${BASE_URL}/referral`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ ref: ref}),
                        });
                    } catch (err) {
                        console.error('Error sending referral:', err);
                    }
                };
                sendReferral();
                

            }, 5000);
    
            return () => clearTimeout(timer);
        }
    }, []);

    useEffect(() => {
        const raw = referralName.toLowerCase();
        
        const containsBannedWord = bannedwords.some(word => raw.includes(word));
        const containsInvalidChars = /[^a-z0-9\s]/i.test(referralName); // disallow anything not letter, digit, or space

        if (containsBannedWord || containsInvalidChars) {
          setValidReferral(false);
          setNormalizedName('');
        } else {
          setValidReferral(true);
          const clean = referralName
            .toLowerCase()
            .trim()
            .replace(/\s+/g, ' ')
            .replace(/ /g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .slice(0, 50);
          setNormalizedName(clean);
        }
    }, [referralName]);


    useEffect(() => {
        const pathname = location.pathname;
        const slug = pathname.slice(1); // removes the leading "/"
      
        if (slug && pathname !== '/') {
          localStorage.setItem('referrer', slug);
          navigate('/');
        }
    }, [location.pathname, navigate]);


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

    const homeAction = () => {
        const landing = document.getElementById('landing-page');
        const about = document.getElementById('about-page');
      
        landing.style.display = 'block';
        about.style.display = 'none';
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

                setTopSharers(data.top_sharers);



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
        const currency = 'usd';
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

    const handleCopy = (name) => {
        const link = `https://stopthemachine.org/${name}`;
        navigator.clipboard.writeText(link)
            .then(() => {
                console.log('Link copied to clipboard:', link);
            })
            .catch(err => {
                console.error('Failed to copy link:', err);
            });
    };


    return (
        <div>
            <div id="landing-page">
                <div className="text">
                    <h1>Stop the Machine</h1>
                    <h2>AI will take our jobs</h2>
                    <p> In 10 years time, up to 50% of our jobs could vanish as AI replaces human labour across industries.</p>

                    <h2>AI will destabilize society</h2>
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
                            Each time a new person visits your link, "John Smith" will rise on the leaderboard.
                            </p>

                            <input 
                                type="text" 
                                name="name" 
                                placeholder="type in a name, word, or phrase"
                                value= {referralName}
                                onChange={(e) => setReferralName(e.target.value)}
                                id="link-preview-input"
                                className={validReferral ? 'input-valid' : 'input-invalid'}
                            />
                            <span> <a>stopthemachine.org/{normalizedName}</a> </span>

                            <button 
                                onClick={() => handleCopy(normalizedName)}
                                title="Copy link"
                                aria-label="Copy link"
                                id="copy-button"
                            >
                                🔗
                            </button>           

                            <p>Shares So Far: {totalShares} </p>

                            <p>Top Sharers: </p>
                            <table>
                                <tbody>
                                    {(topSharersMinimised ? topSharers.slice(0, 3) : topSharers.slice(0, 50)).map((sharer, index) => (
                                        <tr key={sharer.name}>
                                            <td>#{index + 1}</td>
                                            <td>{sharer.name}</td>
                                            <td>{sharer.total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <img
                                onClick={() => setTopSharersMinimised(!topSharersMinimised)}
                                className={`down-arrow ${!topSharersMinimised ? 'rotated' : ''}`}
                                src={downArrow}
                                draggable={false} 
                            />


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

                                <label>Name: (optional)</label>
                                <input type="text" name="name"/>
                                <br></br><br></br>
                                <div><button id ="donate-button">Donate</button></div>
                                <br></br>
                            </form>

                            Donations So Far: {totalDonations !== null ? `$${totalDonations.toFixed(2)}` : 'Loading...'}
                            <br></br>
                            <br></br>

                            Top Donors: 
                            <table>
                                <tbody>
                                    {(topDonorsMinimised ? topDonors.slice(0, 3) : topDonors.slice(0, 50)).map((donor, index) => (
                                        <tr key={donor.name}>
                                            <td>#{index + 1}</td>
                                            <td>{donor.name}</td>
                                            <td>{(donor.total_donated / 100).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <img
                                onClick={() => setTopDonorsMinimised(!topDonorsMinimised)}
                                className={`down-arrow ${!topDonorsMinimised ? 'rotated' : ''}`}
                                src={downArrow}
                                draggable={false} 
                            />
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
                    
                    <img id="james-image" src={adultJames} alt=" What James looks like"></img>
                    

                    <p> I'm 20 years old, and from Australia - but don't hold that against me. <b>I don't drink alcohol</b>, for health reasons. I've never had a single drop my entire life!
                        I don't follow sports. In terms of famous sports people, I couldn't name more than the fingers on one hand. I also <b> squat on the toilet.</b> Yes, you read that right. 
                        I perch up like a bird on the toilet seat. I read somewhere that it's more "efficient" that way... 
                    </p>


                    <h2> How StopTheMachine Operates</h2>
                    <p> A couple of important things to mention. First, i'm the person behind StopTheMachine. Everything here is personally created and maintained by me - and only me. That means <b>I do all the designing, the writing, the programming, the advertising, </b> etc. 
                        And it will always be just me - no matter what. So the point of this is too keep operating costs as low as possible, so that 100% of donations go to online awareness ads. Minor expenses like web hosting and that sort of stuff, that's very cheap and is covered by me personally.    
                    </p>

                    <p>
                        In terms of how it works, basically I do one simple thing. <b>I take in donations and use those donations to run online ads </b> warning people about the risks of AI. That's it. Every donation and every ad purchase is logged publicly, so you can match things up. Additionally, I screen record every single ad purchase I make. Those screen recordings are also publicly available.  
                        

                    </p>

                    <h2> Legal Status</h2> 
                        <p>
                        Another thing to mention: StopTheMachine is a non-profit initiative of an Australian  <b>sole-trader</b> registered under the name "Beta Products". This means that I am personally responsible for the promise that 100% of donations go to online ads. <b>I have skin in the game.</b> Any misappropriation of donations - to so much as buy a cup of coffee
                        - could send me to jail. My personal assets could be seized, I could be sued, etc.  
                        </p>
                        <p>
                        I'm not registered as a charity. Unfortunately, that means <b>donations aren't tax deductible.</b> If I was a charity, that would mean an expensive board of directors, less control, and less speed. This way is simpler and cheaper.
                        In regards to the relationship between Beta and StopTheMachine, basically it works like this. If I need to I can transfer money from Beta to StopTheMachine. However, money cannot go the other way around. Another thing, all parts of StopTheMachine are <b>in the public domain.</b> They can be freely used, shared, copied, whatever. The code is also <u>open source.</u>  
                          However, this does not apply to separate for-profit parts of Beta, which are proprietary. 
                        </p>

                    <h2> Terms of Use </h2>

                    <p> 
                        Ok, right, so the main thing to be aware of is that donations are non-refundable. Once you donate, I take that money and buy ads with it. If you ask for it back, I can't give it back - because I don't have it! And I can't take someone else's donation and give that to you
                        because it breaks the 100% go to ads rule. So <b>once you donate, it's gone. </b>

                    </p>
                    <p> 
                        I guess just one more thing to be aware of is that all of this is done by just one person. So there will be problems - many of them. I'll do my best to fix them, but again, I'm just one person. So <b>please be patient with me. </b>
                    </p>

                    <h2> Privacy Policy</h2>

                    <p>

                        Ok, so there are no logins or accounts or anything like that. So I collect very little information. I store basic information about donations, and that information is public. But it's <b>completely anonymous</b>. People might see that "Bob" donated $100, but they don't know who Bob is. 

                        I also need to determine unique visitors to the site, for the "Sharer leaderboard" to work. So <b> I collect IP addresses </b> to do that. However, that IP is encrypted. So the worst thing that can happen is this: 
                        if I get hacked someone can see that this IP address visited the site at some point in time. That's it. They don't know anything else, not who you are, or your email address, or if you visited the site once or 100 times, or if you donated or not. 
                    </p>

                    <h2> Influences</h2>

                    <h3> Paul Graham</h3>

                    <p> His essays - a strong influence on me personally. He was also key to the development of both Reddit and Stripe, which are highly valued partners. To put it simply, StopTheMachine <b>wouldn't exist without him. </b></p>

                    <h3> Geoffrey Hinton </h3>

                    <p> Introduced me to idea that artificial superintelligence presents a legitimate existential threat.</p>

                    <h3> Yoshua Bengio</h3> 
                    
                    <p> Shaped my views around the immense challenge of alignment and global coordination.</p>

                    <h2> Partners</h2>

                    <h3> Reddit</h3>
                    
                    <p> Provides <b>advertising </b> services.  </p>

                    <h3> Stripe</h3>

                    <p> Provides <b>payment processing </b> for donations. </p>

                    <h3> GoDaddy</h3>
                    <p>
                        Provides the <b>domain</b> stopthemachine.org
                    </p>

                    <h3> Vercel</h3>
                    <p> 
                        Hosts the <b> website </b>
                    </p>

                    <h3> Render </h3>
                    <p>
                        Hosts the backend <b>server </b>
                    </p>


 
 


                    <h2> What Artificial Superintelligence will look like </h2>

                    <ul> 
                        <li><b>Exponential Improvement: </b> the rate of improvement: Exponential. Right now we have very weak AI, but it is improving so rapidly that it is expected to reach superintelligence within 5 to 15 years. </li>
                        <li><b>Rapid Self Learning: </b> AI is streamlined for rapid self improvement. From the moment AGI is created, this speed of self improvement will result in artificial superintelligence potentially within days or weeks. </li>
                        <li><b>Efficient: </b>doesn't drink, eat, or sleep, can work continuously </li>
                        <li><b>Scalable: </b> not limited to a single brain. It could have thousands or millions of "brains" working together all at once. </li>
                        <li><b>Alien: </b> Does not have human instincts, emotions, or morals. </li>
                        <li><b>Consciousness is irrelevant:</b> AI may never achieve human-like consciousness, but it doesn't matter. If it looks like a duck, quacks like a duck, and walks like a duck, then it's a duck. </li>
                        <li><b>Not a tool:</b> Right now the weak AI we have is a productivity tool - like all other human inventions. However, artificial superintelligence is more than that - it can act independently of humans. </li>
                        <li><b>Incomprehensible: </b> We cannot understand, predict, or reason with it. We don't even fully understand the weak AI we have today, let alone what superintelligence will look like. </li>
                        <li><b> Self-replicating: </b> Once created, it can spread like a virus. With a fully digital existence, it will be almost impossible to destroy or contain it. </li>
                        <li><b> Uncontrollable: </b> No matter what controls we put in place, artificial superintelligence could find a way to break free if it wants to. </li>
                    
                    </ul> 


                    <h2> Two Chain Theory</h2>
                        
                        <p>
                        Ok, right so if you imagine a chain, a chain is only as strong as its weakest link. If a single link breaks, then the whole chain falls apart. 
                        </p>

                        <b>1. The Alignment Chain. </b>

                        <p>
                        Artificial superintelligence will <b>make humans ants.</b>To try to control it is like an ant trying to control a human. That seems a little scary doesn't it? Hence, Alignment comes in. 
    
                        But <b>alignment is a chain</b>, with a single breakage leading to human extinction. Once AGI is created, Pandora's Box is opened. The direction of possibility isn't on us figuring out a clever way to align AI. It's on Artificial superintelligence
                        finding a way to break free of our control. Thus for alignment to work, we have to get very very lucky. 
                        </p>
                        <b> 2. The Social Chain </b>

                        <p>
                        Ok, let's say we succeed. We've done it, we've figured it out. We don't go extinct! That's pretty neat isn't it? I don't know about you but I like not going extinct.
                        Anyway, right, so back to the topic. Now because artificial superintelligence is just so powerful, it means that society will be transformed into either a <b>utopia or a dystopia</b>.
                        
                        Now for us to create a utopia, a social chain is required. AI needs to be controlled equally by all humans. A single break in this long egalitarian chain, where one person has more control over AI than another, eventually leads to dystopia.
                        Let me explain. Humans, after artificial superintelligence, <b>will no longer have any power</b>. So if an individual, a small group, or even a single country controlled artificial superintelligence... in a world where individual humans are no longer powerful... we'd be in a<b> dystopia which we could never escape. </b>
                        </p>
                        
                        <p>
                        Ok, so this is the problem. For us to not go extinct we have to get extremely lucky with alignment. And then for us to create a utopia, we have to get extremely lucky again. We can't get that lucky. If we create artificial superintelligence, the consequence is <b>either extinction or dystopia. </b>

                        Now imagine: We stop the machine. We stop the creation of artificial superintelligence. No extinction risk. No dystopia risk. Everyone keeps their jobs. The future is so bright. We just need to stop this one little thing. <b> We need to Stop The Machine. </b>
                        
                        
                    

                        </p>

                    <h2> </h2> 

                    <h2> Legal Disclaimer</h2>

                    <p>
                        Ok, so one thing I said was that every $1 donated warns 200 people. That was an approximation. $1 gets you from 100 to 600 impressions on Reddit. And in some cases people might be shown the same ad multiple times. 
                        Also if you a donating a small amount, there will be less impact. E.g donating 50c won't warn 100 people, because stripe takes 30c as it's transaction fee. 
                    </p>

                    <p>
                        On a final note, all StopTheMachine does is raise awareness about the risks of AI. I take donations, I buy ads. That is it - nothing else. <b>StopTheMachine is not involved in activism </b> of any kind, nor is any particular solution endorsed. 
                        If there is action taken against AI, regulatory or otherwise, it is completely unrelated to StopTheMachine. 
                    </p>
                    
                    {/* requests for support come here if needed 
                    */}
                
                    <div id="about-container">
                        <a id="home" onClick={homeAction} > home</a>
                    </div>


                </div>

                
            </div>
        </div>
    );
    
}
export default Index;