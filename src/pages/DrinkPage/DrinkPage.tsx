import React from 'react'
import LargeDrinkView from '../../components/LargeDrinkView/LargeDrinKView'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import MobileDrinkView from '../../components/MobileDrinkView/MobileDrinkView'
import NoDrinkDataNotice from '../../components/NoDrinkData'

import {useFetchDrinkDataByIDQuery} from '../../store'
import {useParams, useLocation} from 'react-router-dom'

const isMobileView = window.innerWidth < 1050

const DrinkPage = (): JSX.Element => {
	const location = useLocation()
	const {id} = useParams<'id'>()
	const {data, error, isFetching} = useFetchDrinkDataByIDQuery(id)

	let drinkDataToRender = data?.drinks[0] || {}

	if (isMobileView && location.state) {
		const {mobileStateDrink} = location.state
		drinkDataToRender = mobileStateDrink
	}

	let counter = 1
	const ingredients: any | {name: string; amount: string}[] = []
	if (drinkDataToRender) {
		while (drinkDataToRender[`strIngredient${counter}`]) {
			ingredients.push({
				name: drinkDataToRender[`strIngredient${counter}`],
				amount: drinkDataToRender[`strMeasure${counter}`]
			})
			counter = counter + 1
		}
	}

	const mobileDrinkPageView = () => {
		return (
			<MobileDrinkView
				ingredients={ingredients}
				drink={drinkDataToRender}
				prevPath={location.state?.mobileStatePrevPath?.pathname || null}
				scrollTop={location.state?.scrollTop || 0}
			/>
		)
	}

	const largeDrinkPageView = () => {
		return <LargeDrinkView ingredients={ingredients} drink={drinkDataToRender} />
	}

	let content = <LoadingSpinner />
	if (isFetching) {
		content = <LoadingSpinner />
	} else if (error) {
		return <NoDrinkDataNotice isErrorMessage={true} />
	} else {
		content = isMobileView ? mobileDrinkPageView() : largeDrinkPageView()
	}

	return <div style={{height: 'calc(100% - 64px)', overflow: 'auto'}}>{content}</div>
}

export default DrinkPage
