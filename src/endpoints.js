// Initiate oAuth Process
const GOOGLE_OAUTH_URL = "https://accounts.google.com/o/oauth2/auth";
// Get Access Token, refresh Access Token
const GOOGLE_OAUTH_ACCESS_TOKEN_URL = "https://oauth2.googleapis.com/token";
// Revoke Access
const GOOGLE_OAUTH_REVOKE_ACCESS_URL = "https://oauth2.googleapis.com/revoke";
// Incremental Grant
const GOOGLE_OAUTH_INCREMENTAL_GRANT_URL =
  "https://accounts.google.com/o/oauth2/v2/auth";

module.exports = {
  GOOGLE_OAUTH_URL,
  GOOGLE_OAUTH_ACCESS_TOKEN_URL,
  GOOGLE_OAUTH_REVOKE_ACCESS_URL,
  GOOGLE_OAUTH_INCREMENTAL_GRANT_URL,
};
