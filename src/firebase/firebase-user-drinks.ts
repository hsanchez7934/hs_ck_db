import {doc, setDoc, getDoc} from 'firebase/firestore'
import {firestoreDB} from './firebaseConfig'

export const getUserCreatedDrinksFromDB = async (userSub: string | undefined) => {
	let drinks = []
	if (userSub) {
		const savedCreatedDrinksRef = doc(firestoreDB, 'userCreatedDrinks', userSub)
		const savedCreatedDrinksSnap = await getDoc(savedCreatedDrinksRef)
		const dataExists = savedCreatedDrinksSnap.exists()
		if (dataExists) {
			drinks = savedCreatedDrinksSnap.data().userCreatedDrinks
		}
	}
	return drinks
}

export const saveDrinkToFirestoreDB = async (userSub: string | undefined, drinkList: any) => {
	if (userSub && drinkList) {
		try {
			await setDoc(doc(firestoreDB, 'userCreatedDrinks', userSub), {
				userCreatedDrinks: drinkList
			})
		} catch (error) {
			if (error) {
				throw error
			}
		}
	}
}
