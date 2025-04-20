import './styles.css'
import React, {useEffect, useState} from 'react'

import DrinkImageList from '../../components/DrinksImageList/DrinksImageList'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import NoDrinkDataNotice from '../../components/NoDrinkData'
import {primaryFont} from '../../fonts/fonts'
import {useAppSelector, useAppDispatch} from '../../store/hooks'
import {useAuth0} from '@auth0/auth0-react'
import {updateTriggerRender} from '../../store'

const SavedDrinksPage = () => {
	const {loginWithPopup} = useAuth0()
	const {user, isAuthenticated} = useAuth0()
	const [dataToRender, setDataToRender] = useState([])
	const {triggerRender, userSavedDrinks} = useAppSelector(({savedDrinkState}) => savedDrinkState)
	const dispatch = useAppDispatch()

	const handleLogin = async () => {
		loginWithPopup()
	}

	useEffect(() => {
		// @ts-expect-error generic
		setDataToRender(userSavedDrinks)

		if (triggerRender) {
			dispatch(updateTriggerRender(false))
		}
	}, [triggerRender, user, userSavedDrinks, dispatch])

	const renderLoginNotice = () => {
		return (
			<div
				style={{
					height: '100%',
					width: '100%',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: '#000',
					flexDirection: 'column',
				}}
			>
				<p
					style={{
						fontSize: '1.8em',
						color: '#fff',
						textAlign: 'center',
						padding: '0px 10px',
						fontFamily: primaryFont
					}}
				>
					You must sign in to view your saved drinks. Click the button below to sign in.
				</p>
				<button id="btn_loginFromSavedDrinksPage" onClick={() => handleLogin()} style={{fontFamily: primaryFont}}>
					Sign In
				</button>
			</div>
		)
	}

	let content = <LoadingSpinner />
	if (!isAuthenticated) {
		content = renderLoginNotice()
	} else if (dataToRender.length > 0) {
		content = <DrinkImageList drinksData={dataToRender} />
	} else if (dataToRender.length === 0) {
		content = <NoDrinkDataNotice isSavedDrinksPage={true} />
	}
	return <div style={{overflow: 'auto', height: 'calc(100% - 64px)'}}>{content}</div>
}

export default SavedDrinksPage
