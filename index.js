const region = 'asia-northeast1';
const runtimeOpts = {
    timeoutSeconds: 10,
    memory: "2GB"
};

const functions = require('firebase-functions');
const request = require("request-promise");
const querystring = require('querystring');
const admin = require('firebase-admin');

let LINE_HEADER;
const LINE_OAUTH_API = "https://api.line.me/v2/oauth";
const LINE_MESSAGING_API = "https://api.line.me/v2/bot/message";

const CHANNEL_ID = "YOUR-CHANNEL-ID";
const CHANNEL_SECRET = "YOUR-CHANNEL-SECRET";

admin.initializeApp();

exports.AccessTokenBot = functions.region(region).runWith(runtimeOpts).https.onRequest(async (req, res) => {
    let event = req.body.events[0]
    switch (event.type) {
        case 'message':
            if (event.message.type === 'text') {
                if(event.message.text === 'register') {
                    // 6. Call API for Create Access Token
                    // 7. Initialize LINE Header
                    // 8. Store Access Token to Real Time Database
                    // 9. Reply result to User Chat Room
                    
                } else if(event.message.text === 'revoke') {
                    // 10. Get Access Token in Real Time Database
                    // 11. Initialize LINE Header
                    // 12. Reply result to User Chat Room
                    // 13. Revoke Access Token
                }
            }
        break;
    }
    res.status(200).send("ok").end();
});

const initialLINE = async(token_type, token) => {
    LINE_HEADER = {
        "Content-Type": "application/json",
        "Authorization": `${token_type} ${token}`
    };
}

const issue_access_token = async() => {
    let params = {
        grant_type: 'client_credentials',
        client_id: CHANNEL_ID,
        client_secret: CHANNEL_SECRET
    };

    let formData = querystring.stringify(params);
    let contentLength = formData.length;

    let promise = new Promise(resolve => {
        request.post({
            url: `${LINE_OAUTH_API}/accessToken`,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
        }, (error, response, body) => {
            if(!error)
                resolve(body);
            else 
                resolve(error);
        })
    });

    let result = await promise;
    return result;

};

const revoke_access_token = (access_token) => {
    let params = {
        access_token: access_token
    };
    let formData = querystring.stringify(params);
    return request.post({
        uri: `${LINE_OAUTH_API}/revoke`,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData
    })
};

const reply = (token, payload) => {
    return request.post({
        uri: `${LINE_MESSAGING_API}/reply`,
        headers: LINE_HEADER,
        body: JSON.stringify({
            replyToken: token,
            messages: [payload]
        })
    })
  }