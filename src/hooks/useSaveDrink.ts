import {useCallback, useEffect, useState} from 'react'
import {useAuth0} from '@auth0/auth0-react'
import {saveUserDrinkInDB} from '../firebase/firebase-user-drink-storage'
import {useAppDispatch, useAppSelector} from '../store/hooks'
import {
	updateGetFreshUpdate,
	updateTriggerRender,
	updateUserSavedDrinks
} from '../store'
import {DrinkDataPoint} from '../types'

type SaveDialogState = {
	open: boolean
	color: string
	text: string
}

type UseSaveDrinkResult = {
	isAuthenticated: boolean
	toggleLoginDialog: boolean
	setToggleLoginDialog: (open: boolean) => void
	dialogState: SaveDialogState
	isDrinkSaved: (drinkID: string | null | undefined) => boolean
	toggleSaveDrink: (
		drink: DrinkDataPoint,
		options?: {isCurrentlySaved?: boolean; onSavedChange?: (saved: boolean) => void}
	) => void
}

export function useSaveDrink(): UseSaveDrinkResult {
	const {isAuthenticated, user} = useAuth0()
	const dispatch = useAppDispatch()
	const {userSavedDrinks} = useAppSelector(({savedDrinkState}) => savedDrinkState)
	const [toggleLoginDialog, setToggleLoginDialog] = useState(false)
	const [dialogState, setDialogState] = useState<SaveDialogState>({
		open: false,
		color: '',
		text: ''
	})

	useEffect(() => {
		if (!dialogState.open) {
			return
		}

		const timer = window.setTimeout(() => {
			setDialogState((previous) => ({...previous, open: false}))
		}, 1500)

		return () => window.clearTimeout(timer)
	}, [dialogState.open, dialogState.text])

	const isDrinkSaved = useCallback(
		(drinkID: string | null | undefined) => {
			if (!drinkID) {
				return false
			}
			return Boolean(userSavedDrinks?.find((savedDrink: DrinkDataPoint) => savedDrink.idDrink === drinkID))
		},
		[userSavedDrinks]
	)

	const toggleSaveDrink = useCallback(
		(
			drink: DrinkDataPoint,
			options?: {isCurrentlySaved?: boolean; onSavedChange?: (saved: boolean) => void}
		) => {
			if (!isAuthenticated) {
				setToggleLoginDialog(true)
				return
			}

			if (!user?.sub) {
				setDialogState({open: true, color: 'red', text: 'Unable to save drink. Please sign in again.'})
				return
			}

			const currentlySaved = options?.isCurrentlySaved ?? isDrinkSaved(drink.idDrink)
			dispatch(updateTriggerRender(true))
			options?.onSavedChange?.(!currentlySaved)

			const nextDrinks = currentlySaved
				? userSavedDrinks.filter((savedDrink: DrinkDataPoint) => savedDrink.idDrink !== drink.idDrink)
				: [...userSavedDrinks, drink]

			saveUserDrinkInDB(user.sub, nextDrinks)
				.then(() => {
					dispatch(updateUserSavedDrinks(nextDrinks))
					dispatch(updateGetFreshUpdate(true))
					setDialogState({
						open: true,
						color: currentlySaved ? 'red' : 'green',
						text: currentlySaved ? 'Removed from favorites!' : 'Saved to favorites!'
					})
				})
				.catch(() => {
					options?.onSavedChange?.(currentlySaved)
					setDialogState({
						open: true,
						color: 'red',
						text: 'Something went wrong. Please try again.'
					})
				})
		},
		[dispatch, isAuthenticated, isDrinkSaved, user?.sub, userSavedDrinks]
	)

	return {
		isAuthenticated,
		toggleLoginDialog,
		setToggleLoginDialog,
		dialogState,
		isDrinkSaved,
		toggleSaveDrink
	}
}

export default useSaveDrink
