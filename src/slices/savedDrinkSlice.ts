import {createSlice} from '@reduxjs/toolkit'

interface SavedDrinkState {
	triggerRender: boolean;
}

const initialState: SavedDrinkState = {
	triggerRender: false
}

const savedDrinkSlice = createSlice({
	name: 'savedDrinkState',
	initialState,
	reducers: {
		updateTriggerRender: (state, action: {type: string; payload: any}) => {
			state.triggerRender = action.payload
		}
	}
})

export const savedDrinkReducer = savedDrinkSlice.reducer
export const {updateTriggerRender} = savedDrinkSlice.actions
