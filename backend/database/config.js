const mongoose = require("mongoose");

const { MONGODB_URI, DB_NAME } = process.env;

const dbConnection = async () => {  
  
  try {
    
    await mongoose.connect(`${MONGODB_URI}/${DB_NAME}`);
    
  } catch (error) {
    console.log('[ERROR CONNECTION TO DB] Please check your DB connection configuration')
  }
};

module.exports = {dbConnection};
