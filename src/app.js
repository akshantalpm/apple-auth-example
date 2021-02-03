const express = require('express');
const app = express();
const fs = require('fs');
const AppleAuth = require('apple-auth');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const EnvironmentVar = require('./enviornment');

const config = {
    "client_id": EnvironmentVar.clientId,
    "team_id": "3JRGPHC3AW",
    "key_id": EnvironmentVar.keyId,
    "redirect_uri": EnvironmentVar.redirectUri,
    "scope": "name email"
}

let auth = new AppleAuth(config, EnvironmentVar.accessKey, 'text');

app.get("/", (req, res) => {
    console.log( Date().toString() + "GET /");
    res.send(`<a href="${auth.loginURL()}">Sign in with Apple</a>`);
});

app.get('/token', (req, res) => {
    res.send(auth._tokenGenerator.generate());
});

app.post('/api/callback', bodyParser(), async (req, res) => {
    try {
        console.log( Date().toString() + "GET /auth");
        const response = await auth.accessToken(req.body.code);
        const idToken = jwt.decode(response.id_token);

        const user = {};
        user.id = idToken.sub;

        if (idToken.email) user.email = idToken.email;
        if (req.body.user) {
            const { name } = JSON.parse(req.body.user);
            user.name = name;
        }

        res.json(user);
    } catch (ex) {
        console.error(ex);
        res.send("An error occurred!");
    }
});

app.get('/api/callback', bodyParser(), async (req, res) => {
    try {
        console.log( Date().toString() + "GET /auth");
        const response = await auth.accessToken(req.body.code);
        const idToken = jwt.decode(response.id_token);

        const user = {};
        user.id = idToken.sub;

        if (idToken.email) user.email = idToken.email;
        if (req.body.user) {
            const { name } = JSON.parse(req.body.user);
            user.name = name;
        }

        res.json(user);
    } catch (ex) {
        console.error(ex);
        res.send("An error occurred!");
    }
});

app.get('/refresh', async (req, res) => {
    try {
        console.log( Date().toString() + "GET /refresh");
        const accessToken = await auth.refreshToken(req.query.refreshToken);
        res.json(accessToken);
    } catch (ex) {
        console.error(ex);
        res.send("An error occurred!");
    }
});

app.listen(80, () => {
    console.log("Listening on https://apple.ananay.dev");
})
