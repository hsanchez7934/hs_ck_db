import {createSlice} from '@reduxjs/toolkit'

const drinkPagerSlice = createSlice({
	name: 'drinkPager',
	initialState: {
		drinkPagerMap: {}
	},
	reducers: {
		updateDrinkMap: (state, action: {type: string; payload: {}}) => {
			state.drinkPagerMap = action.payload
		}
	}
})

export const drinkPagerReducer = drinkPagerSlice.reducer
export const {updateDrinkMap} = drinkPagerSlice.actions
