import {createSlice} from '@reduxjs/toolkit'

const savedScrollTopSlice = createSlice({
	name: 'savedScrollTop',
	initialState: {
		useSavedScrollTop: false
	},
	reducers: {
		updateUseSavedScrollTop: (state, action: {type: string; payload: boolean}) => {
			state.useSavedScrollTop = action.payload
		}
	}
})

export const savedScrollTopReducer = savedScrollTopSlice.reducer
export const {updateUseSavedScrollTop} = savedScrollTopSlice.actions
