import './index.css'
import {Routes, Route, useLocation} from 'react-router-dom'
import DrinkModal from './components/DrinkModal'
import DrinkPage from './pages/DrinkPage/DrinkPage'
import HomePage from './pages/HomePage'
import Layout from './pages/Layout'
import NoMatchPage from './pages/NoMatchPages'
import NonAlcoholicDrinksPage from './pages/NonAlcoholicDrinksPage'
import PopularDrinksPage from './pages/PopularDrinksPage'
import SavedDrinksPage from './pages/SavedDrinksPage'
import SearchByNamePage from './pages/SearchByNamePage'
import SearchBySpiritsPage from './pages/SearchBySpiritsPage'
// import axios from 'axios'
import SearchByIngredientPage from './pages/SearchByIngredientPage'

console.log(process.env)

const App = (): JSX.Element => {
	// const getingredients = async () => {
	// 	const response = await axios.get(`https://www.thecocktaildb.com/api/json/v2/${apiKey}/list.php?c=list`)
	// 	console.log(response)
	// }
	// getingredients()
	let location = useLocation()
	let state = location.state as {backgroundLocation?: Location}

	return (
		<div className="full">
			<Routes location={state?.backgroundLocation || location}>
				<Route path="/" element={<Layout />}>
					<Route index element={<HomePage />} />
					<Route path="/drink/:id" element={<DrinkPage />} />
					<Route path="/search/popularcocktails" element={<PopularDrinksPage />} />
					<Route path="/search/byname" element={<SearchByNamePage />} />
					<Route path="/search/byspirit" element={<SearchBySpiritsPage />} />
					<Route path="/search/byingredient" element={<SearchByIngredientPage />} />
					<Route path="/search/nonalcoholic" element={<NonAlcoholicDrinksPage />} />
					<Route path="/saveddrinks" element={<SavedDrinksPage />} />
					<Route path="*" element={<NoMatchPage />} />
				</Route>
			</Routes>
			{state?.backgroundLocation && (
				<Routes>
					<Route path='/drink/:id' element={<DrinkModal />} />
				</Routes>
			)}
		</div>
	)
}

export default App
