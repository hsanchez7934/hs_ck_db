import {doc, setDoc, getDoc} from 'firebase/firestore'
import {firestoreDB} from './firebaseConfig'

export const getUserSavedDrinksFromDB = async (userSub: string | undefined) => {
	let drinks = []
	if (userSub) {
		const savedDrinkRef = doc(firestoreDB, 'userSavedDrinks', userSub)
		const savedDrinkSnap = await getDoc(savedDrinkRef)
		const dataExists = savedDrinkSnap.exists()
		if (dataExists) {
			drinks = savedDrinkSnap.data().savedDrinks
		}
	}
	return drinks
}

export const saveUserDrinkInDB = async (userSub: string | undefined, drinkList: any) => {
	if (userSub && drinkList) {
		try {
			await setDoc(doc(firestoreDB, 'userSavedDrinks', userSub), {
				savedDrinks: drinkList
			})
		} catch (error) {
			if (error) {
				throw error
			}
		}
	}
}
