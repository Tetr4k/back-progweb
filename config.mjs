import 'dotenv/config';

const {
	PORT,
	API_KEY,
	AUTH_DOMAIN,
	DATABASE_URL,
	PROJECT_ID,
	STORAGE_BUCKET,
	MENSAGING_SENDER_ID,
	APP_ID,
	MEASUREMENT_ID
} = process.env;

const port = PORT;

const firebaseConfig = {
	apiKey: API_KEY,
	authDomain: AUTH_DOMAIN,
	databaseURL: DATABASE_URL,
	projectId: PROJECT_ID,
	storageBucket: STORAGE_BUCKET,
	messagingSenderId: MENSAGING_SENDER_ID,
	appId: APP_ID,
	measurementId: MEASUREMENT_ID
}

export { port, firebaseConfig };