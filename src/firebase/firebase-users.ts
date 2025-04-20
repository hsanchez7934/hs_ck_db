import {doc, setDoc, getDoc} from 'firebase/firestore'
import {firestoreDB} from './firebaseConfig'

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
