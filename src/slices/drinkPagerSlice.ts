import {createSlice} from '@reduxjs/toolkit'
import {DrinkDataPoint} from '../types'

interface DrinkPagerState {
	drinkPagerMap: {data: DrinkDataPoint; previous: DrinkDataPoint; next: DrinkDataPoint} | any
}

const initialState: DrinkPagerState = {
	drinkPagerMap: {}
}

const drinkPagerSlice = createSlice({
	name: 'drinkPager',
	initialState,
	reducers: {
		updateDrinkMap: (state, action: {type: string; payload: any}) => {
			state.drinkPagerMap = action.payload
		}
	}
})

export const drinkPagerReducer = drinkPagerSlice.reducer
export const {updateDrinkMap} = drinkPagerSlice.actions
