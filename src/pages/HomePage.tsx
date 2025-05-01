import React, {useState, useEffect, useCallback} from 'react'
import axios from 'axios'
import DrinksImageList from '../components/DrinksImageList/DrinksImageList'
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner'
import NoDrinkDataNotice from '../components/NoDrinkData'
import {debounce} from 'lodash'
import {useLocation} from 'react-router-dom'

const HomePage = () => {
	const location = useLocation()
	const [drinksDataToRender, setDrinksDataToRender] = useState([])
	const [error, setError] = useState(null)

	const fetchData = useCallback(async (fetchSessionStorage: boolean) => {
		setError(null)
		if (fetchSessionStorage) {
			const drinks = sessionStorage.getItem('homePageDrinks')
			if (drinks) {
				setDrinksDataToRender(JSON.parse(drinks))
				return
			}
		}

		try {
			const response = await axios.get(
				`${process.env.REACT_APP_CK_DB_BASE_URL}${process.env.REACT_APP_CK_DB_KEY}/randomselection.php`
			)
			const {drinks} = response.data
			// @ts-expect-error generic
			setDrinksDataToRender((prevItems) => {
				const data = [...prevItems, ...drinks]
				sessionStorage.setItem('homePageDrinks', JSON.stringify(data))
				return data
			})
		} catch (error) {
			// @ts-expect-error generic
			setError(error)
		}
	}, [])

	const debounced = debounce(fetchData, 1000)

	useEffect(() => {
		fetchData(location.state?.fetchFromStorageSession)
	}, [])

	let content = <LoadingSpinner />
	if (error) {
		content = <NoDrinkDataNotice isErrorMessage={true} />
	} else if (drinksDataToRender && drinksDataToRender.length > 0) {
		content = (
			<DrinksImageList drinksData={drinksDataToRender} fetchData={debounced} isHomePage={true} />
		)
	}

	return <div style={{overflow: 'hidden', height: 'calc(100% - 64px)'}}>{content}</div>
}

export default HomePage
