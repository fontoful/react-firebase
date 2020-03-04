const functions = require("firebase-functions");
const admin = require("firebase-admin");

const express = require("express");
const app = express();

// Authenticate so it works locally
const serviceAccount = require("./serviceAccount/serviceAuthenticator.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://social-app-5ef20.firebaseio.com"
});

app.get("/screams", (req, res) => {
    admin
        .firestore()
        .collection("screams")
        .orderBy("createdAt", "desc")
        .get()
        .then(data => {
            // init a var
            let screams = [];

            data.forEach(doc => {
                screams.push({
                    screamId: doc.id,
                    body: doc.data().body,
                    userHandle: doc.data().userHandle,
                    createdAt: doc.data().createdAt
                });
            });

            // return it
            return res.json(screams);
        })
        .catch(err => console.error(err));
});

// POST method
app.post("/scream", (req, res) => {
    const newScream = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: new Date().toISOString()
    };

    admin
        .firestore()
        .collection("screams")
        .add(newScream)
        // eslint-disable-next-line promise/always-return
        .then(doc => {
            res.json({
                message: `document ${doc.id} created successfully`
            });
        })
        .catch(err => {
            res.status(500).json({ error: "something went wrong" });
            console.error(err);
        });
});

exports.api = functions.https.onRequest(app);
