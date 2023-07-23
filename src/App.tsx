import './index.css'
import {useState} from 'react'
import axios from 'axios'
import {useFetchRandomDrinksQuery, useFetchPopularDrinksQuery} from './store'
import {Routes, Route, Outlet, Link} from 'react-router-dom'
import Layout from './components/layout/Layout'

const App = () => {
	// const {data, error, isFetching} = useFetchRandomDrinksQuery()
	const {data, error, isFetching} = useFetchPopularDrinksQuery(null)
	console.log(data)

	return (
		<div className='full'>
			<Routes>
				<Route path="/" element={<Layout />}>
					{/* <Route index element={<Home />} /> */}
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
