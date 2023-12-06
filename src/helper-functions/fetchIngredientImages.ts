import axios from 'axios'
import { apiKey } from '../apiKey'


const fetchIngredientImages = async (ingredient: string, size: string): Promise<any> => {
    try {
        const response = await axios.get(`www.thecocktaildb.com/images/ingredients/${ingredient}-${size}.png`)
        console.log(response)
    } catch (error) {
        throw error
    }
}

export default fetchIngredientImages
