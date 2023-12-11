import {createSlice} from '@reduxjs/toolkit'

interface SpiritsDrinkState {
	selectedSpirit: string
}

const initialState: SpiritsDrinkState = {
	selectedSpirit: ''
}

const spiritsDrinkSlice = createSlice({
	name: 'spiritsPage',
	initialState,
	reducers: {
		updateSelectedSpirit: (state, action: {type: string; payload: any}) => {
			state.selectedSpirit = action.payload
		}
	}
})

export const spiritsDrinkReducer = spiritsDrinkSlice.reducer
export const {updateSelectedSpirit} = spiritsDrinkSlice.actions
