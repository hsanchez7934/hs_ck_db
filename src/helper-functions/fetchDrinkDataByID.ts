import axios from 'axios'
import {DrinkDataPoint} from '../types'

const fetchDrinkDataByID = async (drink: DrinkDataPoint): Promise<DrinkDataPoint> => {
	try {
		const response = await axios.get(
			`${process.env.REACT_APP_CK_DB_BASE_URL}${process.env.REACT_APP_CK_DB_KEY}/lookup.php`,
			{params: {i: drink.idDrink}}
		)
		const nextDrink = response.data?.drinks?.[0]
		if (!nextDrink) {
			throw new Error('Drink not found')
		}
		return nextDrink
	} catch (error) {
		throw error
	}
}

export default fetchDrinkDataByID
