import {createSlice} from '@reduxjs/toolkit'

const searchDrinksSlice = createSlice({
	name: 'searchDrinks',
	initialState: {
		searchDrinksData: {drinks: []},
		isFetchingDrinks: false,
		errorFetchingDrinks: null,
		isKeywordSearch: false,
		searchKeyword: '',
		clearHeaderSearchInputText: false
	},
	reducers: {
		updateSearchDrinks: (state, action: {type: string; payload: any}) => {
			const updatedState = action.payload.drinks ? action.payload : {drinks: []}
			state.searchDrinksData = updatedState
		},
		isFetchingSearchDrinkData: (state, action: {type: string; payload: boolean}) => {
			state.isFetchingDrinks = action.payload
		},
		isErrorFetchingSearchDrinksData: (state, action: {type: string; payload: any}) => {
			state.errorFetchingDrinks = action.payload
		},
		updateIsKeywordSearch: (state, action: {type: string; payload: boolean}) => {
			state.isKeywordSearch = action.payload
		},
		updateSearchKeyword: (state, action: {type: string; payload: string}) => {
			state.searchKeyword = action.payload
		},
		updateClearHeaderSearchInputText: (state, action: {type: string; payload: boolean}) => {
			state.clearHeaderSearchInputText = action.payload
		}
	}
})

export const searchDrinksReducer = searchDrinksSlice.reducer
export const {
	updateSearchDrinks,
	isFetchingSearchDrinkData,
	isErrorFetchingSearchDrinksData,
	updateIsKeywordSearch,
	updateSearchKeyword,
	updateClearHeaderSearchInputText
} = searchDrinksSlice.actions
