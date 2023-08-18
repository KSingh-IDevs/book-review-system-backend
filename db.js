const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
        });

        console.log(`MongoDB Connected: http://${conn.connection.host}:${process.env.PORT}`);

        mongoose.connection.on("disconnected", (err, res) => {
            console.log("mongoose is disconnected");
        });

        mongoose.connection.on("connected", (err, res) => {
            console.log("mongoose is connected");
        });


    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
}



module.exports = connectDB;
