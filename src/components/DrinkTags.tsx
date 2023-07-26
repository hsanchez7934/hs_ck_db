import Chip from '@mui/material/Chip'
import {secondary} from '../colors/colors'

type TagsList = {tags: string[]}

const DrinkTags = ({tags}: TagsList) => {
	return (
		<div>
			{tags.map((text: string) => {
				return (
					<Chip
						key={text}
						label={text}
						sx={{backgroundColor: secondary, marginRight: '10px', marginTop: '10px', color: '#FFF'}}
					/>
				)
			})}
		</div>
	)
}

export default DrinkTags
