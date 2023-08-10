import './styles.css'
import * as React from 'react'
import {Link, Outlet, useLocation} from 'react-router-dom'
import {FaCocktail} from 'react-icons/fa'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import MenuIcon from '@mui/icons-material/Menu'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import {primary, active} from '../../colors/colors'
import {secondaryFont} from '../../fonts/fonts'
import {FaCaretDown} from 'react-icons/fa6'
import {FaCaretLeft} from 'react-icons/fa6'

interface Props {
	window?: () => Window
}

const drawerWidth = 240
const paths = [
	{path: '/', text: 'Home'},
	{path: '/search', text: 'Search'}
]

const searchPaths = [{path: '/search/populardrinks', text: 'Popular Drinks'}, {path: '/search/byname', text: 'By Name'}]

const SideBar: React.FC = (props: Props) => {
	const {window} = props
	const container = window !== undefined ? () => window().document.body : undefined

	const [mobileOpen, setMobileOpen] = React.useState(false)
	const [currentPath, setCurrentPath] = React.useState('')
	const [showSearchLinks, setShowSearchLinks] = React.useState(false)

	const handleSearchLinks = () => {
		setShowSearchLinks(!showSearchLinks)
	}

	let location = useLocation()
	React.useEffect(() => {
		setCurrentPath(location.pathname)
	}, [location])

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen)
	}

	const renderedSearchPaths = searchPaths.map((link) => {
		return (
			<Link to={link.path} key={link.text} style={{textDecoration: 'none'}}>
				<ListItem disablePadding>
					<ListItemButton>
						<ListItemText>
							<p
								style={{
									fontFamily: secondaryFont,
									margin: '5px 0',
									fontSize: '20px',
									color: 'white'
								}}
							>
								{link.text}
							</p>
						</ListItemText>
					</ListItemButton>
				</ListItem>
			</Link>
		)
	})

	const renderedNavLinks = paths.map((link) => {
		const isActiveLink = showSearchLinks ? active : '#fff'
		const caretStyles = {fontSize: '23px', color: isActiveLink}
		if (link.text === 'Search') {
			return (
				<div>
					<ListItem disablePadding onClick={handleSearchLinks}>
						<ListItemButton>
							<ListItemText>
								<p
									style={{
										fontFamily: secondaryFont,
										margin: '5px 0',
										fontSize: '20px',
										color: isActiveLink
									}}
								>
									{link.text}
								</p>
							</ListItemText>
							{showSearchLinks ? (
							<FaCaretDown style={caretStyles} />
						) : (
							<FaCaretLeft style={caretStyles} />
						)}
						</ListItemButton>
					</ListItem>
					<div style={{paddingLeft: '20px'}} className={showSearchLinks ? 'visible' : 'hidden'}>
						{renderedSearchPaths}
					</div>
				</div>
			)
		}
		const isActivePath = currentPath.split(' ')[0] === link.path ? active : '#FFF'
		return (
			<Link to={link.path} key={link.text} style={{color: isActivePath, textDecoration: 'none'}}>
				<ListItem disablePadding>
					<ListItemButton>
						<ListItemText>
							<p
								style={{
									fontFamily: secondaryFont,
									margin: '5px 0',
									fontSize: '20px'
								}}
							>
								{link.text}
							</p>
						</ListItemText>
					</ListItemButton>
				</ListItem>
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
					backgroundColor: '#fff',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					fontSize: '35px',
					color: primary
				}}
			>
				<FaCocktail />
			</Toolbar>
			<Divider />
			<List>{renderedNavLinks}</List>
		</div>
	)

	return (
		<Box sx={{display: 'flex', height: '100vh'}}>
			<CssBaseline />
			<AppBar
				position="fixed"
				sx={{
					width: {sm: `calc(100% - ${drawerWidth}px)`},
					ml: {sm: `${drawerWidth}px`}
				}}
			>
				<Toolbar
					sx={{
						backgroundImage: 'linear-gradient(to left, #434343 0%, black 100%)',
						height: '100%'
					}}
				>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						edge="start"
						onClick={handleDrawerToggle}
						sx={{mr: 2, display: {sm: 'none'}}}
					>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" noWrap component="div">
						Render the name of the page that you're on here
					</Typography>
				</Toolbar>
			</AppBar>
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
						display: {xs: 'block', sm: 'none'},
						'& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth}
					}}
				>
					{drawer}
				</Drawer>
				<Drawer
					variant="permanent"
					sx={{
						display: {xs: 'none', sm: 'block'},
						'& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth}
					}}
					open
				>
					{drawer}
				</Drawer>
			</Box>
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					p: 3,
					width: {sm: `calc(100% - ${drawerWidth}px)`},
					height: '100vh',
					backgroundColor: '#ECECEC',
					overflow: 'auto',
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
