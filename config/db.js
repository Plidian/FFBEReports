const mongoose = require('mongoose');
const configenv = require('./config.json');
const mongo_uri = configenv.MONGO_URI;


const connectDB = async() => {
  try {
    const conn = await mongoose.connect(mongo_uri,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  }catch (err) {
    console.error(err)
    process.exit(1)
  }
}
module.exports = connectDB;
