// import {useState} from 'react'
// import {useFetchDrinkByIngredientQuery} from '../store'
import DrinksImageList from '../components/DrinksImageList/DrinksImageList'
// import SkeletonLoader from '../components/Skeleton'
import { useAppSelector } from '../store/hooks'
import NoDrinkDataNotice from '../components/NoDrinkData'

const SearchByIngredientpage = () => {
    const {drinksByIngredient} = useAppSelector((state) => state.drinksByIngredient)
    console.log(drinksByIngredient)

	let content = <></>
	// if (isFetching) {
	// 	content = <SkeletonLoader />
	// } else if (error) {
	// 	content = <div>Oh no! Looks like an error has occured. Please refresh this page.</div>
	// } else {
	// 	const drinksData = data?.drinks || []
	// }
    if (drinksByIngredient === 'None Found') {
        content = <NoDrinkDataNotice />
    } else if (drinksByIngredient.length > 0) {
        content = <DrinksImageList drinksData={drinksByIngredient} />
    }
	return <div style={{overflow: 'auto', height: 'calc(100% - 64px)'}}>{content}</div>
}

export default SearchByIngredientpage
