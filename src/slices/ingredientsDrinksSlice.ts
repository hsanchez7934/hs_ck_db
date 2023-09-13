import {createSlice} from '@reduxjs/toolkit'
// import {}

const initialState: any = {
	drinksByIngredient: []
}

const ingredientsDrinksSlice = createSlice({
	name: 'drinksByIngredient',
	initialState,
	reducers: {
		updateDrinksByIngredient: (state, action: any) => {
			state.drinksByIngredient = action.payload
		}
	}
})

export const ingredientsDrinksReducer = ingredientsDrinksSlice.reducer
export const {updateDrinksByIngredient} = ingredientsDrinksSlice.actions