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
                                <form id="donation-form">
                                    <label>Name:</label>
                                    <input type="text" name="name" required/>
                                    <br></br>

                                    <label>Amount:</label>
                                    <input type="number" name="donationAmount" required min="1" step="0.01"/>
                                    <br></br>

                                    <label>Currency:</label>
                                    <select name="currency" required>
                                        <option value="AED">AED - United Arab Emirates Dirham</option>
                                        <option value="AFN">AFN - Afghan Afghani</option>
                                        <option value="ALL">ALL - Albanian Lek</option>
                                        <option value="AMD">AMD - Armenian Dram</option>
                                        <option value="ANG">ANG - Netherlands Antillean Guilder</option>
                                        <option value="AOA">AOA - Angolan Kwanza</option>
                                        <option value="ARS">ARS - Argentine Peso</option>
                                        <option value="AUD">AUD - Australian Dollar</option>
                                        <option value="AWG">AWG - Aruban Florin</option>
                                        <option value="AZN">AZN - Azerbaijani Manat</option>
                                        <option value="BAM">BAM - Bosnia and Herzegovina Convertible Mark</option>
                                        <option value="BBD">BBD - Barbadian Dollar</option>
                                        <option value="BDT">BDT - Bangladeshi Taka</option>
                                        <option value="BGN">BGN - Bulgarian Lev</option>
                                        <option value="BHD">BHD - Bahraini Dinar</option>
                                        <option value="BIF">BIF - Burundian Franc</option>
                                        <option value="BMD">BMD - Bermudian Dollar</option>
                                        <option value="BND">BND - Brunei Dollar</option>
                                        <option value="BOB">BOB - Bolivian Boliviano</option>
                                        <option value="BRL">BRL - Brazilian Real</option>
                                        <option value="BSD">BSD - Bahamian Dollar</option>
                                        <option value="BWP">BWP - Botswana Pula</option>
                                        <option value="BYN">BYN - Belarusian Ruble</option>
                                        <option value="BZD">BZD - Belize Dollar</option>
                                        <option value="CAD">CAD - Canadian Dollar</option>
                                        <option value="CDF">CDF - Congolese Franc</option>
                                        <option value="CHF">CHF - Swiss Franc</option>
                                        <option value="CLP">CLP - Chilean Peso</option>
                                        <option value="CNY">CNY - Chinese Yuan</option>
                                        <option value="COP">COP - Colombian Peso</option>
                                        <option value="CRC">CRC - Costa Rican Colón</option>
                                        <option value="CVE">CVE - Cape Verdean Escudo</option>
                                        <option value="CZK">CZK - Czech Koruna</option>
                                        <option value="DJF">DJF - Djiboutian Franc</option>
                                        <option value="DKK">DKK - Danish Krone</option>
                                        <option value="DOP">DOP - Dominican Peso</option>
                                        <option value="DZD">DZD - Algerian Dinar</option>
                                        <option value="EGP">EGP - Egyptian Pound</option>
                                        <option value="ERN">ERN - Eritrean Nakfa</option>
                                        <option value="ETB">ETB - Ethiopian Birr</option>
                                        <option value="EUR">EUR - Euro</option>
                                        <option value="FJD">FJD - Fijian Dollar</option>
                                        <option value="FKP">FKP - Falkland Islands Pound</option>
                                        <option value="FOK">FOK - Faroese Króna</option>
                                        <option value="GBP">GBP - British Pound</option>
                                        <option value="GEL">GEL - Georgian Lari</option>
                                        <option value="GGP">GGP - Guernsey Pound</option>
                                        <option value="GHS">GHS - Ghanaian Cedi</option>
                                        <option value="GIP">GIP - Gibraltar Pound</option>
                                        <option value="GMD">GMD - Gambian Dalasi</option>
                                        <option value="GNF">GNF - Guinean Franc</option>
                                        <option value="GTQ">GTQ - Guatemalan Quetzal</option>
                                        <option value="GYD">GYD - Guyanese Dollar</option>
                                        <option value="HKD">HKD - Hong Kong Dollar</option>
                                        <option value="HNL">HNL - Honduran Lempira</option>
                                        <option value="HTG">HTG - Haitian Gourde</option>
                                        <option value="HUF">HUF - Hungarian Forint</option>
                                        <option value="IDR">IDR - Indonesian Rupiah</option>
                                        <option value="ILS">ILS - Israeli New Shekel</option>
                                        <option value="IMP">IMP - Isle of Man Pound</option>
                                        <option value="INR">INR - Indian Rupee</option>
                                        <option value="IQD">IQD - Iraqi Dinar</option>
                                        <option value="IRR">IRR - Iranian Rial</option>
                                        <option value="ISK">ISK - Icelandic Króna</option>
                                        <option value="JEP">JEP - Jersey Pound</option>
                                        <option value="JMD">JMD - Jamaican Dollar</option>
                                        <option value="JOD">JOD - Jordanian Dinar</option>
                                        <option value="JPY">JPY - Japanese Yen</option>
                                        <option value="KES">KES - Kenyan Shilling</option>
                                        <option value="KGS">KGS - Kyrgyzstani Som</option>
                                        <option value="KHR">KHR - Cambodian Riel</option>
                                        <option value="KID">KID - Kiribati Dollar</option>
                                        <option value="KMF">KMF - Comorian Franc</option>
                                        <option value="KRW">KRW - South Korean Won</option>
                                        <option value="KWD">KWD - Kuwaiti Dinar</option>
                                        <option value="KYD">KYD - Cayman Islands Dollar</option>
                                        <option value="KZT">KZT - Kazakhstani Tenge</option>
                                        <option value="LAK">LAK - Lao Kip</option>
                                        <option value="LBP">LBP - Lebanese Pound</option>
                                        <option value="LKR">LKR - Sri Lankan Rupee</option>
                                        <option value="LRD">LRD - Liberian Dollar</option>
                                        <option value="LSL">LSL - Lesotho Loti</option>
                                        <option value="LYD">LYD - Libyan Dinar</option>
                                        <option value="MAD">MAD - Moroccan Dirham</option>
                                        <option value="MDL">MDL - Moldovan Leu</option>
                                        <option value="MGA">MGA - Malagasy Ariary</option>
                                        <option value="MKD">MKD - Macedonian Denar</option>
                                        <option value="MMK">MMK - Burmese Kyat</option>
                                        <option value="MNT">MNT - Mongolian Tögrög</option>
                                        <option value="MOP">MOP - Macanese Pataca</option>
                                        <option value="MRU">MRU - Mauritanian Ouguiya</option>
                                        <option value="MUR">MUR - Mauritian Rupee</option>
                                        <option value="MVR">MVR - Maldivian Rufiyaa</option>
                                        <option value="MWK">MWK - Malawian Kwacha</option>
                                        <option value="MXN">MXN - Mexican Peso</option>
                                        <option value="MYR">MYR - Malaysian Ringgit</option>
                                        <option value="MZN">MZN - Mozambican Metical</option>
                                        <option value="NAD">NAD - Namibian Dollar</option>
                                        <option value="NGN">NGN - Nigerian Naira</option>
                                        <option value="NIO">NIO - Nicaraguan Córdoba</option>
                                        <option value="NOK">NOK - Norwegian Krone</option>
                                        <option value="NPR">NPR - Nepalese Rupee</option>
                                        <option value="NZD">NZD - New Zealand Dollar</option>
                                        <option value="OMR">OMR - Omani Rial</option>
                                        <option value="PAB">PAB - Panamanian Balboa</option>
                                        <option value="PEN">PEN - Peruvian Sol</option>
                                        <option value="PGK">PGK - Papua New Guinean Kina</option>
                                        <option value="PHP">PHP - Philippine Peso</option>
                                        <option value="PKR">PKR - Pakistani Rupee</option>
                                        <option value="PLN">PLN - Polish Złoty</option>
                                        <option value="PYG">PYG - Paraguayan Guaraní</option>
                                        <option value="QAR">QAR - Qatari Riyal</option>
                                        <option value="RON">RON - Romanian Leu</option>
                                        <option value="RSD">RSD - Serbian Dinar</option>
                                        <option value="RUB">RUB - Russian Ruble</option>
                                        <option value="RWF">RWF - Rwandan Franc</option>
                                        <option value="SAR">SAR - Saudi Riyal</option>
                                        <option value="SBD">SBD - Solomon Islands Dollar</option>
                                        <option value="SCR">SCR - Seychellois Rupee</option>
                                        <option value="SDG">SDG - Sudanese Pound</option>
                                        <option value="SEK">SEK - Swedish Krona</option>
                                        <option value="SGD">SGD - Singapore Dollar</option>
                                        <option value="SHP">SHP - Saint Helena Pound</option>
                                        <option value="SLE">SLE - Sierra Leonean Leone</option>
                                        <option value="SOS">SOS - Somali Shilling</option>
                                        <option value="SRD">SRD - Surinamese Dollar</option>
                                        <option value="SSP">SSP - South Sudanese Pound</option>
                                        <option value="STN">STN - São Tomé and Príncipe Dobra</option>
                                        <option value="SYP">SYP - Syrian Pound</option>
                                        <option value="SZL">SZL - Eswatini Lilangeni</option>
                                        <option value="THB">THB - Thai Baht</option>    
                                    </select>
                                    <br></br>

                                    <label>Country: </label>
                                    <select name="country">
                                        <option value="AF">Afghanistan</option>
                                        <option value="AL">Albania</option>
                                        <option value="DZ">Algeria</option>
                                        <option value="AD">Andorra</option>
                                        <option value="AO">Angola</option>
                                        <option value="AG">Antigua and Barbuda</option>
                                        <option value="AR">Argentina</option>
                                        <option value="AM">Armenia</option>
                                        <option value="AU">Australia</option>
                                        <option value="AT">Austria</option>
                                        <option value="AZ">Azerbaijan</option>
                                        <option value="BS">Bahamas</option>
                                        <option value="BH">Bahrain</option>
                                        <option value="BD">Bangladesh</option>
                                        <option value="BB">Barbados</option>
                                        <option value="BY">Belarus</option>
                                        <option value="BE">Belgium</option>
                                        <option value="BZ">Belize</option>
                                        <option value="BJ">Benin</option>
                                        <option value="BT">Bhutan</option>
                                        <option value="BO">Bolivia</option>
                                        <option value="BA">Bosnia and Herzegovina</option>
                                        <option value="BW">Botswana</option>
                                        <option value="BR">Brazil</option>
                                        <option value="BN">Brunei</option>
                                        <option value="BG">Bulgaria</option>
                                        <option value="BF">Burkina Faso</option>
                                        <option value="BI">Burundi</option>
                                        <option value="KH">Cambodia</option>
                                        <option value="CM">Cameroon</option>
                                        <option value="CA">Canada</option>
                                        <option value="CV">Cape Verde</option>
                                        <option value="CF">Central African Republic</option>
                                        <option value="TD">Chad</option>
                                        <option value="CL">Chile</option>
                                        <option value="CN">China</option>
                                        <option value="CO">Colombia</option>
                                        <option value="KM">Comoros</option>
                                        <option value="CD">Congo (DRC)</option>
                                        <option value="CG">Congo (Republic)</option>
                                        <option value="CR">Costa Rica</option>
                                        <option value="HR">Croatia</option>
                                        <option value="CU">Cuba</option>
                                        <option value="CY">Cyprus</option>
                                        <option value="CZ">Czech Republic</option>
                                        <option value="DK">Denmark</option>
                                        <option value="DJ">Djibouti</option>
                                        <option value="DM">Dominica</option>
                                        <option value="DO">Dominican Republic</option>
                                        <option value="EC">Ecuador</option>
                                        <option value="EG">Egypt</option>
                                        <option value="SV">El Salvador</option>
                                        <option value="GQ">Equatorial Guinea</option>
                                        <option value="ER">Eritrea</option>
                                        <option value="EE">Estonia</option>
                                        <option value="SZ">Eswatini</option>
                                        <option value="ET">Ethiopia</option>
                                        <option value="FJ">Fiji</option>
                                        <option value="FI">Finland</option>
                                        <option value="FR">France</option>
                                        <option value="GA">Gabon</option>
                                        <option value="GM">Gambia</option>
                                        <option value="GE">Georgia</option>
                                        <option value="DE">Germany</option>
                                        <option value="GH">Ghana</option>
                                        <option value="GR">Greece</option>
                                        <option value="GD">Grenada</option>
                                        <option value="GT">Guatemala</option>
                                        <option value="GN">Guinea</option>
                                        <option value="GW">Guinea-Bissau</option>
                                        <option value="GY">Guyana</option>
                                        <option value="HT">Haiti</option>
                                        <option value="HN">Honduras</option>
                                        <option value="HU">Hungary</option>
                                        <option value="IS">Iceland</option>
                                        <option value="IN">India</option>
                                        <option value="ID">Indonesia</option>
                                        <option value="IR">Iran</option>
                                        <option value="IQ">Iraq</option>
                                        <option value="IE">Ireland</option>
                                        <option value="IL">Israel</option>
                                        <option value="IT">Italy</option>
                                        <option value="JM">Jamaica</option>
                                        <option value="JP">Japan</option>
                                        <option value="JO">Jordan</option>
                                        <option value="KZ">Kazakhstan</option>
                                        <option value="KE">Kenya</option>
                                        <option value="KI">Kiribati</option>
                                        <option value="KP">North Korea</option>
                                        <option value="KR">South Korea</option>
                                        <option value="KW">Kuwait</option>
                                        <option value="KG">Kyrgyzstan</option>
                                        <option value="LA">Laos</option>
                                        <option value="LV">Latvia</option>
                                        <option value="LB">Lebanon</option>
                                        <option value="LS">Lesotho</option>
                                        <option value="LR">Liberia</option>
                                        <option value="LY">Libya</option>
                                        <option value="LI">Liechtenstein</option>
                                        <option value="LT">Lithuania</option>
                                        <option value="LU">Luxembourg</option>
                                        <option value="MG">Madagascar</option>
                                        <option value="MW">Malawi</option>
                                        <option value="MY">Malaysia</option>
                                        <option value="MV">Maldives</option>
                                        <option value="ML">Mali</option>
                                        <option value="MT">Malta</option>
                                        <option value="MH">Marshall Islands</option>
                                        <option value="MR">Mauritania</option>
                                        <option value="MU">Mauritius</option>
                                        <option value="MX">Mexico</option>
                                        <option value="FM">Micronesia</option>
                                        <option value="MD">Moldova</option>
                                        <option value="MC">Monaco</option>
                                        <option value="MN">Mongolia</option>
                                        <option value="ME">Montenegro</option>
                                        <option value="MA">Morocco</option>
                                        <option value="MZ">Mozambique</option>
                                        <option value="MM">Myanmar</option>
                                        <option value="NA">Namibia</option>
                                        <option value="NR">Nauru</option>
                                        <option value="NP">Nepal</option>
                                        <option value="NL">Netherlands</option>
                                        <option value="NZ">New Zealand</option>
                                        <option value="NI">Nicaragua</option>
                                        <option value="NE">Niger</option>
                                        <option value="NG">Nigeria</option>
                                        <option value="MK">North Macedonia</option>
                                        <option value="NO">Norway</option>
                                        <option value="OM">Oman</option>
                                        <option value="PK">Pakistan</option>
                                        <option value="PW">Palau</option>
                                        <option value="PA">Panama</option>
                                        <option value="PG">Papua New Guinea</option>
                                        <option value="PY">Paraguay</option>
                                        <option value="PE">Peru</option>
                                        <option value="PH">Philippines</option>
                                        <option value="PL">Poland</option>
                                        <option value="PT">Portugal</option>
                                        <option value="QA">Qatar</option>
                                        <option value="RO">Romania</option>
                                        <option value="RU">Russia</option>
                                        <option value="RW">Rwanda</option>
                                        <option value="KN">Saint Kitts and Nevis</option>
                                        <option value="LC">Saint Lucia</option>
                                        <option value="VC">Saint Vincent and the Grenadines</option>
                                        <option value="WS">Samoa</option>
                                        <option value="SM">San Marino</option>
                                        <option value="ST">Sao Tome and Principe</option>
                                        <option value="SA">Saudi Arabia</option>
                                        <option value="SN">Senegal</option>
                                        <option value="RS">Serbia</option>
                                        <option value="SC">Seychelles</option>
                                        <option value="SL">Sierra Leone</option>
                                        <option value="SG">Singapore</option>
                                        <option value="SK">Slovakia</option>
                                        <option value="SI">Slovenia</option>
                                        <option value="SB">Solomon Islands</option>
                                        <option value="SO">Somalia</option>
                                        <option value="ZA">South Africa</option>
                                        <option value="SS">South Sudan</option>
                                        <option value="ES">Spain</option>
                                        <option value="LK">Sri Lanka</option>
                                        <option value="SD">Sudan</option>
                                        <option value="SR">Suriname</option>
                                        <option value="SE">Sweden</option>
                                        <option value="CH">Switzerland</option>
                                        <option value="SY">Syria</option>
                                        <option value="TW">Taiwan</option>
                                        <option value="TJ">Tajikistan</option>
                                        <option value="TZ">Tanzania</option>
                                        <option value="TH">Thailand</option>
                                        <option value="TL">Timor-Leste</option>
                                        <option value="TG">Togo</option>
                                        <option value="TO">Tonga</option>
                                        <option value="TT">Trinidad and Tobago</option>
                                        <option value="TN">Tunisia</option>
                                        <option value="TR">Turkey</option>
                                        <option value="TM">Turkmenistan</option>
                                        <option value="TV">Tuvalu</option>
                                        <option value="UG">Uganda</option>
                                        <option value="UA">Ukraine</option>
                                        <option value="AE">United Arab Emirates</option>
                                        <option value="GB">United Kingdom</option>
                                        <option value="US">United States</option>
                                        <option value="UY">Uruguay</option>
                                        <option value="UZ">Uzbekistan</option>
                                        <option value="VU">Vanuatu</option>
                                        <option value="VA">Vatican City</option>
                                        <option value="VE">Venezuela</option>
                                        <option value="VN">Vietnam</option>
                                        <option value="YE">Yemen</option>
                                        <option value="ZM">Zambia</option>
                                        <option value="ZW">Zimbabwe</option>
                                    </select>
                                    <br></br>

                                    

                                    <button type="submit">Donate</button>
                                </form>


                                <p> Total Donations: $0</p>
                                <p> Donation Leaderboard</p>
                                <p> Spending Distribution</p>
                                <p> Donate </p>
                            </div>
                           
                        ))}
                    </li>
                    <li>
                        {renderDropdown("Volunteer", "Volunteer", (
                            <div>
                                <br></br>
                                <ul>Major Contributors:
                                    <li> James Spencer -founder
                                        
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