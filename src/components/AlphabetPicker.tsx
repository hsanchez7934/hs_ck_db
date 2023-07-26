import {FaCircle} from 'react-icons/fa'
import {secondaryFont, primaryFont} from '../fonts/fonts'
import {secondary} from '../colors/colors'

const AlphtabetPicker = () => {
	const alphabet = [
		'A',
		'B',
		'C',
		'D',
		'E',
		'F',
		'G',
		'H',
		'I',
		'J',
		'K',
		'L',
		'M',
		'N',
		'O',
		'P',
		'Q',
		'R',
		'S',
		'T',
		'U',
		'V',
		'W',
		'X',
		'Y',
		'Z'
	]
	return (
		<div style={{backgroundColor: 'white'}}>
			<ul
				style={{
					display: 'flex',
					justifyContent: 'space-evenly',
					listStyleType: 'none',
					padding: '0'
				}}
			>
				{alphabet.map((letter, index) => {
					return (
						<li
							style={{display: 'flex', alignItems: 'center', fontFamily: primaryFont}}
							key={letter}
						>
							{letter}{' '}
							{index !== alphabet.length - 1 ? (
								<FaCircle style={{fontSize: '5px', marginLeft: '10px', color: secondary}} />
							) : (
								<></>
							)}
						</li>
					)
				})}
			</ul>
		</div>
	)
}

export default AlphtabetPicker
