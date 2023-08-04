/**
 * This file contains authentication parameters. Contents of this file
 * is roughly the same across other MSAL.js libraries. These parameters
 * are used to initialize Angular and MSAL Angular configurations in
 * in app.module.ts file.
 */


import { LogLevel, Configuration, BrowserCacheLocation } from '@azure/msal-browser';

const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1;

/**
 * Enter here the user flows and custom policies for your B2C application,
 * To learn more about user flows, visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/user-flow-overview
 * To learn more about custom policies, visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/custom-policy-overview
 */
export const b2cPolicies = {
  names: {
    signUpSignIn: "B2C_1_Finotex_SignIn",
    editProfile: "B2C_1_Finotex_EditProfile"
  },
  authorities: {
    signUpSignIn: {
      authority: "https://FinotexB2C.b2clogin.com/FinotexB2C.onmicrosoft.com/B2C_1_Finotex_SignIn",
    },
    editProfile: {
      authority: "https://finotexb2c.b2clogin.com/FinotexB2C.onmicrosoft.com/B2C_1_Finotex_EditProfile"
    }
  },
  authorityDomain: "FinotexB2C.b2clogin.com"
};

/**
 * Configuration object to be passed to MSAL instance on creation. 
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md 
 */
//clientId: '07bc2b2a-36ac-4eca-8228-86d612e3d4d8', // This is the ONLY mandatory field that you need to supply.
export let msalConfig: Configuration = {
  auth: {
    clientId: '98c68b8e-0d50-4961-b352-5cd5040b1e1e',
    authority: 'https://login.microsoftonline.com/171cc8e3-fbee-43e4-b757-b08386005972',
    redirectUri: '/'
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage, // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
    storeAuthStateInCookie: isIE, // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback(logLevel: LogLevel, message: string) { },
      logLevel: LogLevel.Verbose,
      piiLoggingEnabled: false
    }
  }
}

/**
 * Add here the endpoints and scopes when obtaining an access token for protected web APIs. For more information, see:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */
export const protectedResources = {
  todoListApi: {
    endpoint: "https://localhost:44351/api/todolist",
    scopes: ["https://fabrikamb2c.onmicrosoft.com/helloapi/demo.read"],
  },
}

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit: 
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
  scopes: []
};
