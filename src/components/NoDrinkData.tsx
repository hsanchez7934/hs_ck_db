import {primaryFont} from '../fonts/fonts'

type Props = {isSavedDrinksPage?: boolean}

const NoDrinkDataNotice = (props: Props) => {
	const {isSavedDrinksPage} = props
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
				{isSavedDrinksPage ? `You haven't saved any drinks, browse the app and find some favorites!` : 'No data found.'}
			</p>
		</div>
	)
}

export default NoDrinkDataNotice
