import './index.css'
import {Routes, Route} from 'react-router-dom'
import Layout from './pages/Layout'
import TheClassicsPage from './pages/TheClassicsPage'
import HomePage from './pages/HomePage'

const App = () => {
	return (
		<div className='full'>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<HomePage />} />
					<Route path="/classics" element={<TheClassicsPage />} />
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
