import {createSlice} from '@reduxjs/toolkit'

const modalDrinkSlice = createSlice({
	name: 'drinkModal',
	initialState: {
		isModalOpen: false,
		drink: null
	},
	reducers: {
		updateIsModalOpen: (state, action: {type: string; payload: boolean;}) => {
			state.isModalOpen = action.payload
		},
		updateModalDrink: (state, action: {type: string; payload: any}) => {
			state.drink = action.payload
		}
	}
})

export const modalDrinkReducer = modalDrinkSlice.reducer
export const {updateIsModalOpen, updateModalDrink} = modalDrinkSlice.actions
