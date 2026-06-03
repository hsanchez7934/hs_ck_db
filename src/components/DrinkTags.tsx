import React from 'react'
import Chip from '@mui/material/Chip'
import {primaryFont} from '../fonts/fonts'

type TagsList = {tags: string[]}

const DrinkTags = ({tags}: TagsList) => {
	return (
		<div className="drink-tags-list">
			{tags.map((text: string) => {
				return (
					<Chip
						key={text}
						label={text.trim()}
						size="small"
						sx={{
							backgroundColor: 'var(--accent-muted)',
							border: '1px solid var(--border-subtle)',
							margin: '0 8px 8px 0',
							color: 'var(--text-secondary)',
							fontFamily: primaryFont,
							fontSize: '0.78rem',
							height: 'auto',
							'& .MuiChip-label': {
								padding: '6px 10px'
							}
						}}
					/>
				)
			})}
		</div>
	)
}

export default DrinkTags
