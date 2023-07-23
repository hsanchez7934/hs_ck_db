import './index.css'
import {Routes, Route} from 'react-router-dom'
import Layout from './pages/layout/Layout'
import PopularDrinksPage from './pages/layout/popular-drinks/PopularDrinksPage'

const App = () => {
	return (
		<div className='full'>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<PopularDrinksPage />} />
					{/* <Route path="about" element={<About />} /> */}
					{/* <Route p/>ath="dashboard" element={<Dashboard />} /> */}
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
