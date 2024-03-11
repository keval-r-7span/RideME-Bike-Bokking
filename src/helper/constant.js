require("dotenv").config();

const PORT = process.env.PORT;

const JWT = {
	SECRET: process.env.JWT_SECRET,
	EXPIRES: process.env.EXPIRES
};

const DB_DATA = {
	DB_URL: process.env.DB_URL
};

const TWILIO = {
    ACCOUNT_SID:process.env.TWILIO_ACCOUNT_SID,
    AUTH_TOKEN :process.env.TWILIO_AUTH_TOKEN ,
    SERVICE_SID:process.env.TWILIO_SERVICE_SID 
}

module.exports = {PORT,JWT,DB_DATA,TWILIO}