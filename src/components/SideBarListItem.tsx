import React from 'react'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import {primaryFont} from '../fonts/fonts'

interface Props {
	link: {path: string; text: string}
	caretIcons?: JSX.Element
	addedStyles?: React.CSSProperties
	onClick?: () => void
	linkIcon: JSX.Element
	isActive?: boolean
}

const SideBarListItem = (props: Props): JSX.Element => {
	const {link, caretIcons, addedStyles, onClick, linkIcon, isActive = false} = props
	const styles: React.CSSProperties = {
		...addedStyles,
		fontFamily: primaryFont,
		margin: 0,
		fontSize: '18px',
		color: isActive ? 'var(--accent)' : 'var(--text-secondary)'
	}

	return (
		<ListItem disablePadding onClick={onClick} sx={{margin: '4px 0'}}>
			<ListItemButton
				sx={{
					borderRadius: '10px',
					border: isActive ? '1px solid var(--accent)' : '1px solid transparent',
					backgroundColor: isActive ? 'var(--accent-muted)' : 'transparent'
				}}
			>
				{linkIcon}
				<ListItemText>
					<p style={styles}>{link.text}</p>
				</ListItemText>
				{caretIcons}
			</ListItemButton>
		</ListItem>
	)
}

export default SideBarListItem
