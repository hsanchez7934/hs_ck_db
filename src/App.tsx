import './index.css'
import {Routes, Route, useLocation} from 'react-router-dom'
import DrinkModal from './components/DrinkModal'
import DrinkPage from './pages/DrinkPage'
import HomePage from './pages/HomePage'
import Layout from './pages/Layout'
import NoMatchPage from './pages/NoMatchPages'
import PopularDrinksPage from './pages/PopularDrinksPage'
import SavedDrinksPage from './pages/SavedDrinksPage'
import SearchByNamePage from './pages/SearchByNamePage'
import SearchBySpiritsPage from './pages/SearchBySpiritsPage'

const App = (): JSX.Element => {

	let location = useLocation()
	let state = location.state as {backgroundLocation?: Location}

	return (
		<div className="full">
			<Routes location={state?.backgroundLocation || location}>
				<Route path="/" element={<Layout />}>
					<Route index element={<HomePage />} />
					<Route path="/drink/:id" element={<DrinkPage />} />
					<Route path="/search/populardrinks" element={<PopularDrinksPage />} />
					<Route path="/search/byname" element={<SearchByNamePage />} />
					<Route path="/search/byspirit" element={<SearchBySpiritsPage />} />
					<Route path="/mydrinks" element={<SavedDrinksPage />} />
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
