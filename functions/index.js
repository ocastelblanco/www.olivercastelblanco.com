const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
exports.addMessage = functions.https.onRequest((req, res) => {
    const original = req.query.text;
    return admin.database().ref('/mensajes').push({ original: original }).then((snapshot) => {
        return res.redirect(303, snapshot.ref);
    });
});
exports.makeUppercase = functions.database.ref('/mensajes/{pushId}/original').onCreate((snap, context) => {
/*
    const authVar = context.auth; // Auth information for the user.
    const authType = context.authType; // Permissions level for the user.
    const pathId = context.params.pushId; // The ID in the Path.
    const eventId = context.eventId; // A unique event ID.
    const timestamp = context.timestamp; // The timestamp at which the event happened.
    const eventType = context.eventType; // The type of the event that triggered this function.
    const resource = context.resource; // The resource which triggered the event.
    
    const beforeData = data.before.val(); // data before the write
    const afterData = data.after.val(); // data after the write
*/
    const pathId = context.params.pushId;
    const original = snap.val();
    const uppercase = original.toUpperCase();
    return admin.database().ref('/mensajes/'+pathId+'/uppercase').set(uppercase);
});