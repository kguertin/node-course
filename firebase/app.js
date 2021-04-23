const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

const serviceAccount = './firebaseServiceAccountKey.json';

const app = express();
app.use(bodyParser.json());

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: ''
});

const db = admin.firestore();

app.get('/getUsers', async (req, res) => {
    const snapshot = await db.collection('test').doc('user').get();
    const userData = snapshot.data();
    console.log('USERS:', userData);
    res.send(userData)

});

app.post('/postUser', async (req, res) => {
    const docRef = db.collection('test').doc('user');
    const { name } = req.body;
    await docRef.set({ name: name });

    console.log('User Created');
    res.status(201).send('User Created');

});

app.listen(4000, () => console.log('Listening on 4000'));