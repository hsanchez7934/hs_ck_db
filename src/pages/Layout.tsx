import React, {useEffect} from 'react'
import SideBar from '../components/SideBar/SideBar'
import {getUserSavedDrinksFromDB} from '../firebase/firebase-user-drink-storage'
import {useAuth0} from '@auth0/auth0-react'
import {useAppSelector, useAppDispatch} from '../store/hooks'
import {updateUserSavedDrinks, updateGetFreshUpdate} from '../store'

const Layout: React.FC = () => {
	const {isAuthenticated, user} = useAuth0()
	const {getFreshUpdate} = useAppSelector(({savedDrinkState}) => savedDrinkState)
	const dispatch = useAppDispatch()

	useEffect(() => {
		if (!isAuthenticated || !getFreshUpdate || !user?.sub) {
			return
		}

		getUserSavedDrinksFromDB(user.sub)
			.then((savedDrinksList) => {
				dispatch(updateUserSavedDrinks(savedDrinksList))
			})
			.catch(() => {
				// Keep existing Redux state if Firestore sync fails.
			})
			.finally(() => {
				dispatch(updateGetFreshUpdate(false))
			})
	}, [isAuthenticated, user?.sub, getFreshUpdate, dispatch])

	useEffect(() => {
		if (!isAuthenticated) {
			dispatch(updateUserSavedDrinks([]))
		}
	}, [isAuthenticated, dispatch])

	return (
		<div className="full layout">
			<SideBar />
		</div>
	)
}

export default Layout
