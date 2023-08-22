import './styles.css'
import * as React from 'react'
import {active} from '../../colors/colors'
import {FaCaretDown, FaCaretLeft, FaX} from 'react-icons/fa6'
import {Link, Outlet, useLocation} from 'react-router-dom'
import {primaryFont} from '../../fonts/fonts'
import {useAppSelector} from '../../store/hooks'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import HeaderSearchInput from '../HeaderSearchInput'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import MenuIcon from '@mui/icons-material/Menu'
import SideBarListItem from '../SideBarListItem'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

interface Props {
	window?: () => Window
}

const drawerWidth = 240
const paths = [
	{path: '/', text: 'Home'},
	{path: '/search', text: 'Search'},
	{path: '/mydrinks', text: 'My Drinks'}
]

const searchPaths = [
	{path: '/search/populardrinks', text: 'Popular Drinks'},
	{path: '/search/byname', text: 'By Name'},
	{path: '/search/byspirit', text: 'By Spirit'}
]

const SideBar: React.FC = (props: Props) => {
	const {window} = props
	const container = window !== undefined ? () => window().document.body : undefined

	const {searchKeyword, isKeywordSearch} = useAppSelector(({searchDrinks}) => searchDrinks)

	const [mobileOpen, setMobileOpen] = React.useState(false)
	const [currentPath, setCurrentPath] = React.useState('')
	const [showSearchLinks, setShowSearchLinks] = React.useState(false)

	const handleSearchLinks = () => {
		setShowSearchLinks(!showSearchLinks)
	}

	let location = useLocation()
	React.useEffect(() => {
		setCurrentPath(location.pathname)
		if (currentPath.split(' ')[0].includes('search')) {
			setShowSearchLinks(true)
		}
	}, [location, currentPath])

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen)
	}

	const renderedSearchPaths = searchPaths.map((link) => {
		const isActivePath = currentPath.split(' ')[0] === link.path ? active : '#FFF'
		return (
			<Link to={link.path} key={link.text} style={{textDecoration: 'none', color: isActivePath}}>
				<SideBarListItem link={link} />
			</Link>
		)
	})

	const renderedNavLinks = paths.map((link) => {
		const caretStyles = {fontSize: '23px', color: '#fff'}
		if (link.text === 'Search') {
			return (
				<div key={link.path}>
					<SideBarListItem
						link={link}
						addedStyles={{color: '#fff'}}
						caretIcons={
							showSearchLinks ? (
								<FaCaretDown style={caretStyles} />
							) : (
								<FaCaretLeft style={caretStyles} />
							)
						}
						onClick={handleSearchLinks}
					/>
					<div style={{paddingLeft: '20px'}} className={showSearchLinks ? 'visible' : 'hidden'}>
						{renderedSearchPaths}
					</div>
				</div>
			)
		}
		const isActivePath = currentPath.split(' ')[0] === link.path ? active : '#FFF'
		return (
			<Link to={link.path} key={link.text} style={{color: isActivePath, textDecoration: 'none'}}>
				<SideBarListItem link={link} />
			</Link>
		)
	})

	const drawer = (
		<div
			style={{
				backgroundImage: 'linear-gradient(to top, #434343 0%, black 100%)',
				backgroundPosition: 'center',
				backgroundSize: 'cover',
				backgroundRepeat: 'no-repeat',
				height: '100%'
			}}
		>
			<Toolbar
				sx={{
					backgroundColor: '#000',
					display: 'flex',
					justifyContent: 'end',
					alignItems: 'center',
					fontSize: '20px',
					color: 'white'
				}}
			>
				<FaX onClick={() => setMobileOpen(false)} className="nav_menu_close_icon" />
			</Toolbar>
			<Divider />
			<List>{renderedNavLinks}</List>
		</div>
	)

	const renderSearchText = isKeywordSearch && searchKeyword
	const searchResultsText = renderSearchText && (
		<Typography sx={{fontFamily: primaryFont, marginLeft: '10px'}}>
			Displaying search results for: "{searchKeyword}"
		</Typography>
	)

	const isSearchByNamePath = currentPath.split(' ')[0] === '/search/byname'

	return (
		<Box sx={{display: 'flex', height: '100vh'}}>
			<CssBaseline />
			<AppBar position="fixed">
				<Toolbar
					sx={{
						backgroundColor: '#000',
						height: '100%'
					}}
				>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						edge="start"
						onClick={handleDrawerToggle}
						sx={{mr: 2}}
					>
						<MenuIcon />
					</IconButton>
					{isSearchByNamePath && <HeaderSearchInput isKeywordSearch={isKeywordSearch} />}
					{isSearchByNamePath && searchResultsText}
				</Toolbar>
			</AppBar>
			{mobileOpen && (
				<Box
					component="nav"
					sx={{width: {sm: drawerWidth}, flexShrink: {sm: 0}}}
					aria-label="mailbox folders"
				>
					<Drawer
						container={container}
						variant="temporary"
						open={mobileOpen}
						onClose={handleDrawerToggle}
						ModalProps={{
							keepMounted: true // Better open performance on mobile.
						}}
						sx={{
							'& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth}
						}}
					>
						{drawer}
					</Drawer>
				</Box>
			)}
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					p: 3,
					width: {sm: '100%'},
					backgroundImage: 'linear-gradient(to top, #434343 0%, black 100%)',
					backgroundPosition: 'center',
					backgroundSize: 'cover',
					backgroundRepeat: 'no-repeat',
					padding: '0'
				}}
			>
				<Toolbar />
				<Outlet />
			</Box>
		</Box>
	)
}

export default SideBar
