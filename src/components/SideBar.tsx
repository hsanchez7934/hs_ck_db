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
import {primary, active} from '../colors/colors'
import {secondaryFont} from '../fonts/fonts'

interface Props {
	window?: () => Window
}

const drawerWidth = 240
const paths = [
	{path: '/', text: 'Home'},
	{path: '/classics', text: 'The Classics'},
	{path: '/search', text: 'Search'}
]

const SideBar: React.FC = (props: Props) => {
	const {window} = props
	const container = window !== undefined ? () => window().document.body : undefined

	const [mobileOpen, setMobileOpen] = React.useState(false)
	const [currentPath, setCurrentPath] = React.useState('')

	let location = useLocation()
	React.useEffect(() => {
		setCurrentPath(location.pathname)
	}, [location])

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen)
	}

	const renderedNavLinks = paths.map((link, index) => {
		const isActivePath = currentPath.split(' ')[0] === link.path ? active : '#FFF'
		return (
			<Link to={link.path} key={link.text} style={{color: isActivePath, textDecoration: 'none'}}>
				<ListItem key={link.text} disablePadding>
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
		<div style={{backgroundColor: primary, height: '100%'}}>
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
		<Box sx={{display: 'flex'}}>
			<CssBaseline />
			<AppBar
				position="fixed"
				sx={{
					width: {sm: `calc(100% - ${drawerWidth}px)`},
					ml: {sm: `${drawerWidth}px`}
				}}
			>
				<Toolbar sx={{backgroundColor: primary}}>
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
					overflow: 'auto'
				}}
			>
				<Toolbar />
				<Outlet />
			</Box>
		</Box>
	)
}

export default SideBar
