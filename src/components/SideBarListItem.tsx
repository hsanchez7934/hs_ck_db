import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import {secondaryFont} from '../fonts/fonts'

interface Props {
	link: {path: string; text: string}
	caretIcons?: JSX.Element,
	addedStyles?: {},
	onClick?: () => void
}

const SideBarListItem = (props: Props): JSX.Element => {
	const {link, caretIcons, addedStyles, onClick} = props
	const styles = {
		...addedStyles,
		fontFamily: secondaryFont,
		margin: '5px 0',
		fontSize: '20px'
	}

	return (
		<ListItem disablePadding onClick={onClick}>
			<ListItemButton>
				<ListItemText>
					<p style={styles}>{link.text}</p>
				</ListItemText>
				{caretIcons}
			</ListItemButton>
		</ListItem>
	)
}

export default SideBarListItem
