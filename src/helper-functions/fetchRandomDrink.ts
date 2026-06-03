import axios from 'axios'

const fetchRandomDrink = async () => {
	const endpoint = `${process.env.REACT_APP_CK_DB_BASE_URL}${process.env.REACT_APP_CK_DB_KEY}/random.php`
	const response = await axios.get(endpoint)
	return response.data.drinks[0]
}

export default fetchRandomDrink
