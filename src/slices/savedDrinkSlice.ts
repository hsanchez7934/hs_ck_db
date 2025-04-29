import {createSlice} from '@reduxjs/toolkit'
import { DrinkDataPoint } from '../types';

interface SavedDrinkState {
	triggerRender: boolean;
	userSavedDrinks: DrinkDataPoint[] | []
	getFreshUpdate: boolean
}

const initialState: SavedDrinkState = {
	triggerRender: false,
	userSavedDrinks: [],
	getFreshUpdate: true
}

const savedDrinkSlice = createSlice({
	name: 'savedDrinkState',
	initialState,
	reducers: {
		updateTriggerRender: (state, action: {type: string; payload: any}) => {
			state.triggerRender = action.payload
		},
		updateUserSavedDrinks: (state, action: {type: string; payload: any}) => {
			state.userSavedDrinks = action.payload
		},
		updateGetFreshUpdate: (state, action: {type: string; payload: any}) => {
			state.getFreshUpdate = action.payload
		}
	}
})

export const savedDrinkReducer = savedDrinkSlice.reducer
export const {updateTriggerRender, updateUserSavedDrinks, updateGetFreshUpdate} = savedDrinkSlice.actions
