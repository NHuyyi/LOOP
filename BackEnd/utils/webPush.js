const webpush = require('web-push');

webpush.setVapidDetails(
    `mailto:${process.env.EMAIL_USER}`,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

module.exports = webpush;