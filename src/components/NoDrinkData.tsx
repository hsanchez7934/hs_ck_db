import React from 'react'
import {primaryFont} from '../fonts/fonts'

type Props = {isSavedDrinksPage?: boolean; isErrorMessage?: boolean}

const NoDrinkDataNotice = (props: Props) => {
	const {isSavedDrinksPage, isErrorMessage} = props

	let text = ''
	if (isSavedDrinksPage) {
		text = `You haven't saved any drinks, browse the app and find some favorites!`
	} else if (isErrorMessage) {
		text = 'An error has occurred, please refresh the page.'
	} else {
		text = 'No data found.'
	}

	return (
		<div
			style={{
				height: '100%',
				width: '100%',
				display: 'flex',
				justifyContent: 'center',
				alignItems: window.innerWidth < 600 ? 'start' :'center',
				backgroundColor: '#000'
			}}
		>
			<p
				style={{
					fontFamily: primaryFont,
					fontSize: '2em',
					color: '#fff',
					textAlign: 'center',
					padding: '0px 10px'
				}}
			>
				{text}
			</p>
		</div>
	)
}

export default NoDrinkDataNotice
