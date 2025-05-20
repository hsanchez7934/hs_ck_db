import {storage} from './firebaseConfig'
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage'
import generateUUID from '../uuid'

export const uploadDrinkImage = (imageName: string, file: any) => {
	const metaData = {
		contentType: 'image/jpeg'
	}
	const imageRef = ref(storage, `images/${generateUUID()}_${imageName}`)

	return uploadBytes(imageRef, file, metaData).then((snapshot) => {
		return getDownloadURL(snapshot.ref).then((downloadURL) => {
			return downloadURL
		})
	})
}
