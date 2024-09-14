const express = require('express');
require('dotenv').config();
const { initAuth } = require('@propelauth/express');
const bodyParser = require('body-parser');

const app = express();

const PORT = process.env.PORT || 3001;

const {
    requireUser,
    fetchUserMetadataByUserId,
} = initAuth({
    authUrl: process.env.AUTH_URL,
    apiKey: process.env.AUTH_API, 
});



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Welcome to your Express.js app!');
});


app.get("/api/whoami", requireUser, (req, res) => {
    res.text("Hello user with ID " + req.user.userId);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

