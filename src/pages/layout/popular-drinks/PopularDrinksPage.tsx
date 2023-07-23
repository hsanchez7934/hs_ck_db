import {useFetchRandomDrinksQuery, useFetchPopularDrinksQuery} from '../../../store'
import MediaCard from '../../../components/card/MediaCard'

const PopularDrinksPage = () => {
	const {data, error, isFetching} = useFetchPopularDrinksQuery(null)
	console.log(data)
	
	let content
	if (isFetching) {
		content = <div>is fetching...</div>
	} else if (error) {
		content = <div>error...</div>
	} else {
		content = data.drinks.map((drink) => {
			return <MediaCard key={drink.idDrink} drink={drink} />
		})
	}

	return <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>{content}</div>
}

export default PopularDrinksPage
