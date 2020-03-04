const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Authenticate so it works locally
const serviceAccount = require("../serviceAccount/serviceAuthenticator.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://social-app-5ef20.firebaseio.com"
});

// Initialize the App
// admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((req, res) => {
    res.send("Hello world!");
});

exports.getScreams = functions.https.onRequest((req, res) => {
    admin
        .firestore()
        .collection("screams")
        .get()
        .then(data => {
            // init a var
            let screams = [];

            data.forEach(doc => {
                screams.push(doc.data());
            });

            // return it
            return res.json(screams);
        })
        .catch(err => console.error(err));
});

exports.createScream = functions.https.onRequest((req, res) => {
    const newScream = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: admin.firestore.Timestamp.fromDate(new Date())
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
