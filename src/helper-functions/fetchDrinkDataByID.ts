import axios from 'axios'
import {apiKey} from '../apiKey'
import {DrinkDataPoint} from '../types'

const fetchDrinkDataByID = async (drink: DrinkDataPoint): Promise<DrinkDataPoint> => {
	try {
		const response = await axios.get(
			`https://www.thecocktaildb.com/api/json/v2/${apiKey}/lookup.php?i=${drink.idDrink}`
		)
		drink = response.data.drinks[0]
	} catch (error) {
		throw error
	}
	return drink
}

export default fetchDrinkDataByID
