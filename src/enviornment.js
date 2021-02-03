const Environment = {
  clientId: process.env.CLIENT_ID,
  accessKey: process.env.access_key.replace(/\\n/gm, '\n'),
  keyId: process.env.key_id,
  redirectUri: process.env.redirect_uri,
  port: process.env.PORT
};

module.exports = Environment;
