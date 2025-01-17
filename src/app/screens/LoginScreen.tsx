import { faSadCry } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import Icon from "./vapor.svg";

export default function LoginScreen(props) {

    // Login Form user responses
    const [accountName, setAccountName] = useState("");
    const [password, setPassword] = useState("");
    const [captcha, setCaptcha] = useState("");

    // Holds supplementary information about additional verification method that user needs to provide a response to to give back to Steam
    const [authMethod, setAuthMethod] = useState({method: "", value: ""});

    // Login response
    const [loginResponse, setLoginResponse] = useState({});

    return (<div className="flex h-screen w-screen fixed z-20" style={{backgroundColor: "#111225", WebkitAppRegion: "drag"}}>
            <div className="m-auto flex flex-wrap content-center w-full justify-center">
                <div className="w-full flex content-center justify-center items-center">
                    <img className="w-20 h-20 align-middle" src={Icon} />
                    <div className="text-3xl font-semibold ml-3 text-white">Vapor</div>
                </div>
                
                <span className="text-xs mt-6 text-gray-100">Authentificateur de bureau pour Steam</span>

                {/* Login form */}
                <div className="w-full content-center justify-center flex flex-wrap mt-10">
                    <input id="accountName" name="username" placeholder="Nom d'utilisateur" className="rounded border p-1 mx-1" onChange={(e) => setAccountName(e.target.value)}/>
                    <input id="password" type="password" name="password" placeholder="Mot de passe" className="rounded border p-1 mx-1" onChange={(e) => setPassword(e.target.value)}/>

                        {/* Submit details */}
                    {<button className="bg-black text-white rounded px-3 text-sm inline" onClick={async () => {
                        const details = {accountName, password, captcha};
                        details[authMethod.method] = authMethod.value;
                        const response = await window["electron"].authenticate.tryLogin(details);

                        // Query user for further login information if required
                        if (Object.keys(response).length != 0) return setLoginResponse(response);
                        
                        // Log user in
                        props.updateUser();

                        // Redirect user (back) to main dashboard
                        props.setAddNewAccount(false);
                    }}>Login</button>}
                </div>

                {/* Supplementary details e.g login errors or additional inputs are generated below login form */}
                <div className="w-full justify-center content-center mt-3 text-center">
                    {Object.keys(loginResponse).length !== 0 && displayResponsePrompt(loginResponse)}
                </div>

                {/* If a logged-in user is just adding a new account to their authenticator, they can redirect back if they want to stop adding new account */}
                {props.addNewAccount && <div className="font-bold mt-3 text-xs cursor-pointer text-white" onClick={() => {
                    props.setAddNewAccount(false);
                    props.setSwitchingAccounts(true);
                }}>Back</div>}
            </div>
        </div>
    )

    // Produce any supplementary details to let the user know of the status of the login attempt or ask for additional information from them
    function displayResponsePrompt(response) {
        const {error, captchaurl} = response;
        const SteamLoginErrors = window["electron"].steamLoginErrors;
    
        switch(error) {
            case SteamLoginErrors.MissingDetails:
                return (<div className="text-xs text-red-600">Il n'y a aucun nom d'utilisateur ou mot de passe <FontAwesomeIcon icon={faSadCry} className="opacity-40 align-middle" size="2x" /></div>)
            case SteamLoginErrors.IncorrectDetails:
                return (<div className="text-sm text-red-600">Votre nom d'utilisateur ou votre mot de passe est incorrect. Veuillez réessayer.</div>);
            case SteamLoginErrors.SteamGuardMobile:
                return (<div>
                    <input name="steamguardmobile" placeholder="Code d'authentification mobile" className="rounded border p-1 mx-1"  onChange={(e) => setAuthMethod({
                        method: "twoFactorCode",
                        value: e.target.value
                    })}/>
                </div>)
            case SteamLoginErrors.SteamGuard:
                return (<div>
                    <input name="steamguard" placeholder="Code d'authentification email" className="rounded border p-1 mx-1" onChange={(e) => setAuthMethod({
                        method: "authCode",
                        value: e.target.value
                    })} />
                </div>)
            case SteamLoginErrors.Captcha:
                return (<div>
                    <div className="">Merci de remplir ce captcha</div>
                    <img src={captchaurl} />
                    <input name="captcha" placeholder="Captcha" className="rounded border p-1 mx-1" onChange={(e) => setCaptcha(e.target.value)}/>
                </div>)
            default:
                return (<div className="text-sm text-red-300">
                    Vous avez été interrompu temporairement. Veuillez réessayer plus tard.
                </div>)
        }
    }
}

