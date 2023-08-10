import {createSlice} from '@reduxjs/toolkit'

const searchDrinksSlice = createSlice({
	name: 'searchDrinks',
	initialState: {
		searchDrinksData: {drinks: []},
		isFetchingDrinks: false,
		errorFetchingDrinks: null
	},
	reducers: {
		updateSearchDrinks: (state, action) => {
			const updatedState = action.payload.drinks ? action.payload : {drinks: []}
			state.searchDrinksData = updatedState
		},
		isFetchingSearchDrinkData: (state, action) => {
			state.isFetchingDrinks = action.payload
		},
		isErrorFetchingSearchDrinksData: (state, action) => {
			state.errorFetchingDrinks = action.payload
		}
	}
})

export const searchDrinksReducer = searchDrinksSlice.reducer
export const {updateSearchDrinks, isFetchingSearchDrinkData, isErrorFetchingSearchDrinksData} = searchDrinksSlice.actions
