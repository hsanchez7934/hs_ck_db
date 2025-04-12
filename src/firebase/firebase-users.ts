import {doc, setDoc, getDoc} from 'firebase/firestore'
import {firestoreDB} from '../firebase/firebaseConfig'

interface UserProps {
	email: string
	email_verified: boolean
	name: string
	nickname: string
	picture: string
	sub: string
	updated_at: string
}

export const addUserData = async (user: UserProps | undefined): Promise<void> => {
	if (user) {
		const userRef = doc(firestoreDB, 'users', user.sub)
		const userSnapshot = await getDoc(userRef)
		const userExists = userSnapshot.exists()

		if (userExists) {
			return
		}

		const {email, email_verified, name, nickname, picture, sub, updated_at} = user
		try {
			await setDoc(doc(firestoreDB, 'users', sub), {
				email,
				email_verified,
				name,
				nickname,
				picture,
				sub,
				updated_at
			})
		} catch (error) {
			if (error) {
				throw error
			}
		}
	}
}

// email: "hsanchez7934@gmail.com"
// email_verified: false
// name: "hsanchez7934@gmail.com"
// nickname: "hsanchez7934"
// picture: "https://s.gravatar.com/avatar/f9a6fb3b394fb4010d32d2762c7f325d?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fhs.png"
// sub: "auth0|67d489ef43a0a17128894722"
// updated_at: "2025-04-12T07:33:05.050Z"