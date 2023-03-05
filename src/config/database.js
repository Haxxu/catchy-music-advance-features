const mongoose = require('mongoose');

const connect = async () => {
    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };
    try {
        await mongoose.connect(process.env.DATABASE, connectionParams);
        console.log('Connect to database successfully');
    } catch (error) {
        console.log('Connect to database failure!');
    }
};

module.exports = { connect };
