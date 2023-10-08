const google = require('googleapis').google;
const calendar = google.calendar({
    version: "v3",
    auth: process.env.OAUTH2_API_KEY
});
const dayjs = require('dayjs');

require('dotenv').config();

const oauth2Client = new google.auth.OAuth2(
    process.env.OAUTH2_API_CLIENT_ID,
    process.env.OAUTH2_API_CLIENT_SECRET,
    process.env.REDIRECT_URL
);

const scopes = [
    'https://www.googleapis.com/auth/calendar'
];

const googleInit = (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: scopes,
    });

    res.redirect(url);
}

const googleRedirect = async (req, res) => {
    const code = req.query.code;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    res.status(307).json({
        message: "Redirected"
    });
}

const scheduleEvent = async (req, res) => {
    await calendar.events.insert({
        calendarId: "primary",
        auth: oauth2Client,
        requestBody: {
            summary: "test api event summary 2",
            description: "test api event description 2",
            start: {
                dateTime: dayjs(new Date()).add(2, 'day').toISOString(),
                timeZone: "Asia/Kolkata",
            },
            end: {
                dateTime: dayjs(new Date()).add(3, 'day').toISOString(),
                timeZone: "Asia/Kolkata",
            },
            attendees: [
                {
                  "email": "namanthanki785@gmail.com",
                  "displayName": "Naman Thanki",
                  "organizer": false,
                  "responseStatus": "needsAction", // needsAction, declined, tentative, accepted
                  "comment": "Good Work!",
                },
                {
                    "email": "stuniz7855@gmail.com",
                    "displayName": "Thanki Naman",
                    "organizer": false,
                    "responseStatus": "needsAction", // needsAction, declined, tentative, accepted
                    "comment": "Good Work!",
                  }
              ]
        }
    });

    res.status(200).json({
        message: "Inserted Event"
    });
}

module.exports = {
    googleInit,
    googleRedirect,
    scheduleEvent
};