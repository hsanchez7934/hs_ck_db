import {configureStore} from '@reduxjs/toolkit'
import {setupListeners} from '@reduxjs/toolkit/dist/query'
import {drinksAPI} from './apis/drinksAPI'
import {
	searchDrinksReducer,
	updateSearchDrinks,
	isFetchingSearchDrinkData,
	isErrorFetchingSearchDrinksData,
	updateIsKeywordSearch,
	updateSearchKeyword
} from '../slices/searchDrinksSlice'
import {updateIsModalOpen, updateModalDrink, modalDrinkReducer} from '../slices/modalDrinkSlice'
import { updateDrinkMap , drinkPagerReducer} from '../slices/drinkPagerSlice'
import { updateDrinksByIngredient, ingredientsDrinksReducer } from '../slices/ingredientsDrinksSlice'
import { updateSelectedSpirit, spiritsDrinkReducer } from '../slices/spiritsDrinksSlice'

export const store = configureStore({
	reducer: {
		[drinksAPI.reducerPath]: drinksAPI.reducer,
		searchDrinks: searchDrinksReducer,
		modalDrink: modalDrinkReducer,
		drinkPagerMap: drinkPagerReducer,
		drinksByIngredient: ingredientsDrinksReducer,
		spiritsPageState: spiritsDrinkReducer
	},
	middleware: (getDefaultMiddleware) => {
		return getDefaultMiddleware().concat(drinksAPI.middleware)
	}
})

setupListeners(store.dispatch)

export {
	useFetchRandomDrinksQuery,
	useFetchPopularDrinksQuery,
	useFetchDrinksByFirstLetterQuery,
	useFetchDrinksByKeywordQuery,
	useFetchDrinkDataByIDQuery,
	useFetchDrinksBySpiritQuery,
	useFetchNonAlcoholicDrinksQuery,
	useFetchIngredientsQuery,
	useFetchDrinkByIngredientQuery
} from './apis/drinksAPI'
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export {
	updateSearchDrinks,
	isFetchingSearchDrinkData,
	isErrorFetchingSearchDrinksData,
	updateIsKeywordSearch,
	updateSearchKeyword,
	updateIsModalOpen,
	updateModalDrink,
	updateDrinkMap,
	updateDrinksByIngredient,
	updateSelectedSpirit
}
