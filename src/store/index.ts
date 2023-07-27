import {configureStore} from '@reduxjs/toolkit'
import {setupListeners} from '@reduxjs/toolkit/dist/query'
import {drinksAPI} from './apis/drinksAPI'
import {
	searchDrinksReducer,
	updateSearchDrinks,
	isFetchingSearchDrinkData,
	isErrorFetchingSearchDrinksData
} from '../slices/searchDrinksSlice'

export const store = configureStore({
	reducer: {
		[drinksAPI.reducerPath]: drinksAPI.reducer,
		searchDrinks: searchDrinksReducer
	},
	middleware: (getDefaultMiddleware) => {
		return getDefaultMiddleware().concat(drinksAPI.middleware)
	}
})

setupListeners(store.dispatch)

export {
	useFetchRandomDrinksQuery,
	useFetchPopularDrinksQuery,
	useFetchDrinkByNameQuery
} from './apis/drinksAPI'
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export {updateSearchDrinks, isFetchingSearchDrinkData, isErrorFetchingSearchDrinksData}
