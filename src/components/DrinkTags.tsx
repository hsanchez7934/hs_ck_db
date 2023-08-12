import Chip from '@mui/material/Chip'
import { secondaryFont } from '../fonts/fonts'

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
							backgroundImage: 'linear-gradient(to top, #434343 0%, black 100%)',
							backgroundPosition: 'center',
							backgroundSize: 'cover',
							backgroundRepeat: 'no-repeat',
							margin: '10px 10px 0 0',
							color: '#FFF',
							fontFamily: secondaryFont
						}}
					/>
				)
			})}
		</div>
	)
}

export default DrinkTags
