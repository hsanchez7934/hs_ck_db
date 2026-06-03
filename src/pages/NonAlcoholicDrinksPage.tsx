import React from 'react'

import DrinkImageList from '../components/DrinksImageList/DrinksImageList'
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner'
import NoDrinkDataNotice from '../components/NoDrinkData'
import PageContainer from '../components/layout/PageContainer'
import {useFetchNonAlcoholicDrinksQuery} from '../store'

const NonAlcoholicDrinksPage = () => {
	const {data, error, isFetching} = useFetchNonAlcoholicDrinksQuery('Non_Alcoholic')

	let content = <LoadingSpinner />
	if (isFetching) {
		content = <LoadingSpinner />
	} else if (error) {
		content = <NoDrinkDataNotice isErrorMessage={true} />
	} else if (data && data?.drinks?.length > 0) {
		const drinksData = data?.drinks || []
		content = <DrinkImageList drinksData={drinksData} />
	} else {
		content = <NoDrinkDataNotice />
	}

	return <PageContainer>{content}</PageContainer>
}

export default NonAlcoholicDrinksPage
