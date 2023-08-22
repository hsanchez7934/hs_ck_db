import {primaryFont} from '../fonts/fonts'

const NoDrinkDataNotice = () => {
	return (
		<div
			style={{
				height: '100%',
				width: '100%',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: '#000'
			}}
		>
			<p
				style={{
					fontFamily: primaryFont,
					fontSize: '2em',
					color: '#fff'
				}}
			>
				No data found.
			</p>
		</div>
	)
}

export default NoDrinkDataNotice
