import { upload } from '@testing-library/user-event/dist/upload'
import {storage} from './firebaseConfig'
import {getStorage, ref, uploadBytes} from 'firebase/storage'

export const uploadDrinkImage = (imageName: string, file: any) => {
    // const imageReference = ref(storage, imageName)
    const metaData = {
        contentType: 'image/jpeg'
    }
    const imageRef = ref(storage, `images/${imageName}`)

    uploadBytes(imageRef, file, metaData).then((snapshot) => {
        console.log(snapshot)
    })
}
