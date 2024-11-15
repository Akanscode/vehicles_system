// Import Firebase and SendGrid
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');

// Initialize Firebase Admin
admin.initializeApp();

// Initialize SendGrid with your API Key
sgMail.setApiKey(functions.config().sendgrid.key);

// Firestore trigger for new booking creation and updates
exports.sendBookingNotification = functions.firestore
    .document('bookings/{bookingId}')
    .onWrite(async (change, context) => {
        const bookingId = context.params.bookingId;
        const bookingData = change.after.exists ? change.after.data() : null;

        if (!bookingData) {
            console.log(`Booking ${bookingId} deleted.`);
            return;
        }

        // Send email when a new booking is created
        if (!change.before.exists) {
            await sendNewBookingEmail(bookingData);
        }

        // Send email when a booking is updated
        if (change.before.exists && change.after.exists) {
            await sendUpdatedBookingEmail(bookingData);
        }
    });

// Helper function to send email for new bookings
const sendNewBookingEmail = async (bookingData) => {
    const ownerEmail = await getUserEmailById(bookingData.ownerId);
    const workshopEmail = await getUserEmailById(bookingData.workshopId);

    const msg = {
        to: [ownerEmail, workshopEmail],
        from: 'noreply@yourdomain.com', // Replace with your verified sender
        subject: 'New Service Booking',
        html: `
            <h1>New Booking Created</h1>
            <p>A new service booking has been created.</p>
            <p>Service Type: ${bookingData.serviceType}</p>
            <p>Date: ${new Date(bookingData.scheduledDate.toDate()).toLocaleDateString()}</p>
        `,
    };

    await sgMail.send(msg);
};

// Helper function to send email for booking updates
const sendUpdatedBookingEmail = async (bookingData) => {
    const ownerEmail = await getUserEmailById(bookingData.ownerId);
    const workshopEmail = await getUserEmailById(bookingData.workshopId);

    const msg = {
        to: [ownerEmail, workshopEmail],
        from: 'noreply@yourdomain.com', // Replace with your verified sender
        subject: 'Booking Updated',
        html: `
            <h1>Booking Updated</h1>
            <p>Your booking has been updated.</p>
            <p>New Status: ${bookingData.status}</p>
            ${bookingData.rescheduledDate ? `<p>Rescheduled Date: ${new Date(bookingData.rescheduledDate.toDate()).toLocaleDateString()}</p>` : ''}
        `,
    };

    await sgMail.send(msg);
};

// Helper function to fetch user email by UID
const getUserEmailById = async (uid) => {
    const userDoc = await admin.firestore().collection('users').doc(uid).get();
    if (userDoc.exists) {
        return userDoc.data().email;
    } else {
        throw new Error(`User with UID ${uid} not found.`);
    }
};
