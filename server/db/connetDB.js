const mongoose = require('mongoose');
const config = require('../config');
// const { autoSendNotifyEmail } = require('../utils/emailSender');
// const testRun = require('../utils/testUse');
const connectionString = config.dbConnectStr;
const createInitialDBRecords = require('./createInitData');
// const updateExistingData = require('./updateExistingData');
// const registerWatchers = require('./watchers');
// const { updateSystemConfigCache } = require('../api/utils/systemConfig');
let conn = null;
const connectDB = async () => {
  if (!connectionString) {
    console.error(
      '\x1b[44;33m%s\x1b[0m',
      'Please first define the MongoDB connection string in config'
    );
    process.exit(1);
  }
  try {
    conn = await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    // autoSendNotifyEmail();
    console.log(`MongoDB (host: ${conn.connection.host}) Connected, creating initial data...`);
    await createInitialDBRecords(conn);
    // testRun();
    // console.log('DB Records Initialized');
    // await updateExistingData(conn);
    // console.log('DB Records updated');
    // await updateSystemConfigCache();
    // registerWatchers();
    // console.log(`Current Time: ${new Date()}`);
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

const getConnection = () => conn;

module.exports = { connectDB, getConnection };
