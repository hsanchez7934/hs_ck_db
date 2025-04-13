import React, {useEffect} from 'react'
import SideBar from '../components/SideBar/SideBar'
import {getUserSavedDrinksFromDB} from '../firebase/firebase-user-drink-storage'
import {useAuth0} from '@auth0/auth0-react'
import {useAppSelector, useAppDispatch} from '../store/hooks'
import {updateUserSavedDrinks, updateGetFreshUpdate} from '../store'

const Layout: React.FC = () => {
	const {isAuthenticated, user} = useAuth0()
	const {getFreshUpdate, userSavedDrinks} = useAppSelector(({savedDrinkState}) => savedDrinkState)
	const dispatch = useAppDispatch()

	useEffect(() => {
		if (isAuthenticated) {
			if (getFreshUpdate) {
				getUserSavedDrinksFromDB(user?.sub).then((savedDrinksList) => {
					dispatch(updateUserSavedDrinks(savedDrinksList))
					dispatch(updateGetFreshUpdate(false))
				})
			} else {
				dispatch(updateUserSavedDrinks(userSavedDrinks))
			}
		}
	}, [isAuthenticated, user, getFreshUpdate, userSavedDrinks, dispatch])

	return (
		<div className="full layout">
			<SideBar />
		</div>
	)
}

export default Layout
