import {initializeApp} from 'firebase/app'
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
	apiKey: process.env.REACT_APP_CK_FIREBASE_APIKEY,
	authDomain: process.env.REACT_APP_CK_FIREBASE_AUTHDOMAIN,
	projectId: process.env.REACT_APP_CK_FIREBASE_PROJECTID,
	storageBucket: process.env.REACT_APP_CK_FIREBASE_STORAGEBUCKET,
	messagingSenderId: process.env.REACT_APP_CK_FIREBASE_MESSAGINGSENDERID,
	appId: process.env.REACT_APP_CK_FIREBASE_APPID,
	measurementId: process.env.REACT_APP_CK_FIREBASE_MEASUREMENTID
}

const firebaseApp = initializeApp(firebaseConfig)
export default firebaseApp

export const firestoreDB = getFirestore(firebaseApp)
