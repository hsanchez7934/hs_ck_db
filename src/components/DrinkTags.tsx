import Chip from '@mui/material/Chip'
import { primaryFont } from '../fonts/fonts'

type TagsList = {tags: string[]}

const DrinkTags = ({tags}: TagsList) => {
	return (
		<div>
			{tags.map((text: string) => {
				return (
					<Chip
						key={text}
						label={text}
						sx={{
							backgroundImage: 'linear-gradient(to top, #434343 0%, #202121 100%)',
							backgroundPosition: 'center',
							backgroundSize: 'cover',
							backgroundRepeat: 'no-repeat',
							margin: '10px 10px 0 0',
							color: '#FFF',
							fontFamily: primaryFont
						}}
					/>
				)
			})}
		</div>
	)
}

export default DrinkTags
