import axios from 'axios'
import {DrinkDataPoint} from '../types'

const fetchDrinkDataByID = async (drink: DrinkDataPoint): Promise<DrinkDataPoint> => {
	try {
		const response = await axios.get(
			`https://www.thecocktaildb.com/api/json/v2/${process.env.REACT_APP_CK_DB_KEY}/lookup.php?i=${drink.idDrink}`
		)
		drink = response.data.drinks[0]
	} catch (error) {
		throw error
	}
	return drink
}

export default fetchDrinkDataByID
