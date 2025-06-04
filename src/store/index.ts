import {configureStore} from '@reduxjs/toolkit'
import {setupListeners} from '@reduxjs/toolkit/dist/query'
import {drinksAPI} from './apis/drinksAPI'
import {
	searchDrinksReducer,
	updateSearchDrinks,
	isFetchingSearchDrinkData,
	isErrorFetchingSearchDrinksData,
	updateIsKeywordSearch,
	updateSearchKeyword,
	updateClearHeaderSearchInputText
} from '../slices/searchDrinksSlice'
import {updateIsModalOpen, updateModalDrink, modalDrinkReducer} from '../slices/modalDrinkSlice'
import {updateDrinkMap, drinkPagerReducer} from '../slices/drinkPagerSlice'
import {updateDrinksByIngredient, ingredientsDrinksReducer} from '../slices/ingredientsDrinksSlice'
import {updateSelectedSpirit, spiritsDrinkReducer} from '../slices/spiritsDrinksSlice'
import {
	updateTriggerRender,
	updateUserSavedDrinks,
	updateGetFreshUpdate,
	savedDrinkReducer
} from '../slices/savedDrinkSlice'
import {updateUseSavedScrollTop, savedScrollTopReducer} from '../slices/savedScrollTopSlice'

export const store = configureStore({
	reducer: {
		[drinksAPI.reducerPath]: drinksAPI.reducer,
		searchDrinksState: searchDrinksReducer,
		modalDrinkState: modalDrinkReducer,
		drinkPagerMapState: drinkPagerReducer,
		drinksByIngredientState: ingredientsDrinksReducer,
		spiritsPageState: spiritsDrinkReducer,
		savedDrinkState: savedDrinkReducer,
		useSavedScrollTopState: savedScrollTopReducer
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
	updateClearHeaderSearchInputText,
	updateSearchKeyword,
	updateIsModalOpen,
	updateModalDrink,
	updateDrinkMap,
	updateDrinksByIngredient,
	updateSelectedSpirit,
	updateTriggerRender,
	updateUseSavedScrollTop,
	updateUserSavedDrinks,
	updateGetFreshUpdate
}
