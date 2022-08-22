export interface SteamLoginDetails {
    accountName: string;
    password: string;
    steamguard?: string; // Steam Guard code for those logging in on Steam Guard Authorisation email
    authCode?: string; // Steam Guard code on first email authentication
    twoFactorCode?: string;
    captcha?: string;
    disableMobile?: boolean;
}

export enum SteamLoginErrors {
    MissingDetails = "MissingDetails",
    IncorrectDetails = "Erreur: Erreur non interceptée: Le nom de compte ou le mot de passe que vous avez entré est incorrect.",
    SteamGuard = "SteamGuard",
    SteamGuardMobile = "SteamGuardMobile",
    Captcha = "CAPTCHA",
    OldSession = "Old Session"
}

export interface SteamLoginResponse {
    error?: SteamLoginErrors,
    emaildomain?: string;
    captchaurl?: string;
}

export enum Steam2FAErrors {
    NoMobile = "Error 2"
}