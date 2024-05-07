// @ts-nocheck
const { connect } = require('mongoose');

const db = {}

db.init = async(callback) => {
  try {
    const MONGO_URI = `mongodb+srv://${process.env.MONGO_UNAME}:${process.env.MONGO_PWD}@cluster0.yrrvwrm.mongodb.net/SHENG-API?retryWrites=true&w=majority`
    await connect(MONGO_URI);
    console.log('\x1b[35m%s\x1b[0m', 'Status 200 => OK[mongoDB]');
    callback();
  } catch(error) {
    console.log('\x1b[34m%s\x1b[0m', `[mongodb] connection error:${error}`);
  }
}

module.exports = db