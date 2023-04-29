const { Notification } = require('../models/Notification');

class NotificationService {
    constructor(id) {
        this.id = id;
    }

    static async createNotifcation({
        owner,
        trackType,
        trackContextId,
        context_uri,
        type,
        addedAt,
        description,
        duration,
        artists,
    }) {
        const new_notification = await new Notification({
            owner,
            trackType,
            trackContextId,
            context_uri,
            type,
            addedAt,
            description,
            duration,
            artists,
        }).save();

        return new_notification;
    }
}

module.exports = NotificationService;
