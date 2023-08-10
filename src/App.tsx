import './index.css'
import {Routes, Route} from 'react-router-dom'
import Layout from './pages/Layout'
import HomePage from './pages/HomePage'
import PopularDrinksPage from './pages/PopularDrinksPage'
import SearchByNamePage from './pages/SearchByNamePage'

// export const routerConfig = [
// 	{
// 		path: '/',
// 		element: <Layout />,
// 		children: [
// 			{path: '/home', element: <HomePage />},
// 			{
// 				path: '/search',
// 				element: <SearchByNamePage />,
// 				// children: [{path: '/search/populardrinks', element: <PopularDrinksPage />}]
// 			},
// 			{path: '/search/populardrinks', element: <PopularDrinksPage />},
// 		]
// 	}
// ]

const App = (): JSX.Element => {
	return (
		<div className="full">
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<HomePage />} />
					<Route path="/search/byname" element={<SearchByNamePage />} />
					<Route path="/search/populardrinks" element={<PopularDrinksPage />} />
					{/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
					{/* <Route path="*" element={<NoMatch />} /> */}
				</Route>
			</Routes>
		</div>
	)
}

export default App
