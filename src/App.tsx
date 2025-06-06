import React from 'react'
import './index.css'
import {Routes, Route, useLocation} from 'react-router-dom'
// import CreateDrinkPage from './pages/CreateDrinkPage/CreateDrinkPage'
import DrinkModal from './components/DrinkModal/DrinkModal'
import DrinkPage from './pages/DrinkPage/DrinkPage'
import HomePage from './pages/HomePage'
import Layout from './pages/Layout'
import NoMatchPage from './pages/NoMatchPages'
import NonAlcoholicDrinksPage from './pages/NonAlcoholicDrinksPage'
import PopularDrinksPage from './pages/PopularDrinksPage'
import SavedDrinksPage from './pages/SavedDrinksPage/SavedDrinksPage'
import SearchByNamePage from './pages/SearchByNamePage/SearchByNamePage'
import SearchBySpiritsPage from './pages/SearchBySpiritsPage/SearchBySpiritsPage'
import SearchByIngredientPage from './pages/SearchByIngredientPage'
import UserProfile from './pages/UserProfile/UserProfile'

import './firebase/firebaseConfig'

const App = (): JSX.Element => {
	const location = useLocation()
	const state = location.state as {backgroundLocation?: Location}

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
					{/* <Route path="/create" element={<CreateDrinkPage />} /> */}
					<Route path="*" element={<NoMatchPage />} />
					<Route path="/profile" element={<UserProfile />} />
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
