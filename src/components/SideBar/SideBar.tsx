import './styles.css'

import * as React from 'react'
import {Link, useLocation} from 'react-router-dom'
import {useAppSelector, useAppDispatch} from '../../store/hooks'
import {updateUseSavedScrollTop} from '../../store'
import {useThemeMode} from '../../theme/AppThemeProvider'

import {FaCaretDown, FaCaretLeft, FaX, FaMartiniGlassEmpty} from 'react-icons/fa6'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import {Favorite} from '@mui/icons-material'
import HeaderIngredientsDropDown from '../HeaderIngredientsDropDown'
import HeaderSpiritsDropDown from '../HeaderSpiritsDropDown'
import HeaderSearchInput from '../HeaderSearchInput'
import {HomeRounded} from '@mui/icons-material'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import MenuIcon from '@mui/icons-material/Menu'
import {Search} from '@mui/icons-material'
import SideBarListItem from '../SideBarListItem'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import UserMenu from '../UserMenu/UserMenu'
import ThemeToggle from '../ThemeToggle/ThemeToggle'
import AnimatedOutlet from '../layout/AnimatedOutlet'

import {TiCoffee, TiSortAlphabetically} from 'react-icons/ti'
import {MdBlender} from 'react-icons/md'
import {GiBeerBottle} from 'react-icons/gi'

const SideBar: React.FC = () => {
	const dispatch = useAppDispatch()
	const {tokens} = useThemeMode()
	const {searchKeyword, isKeywordSearch} = useAppSelector(
		({searchDrinksState}) => searchDrinksState
	)
	const [navBarOpen, setNavBarOpen] = React.useState(false)
	const [showSearchLinks, setShowSearchLinks] = React.useState(false)

	const drawerWidth = 260
	const location = useLocation()
	const currentPath = location.pathname

	const linkIconStyles = (path: string, isSecondary: boolean) => ({
		margin: '0px 4px 4px 0px',
		fontSize: isSecondary ? '15px' : '22px',
		color: currentPath === path ? tokens.accent : tokens.textPrimary
	})

	const paths = [
		{path: '/', text: 'Home', icon: <HomeRounded sx={linkIconStyles('/', false)} />},
		{path: '/search', text: 'Search', icon: <Search sx={linkIconStyles('/search', false)} />},
		{
			path: '/saveddrinks',
			text: 'Saved Drinks',
			icon: <Favorite sx={linkIconStyles('/saveddrinks', false)} />
		}
	]

	const searchPaths = [
		{
			path: '/search/popularcocktails',
			text: 'Popular Cocktails',
			icon: <FaMartiniGlassEmpty style={linkIconStyles('/search/popularcocktails', true)} />
		},
		{
			path: '/search/byname',
			text: 'By Name',
			icon: <TiSortAlphabetically style={linkIconStyles('/search/byname', false)} />
		},
		{
			path: '/search/byspirit',
			text: 'By Spirit',
			icon: <GiBeerBottle style={linkIconStyles('/search/byspirit', false)} />
		},
		{
			path: '/search/byingredient',
			text: 'By Ingredient',
			icon: <MdBlender style={linkIconStyles('/search/byingredient', true)} />
		},
		{
			path: '/search/nonalcoholic',
			text: 'Non-Alcoholic',
			icon: <TiCoffee style={linkIconStyles('/search/nonalcoholic', false)} />
		}
	]

	React.useEffect(() => {
		if (currentPath.includes('search')) {
			setShowSearchLinks(true)
		}
	}, [currentPath])

	const handleSearchLinks = () => {
		setShowSearchLinks(!showSearchLinks)
	}

	const handleDrawerToggle = () => {
		setNavBarOpen(!navBarOpen)
	}

	const handleResetUseSavedScrollTop = () => dispatch(updateUseSavedScrollTop(false))

	const renderedSearchPaths = searchPaths.map((link) => {
		const isActivePath = currentPath === link.path ? tokens.accent : tokens.textSecondary
		return (
			<Link to={link.path} key={link.text} style={{textDecoration: 'none', color: isActivePath}}>
				<SideBarListItem
					link={link}
					linkIcon={link.icon}
					isActive={currentPath === link.path}
					onClick={() => handleResetUseSavedScrollTop()}
				/>
			</Link>
		)
	})

	const renderedNavLinks = paths.map((link) => {
		const caretStyles = {fontSize: '23px', color: tokens.textPrimary}
		if (link.text === 'Search') {
			return (
				<div key={link.path}>
					<SideBarListItem
						link={link}
						addedStyles={{color: tokens.textPrimary}}
						caretIcons={
							showSearchLinks ? (
								<FaCaretDown style={caretStyles} />
							) : (
								<FaCaretLeft style={caretStyles} />
							)
						}
						onClick={handleSearchLinks}
						linkIcon={link.icon}
						isActive={currentPath.includes('/search')}
					/>
					<div style={{paddingLeft: '20px'}} className={showSearchLinks ? 'visible' : 'hidden'}>
						{renderedSearchPaths}
					</div>
				</div>
			)
		}
		const isActivePath = currentPath === link.path ? tokens.accent : tokens.textSecondary
		return (
			<Link to={link.path} key={link.text} style={{color: isActivePath, textDecoration: 'none'}}>
				<SideBarListItem
					link={link}
					linkIcon={link.icon}
					isActive={currentPath === link.path}
					onClick={() => handleResetUseSavedScrollTop()}
				/>
			</Link>
		)
	})

	const drawer = (
		<div className="drawer-panel">
			<Toolbar className="drawer-toolbar">
				<Typography className="drawer-brand">Cocktail Explorer</Typography>
				<FaX onClick={() => setNavBarOpen(false)} className="nav_menu_close_icon" />
			</Toolbar>
			<Divider />
			<List sx={{overflow: 'auto', px: 1, py: 1}}>{renderedNavLinks}</List>
		</div>
	)

	const renderSearchText = isKeywordSearch && searchKeyword
	const searchResultsText = renderSearchText && (
		<Typography className="app-toolbar-title sidebar-search-results" id="largeViewSearchResultsText">
			Displaying search results for: "{searchKeyword}"
		</Typography>
	)

	const isUserProfilePath = currentPath === '/profile'
	const isSearchByNamePath = currentPath === '/search/byname'
	const isSearcByIngredientPath = currentPath === '/search/byingredient'
	const isSearchBySpiritsPath = currentPath === '/search/byspirit'
	const isRootPath = currentPath === '/'
	const renderSavedDrinksHeader = currentPath === '/saveddrinks'
	const renderPopularDrinksHeader = currentPath === '/search/popularcocktails'
	const renderNonAlcoholicDrinksHeader = currentPath === '/search/nonalcoholic'

	const renderHeaderText = (textToRender: string): React.ReactElement => (
		<Typography className="app-toolbar-title">{textToRender}</Typography>
	)

	return (
		<Box sx={{display: 'flex', height: '100vh'}}>
			<AppBar position="fixed" elevation={0}>
				<Toolbar className="app-toolbar">
					<IconButton
						color="inherit"
						aria-label="open drawer"
						edge="start"
						onClick={handleDrawerToggle}
						sx={{
							mr: 1,
							color: 'var(--text-primary)',
							border: '1px solid var(--border-subtle)',
							backgroundColor: 'var(--accent-muted)'
						}}
					>
						<MenuIcon />
					</IconButton>
					{isSearchByNamePath && (
						<div className="toolbar-search-wrap">
							<HeaderSearchInput isKeywordSearch={isKeywordSearch} />
						</div>
					)}
					{isSearchByNamePath && searchResultsText}
					{isSearcByIngredientPath && (
						<div className="toolbar-dropdown-wrap">
							<HeaderIngredientsDropDown />
						</div>
					)}
					{isSearchBySpiritsPath && (
						<div className="toolbar-dropdown-wrap">
							<HeaderSpiritsDropDown />
						</div>
					)}
					{isUserProfilePath && renderHeaderText('Profile')}
					{isRootPath && renderHeaderText('Cocktail Explorer')}
					{renderSavedDrinksHeader && renderHeaderText('Saved Drinks')}
					{renderPopularDrinksHeader && renderHeaderText('Popular Cocktails')}
					{renderNonAlcoholicDrinksHeader && renderHeaderText('Non-Alcoholic')}
					<Box sx={{flexGrow: 1}} />
					<ThemeToggle />
					<UserMenu />
				</Toolbar>
			</AppBar>
			{navBarOpen && (
				<Drawer
					open={navBarOpen}
					onClose={handleDrawerToggle}
					anchor="left"
					ModalProps={{
						keepMounted: true
					}}
					sx={{
						'& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth}
					}}
				>
					{drawer}
				</Drawer>
			)}
			<Box component="main" className="app-main">
				<Toolbar />
				<AnimatedOutlet />
			</Box>
		</Box>
	)
}

export default SideBar
