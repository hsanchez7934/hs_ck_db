import {createSlice} from '@reduxjs/toolkit'

const mobileHomePageSlice = createSlice({
	name: 'mobileHomePageState',
	initialState: {
		renderNextSetOfDrinks: false
	},
	reducers: {
		updateRenderNextSetOfDrinks: (state, action: {type: string; payload: boolean}) => {
			state.renderNextSetOfDrinks = action.payload
		}
	}
})

export const mobileHomePageReducer = mobileHomePageSlice.reducer
export const {updateRenderNextSetOfDrinks} = mobileHomePageSlice.actions
