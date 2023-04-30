const { Library } = require('../models/Library');
const { Notification } = require('../models/Notification');
const { User } = require('../models/User');

class NotificationService {
    constructor(id) {
        this.id = id;
    }

    static async createNotifcation({ owner, contextObject, playTrack, description, addedAt, type, artists }) {
        const new_notification = await new Notification({
            owner,
            contextObject,
            playTrack,
            description,
            addedAt,
            type,
            artists,
        }).save();

        return new_notification;
    }

    static async getNotificationsByUserId(userId) {
        const library = await Library.findOne({ owner: userId });

        const followingIds = library.followings.map((item) => item.user);

        const notifications = await Notification.find({ owner: { $in: followingIds } })
            .populate({
                path: 'owner',
                select: '_id image name type',
            })
            .sort({ createdAt: 'descending' });

        return notifications;
    }
}

module.exports = NotificationService;
