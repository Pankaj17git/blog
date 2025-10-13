const mongoose = require('mongoose')

const connectToDb = async() => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Mongo connected');
  } catch (err) {
    console.error('Failed to start', err);
    process.exit(1);
  }
}

module.exports = connectToDb
