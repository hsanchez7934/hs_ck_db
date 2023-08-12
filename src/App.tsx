import './index.css'
import {Routes, Route, useLocation} from 'react-router-dom'
import Layout from './pages/Layout'
import HomePage from './pages/HomePage'
import PopularDrinksPage from './pages/PopularDrinksPage'
import SearchByNamePage from './pages/SearchByNamePage'
import NoMatchPage from './pages/NoMatchPages'
import DrinkPage from './pages/DrinkPage'
import DrinkModal from './components/DrinkModal'

const App = (): JSX.Element => {
	let location = useLocation()
	let state = location.state as {backgroundLocation?: Location}

	return (
		<div className="full">
			<Routes location={state?.backgroundLocation || location}>
				<Route path="/" element={<Layout />}>
					<Route index element={<HomePage />} />
					<Route path="/drink/:id" element={<DrinkPage />} />
					<Route path="/search/byname" element={<SearchByNamePage />} />
					<Route path="/search/populardrinks" element={<PopularDrinksPage />} />
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
