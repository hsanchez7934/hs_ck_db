// @ts-expect-error
import imageUrl from '../images/no_drinks_found.jpg'
import {secondaryFont} from '../fonts/fonts'

const NoDrinkDataNotice = () => {
	return (
		<div
			style={{
				height: '100%',
				width: '100%',
				backgroundImage: `url(${imageUrl})`,
				backgroundRepeat: 'no-repeat',
				backgroundPosition: 'center',
				backgroundSize: 'cover',
				position: 'relative'
			}}
		>
			<div
				style={{
					height: '100%',
					width: '100%',
					opacity: 0.8,
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					position: 'absolute',
					top: 0,
					backgroundColor: '#000'
				}}
			>
				<p
					style={{
						fontFamily: secondaryFont,
						fontSize: '2em',
						color: '#fff'
					}}
				>
					No data found, perhaps try another search.
				</p>
			</div>
		</div>
	)
}

export default NoDrinkDataNotice
