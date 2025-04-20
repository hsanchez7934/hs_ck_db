import React from 'react'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import {primaryFont} from '../fonts/fonts'

interface Props {
	link: {path: string; text: string}
	caretIcons?: JSX.Element,
	addedStyles?: {},
	onClick?: () => void,
	linkIcon: JSX.Element
}

const SideBarListItem = (props: Props): JSX.Element => {
	const {link, caretIcons, addedStyles, onClick, linkIcon} = props
	const styles = {
		...addedStyles,
		fontFamily: primaryFont,
		margin: '0',
		fontSize: '20px'
	}

	return (
		<ListItem disablePadding onClick={onClick} sx={{margin: '5px 0'}}>
			<ListItemButton>
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
