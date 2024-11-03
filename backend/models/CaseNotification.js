// models/CaseNotification.js

import mongoose from 'mongoose';

const caseNotificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    caseId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Case' },  // Reference to a case
    message: { type: String, required: true },
    status: { type: String, required: true }, 
    createdAt: { type: Date, default: Date.now },
});

const CaseNotification = mongoose.model('CaseNotification', caseNotificationSchema);

export default CaseNotification;
