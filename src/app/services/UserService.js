const { AudioPlayer } = require('../models/AudioPlayer');
const { Library } = require('../models/Library');
const { User } = require('../models/User');

class UserService {
    async findOne(condition) {
        return await User.findOne(condition);
    }

    async createUser(payload) {
        const newUser = await new User(payload).save();

        const library = await new Library({
            owner: newUser._id,
        }).save();

        const audioPlayer = await new AudioPlayer({
            owner: newUser._id,
        }).save();

        newUser.password = undefined;
        newUser.__v = undefined;

        return newUser;
    }
}

module.exports = new UserService();
