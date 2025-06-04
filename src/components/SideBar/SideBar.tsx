import './styles.css'
import {active} from '../../colors/colors'

import * as React from 'react'
import {Link, Outlet, useLocation} from 'react-router-dom'
import {useAppSelector, useAppDispatch} from '../../store/hooks'
import {updateUseSavedScrollTop} from '../../store'

import {FaCaretDown, FaCaretLeft, FaX, FaMartiniGlassEmpty} from 'react-icons/fa6'
// import {FaCirclePlus} from 'react-icons/fa6'
import {primaryFont} from '../../fonts/fonts'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
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

import {TiCoffee, TiSortAlphabetically} from 'react-icons/ti'
import {MdBlender} from 'react-icons/md'
import {GiBeerBottle} from 'react-icons/gi'

const SideBar: React.FC = () => {
	const dispatch = useAppDispatch()
	const {searchKeyword, isKeywordSearch} = useAppSelector(
		({searchDrinksState}) => searchDrinksState
	)
	const [navBarOpen, setNavBarOpen] = React.useState(false)
	const [currentPath, setCurrentPath] = React.useState('')
	const [showSearchLinks, setShowSearchLinks] = React.useState(false)

	const drawerWidth = 240
	const linkIconStyles = (path: string, isSecondary: boolean) => ({
		margin: '0px 4px 4px 0px',
		fontSize: isSecondary ? '15px' : '22px',
		color: currentPath.split(' ')[0] === path ? active : '#FFF'
	})

	const paths = [
		{path: '/', text: 'Home', icon: <HomeRounded sx={linkIconStyles('/', false)} />},
		{path: '/search', text: 'Search', icon: <Search sx={linkIconStyles('/search', false)} />},
		{
			path: '/saveddrinks',
			text: 'Saved Drinks',
			icon: <Favorite sx={linkIconStyles('/saveddrinks', false)} />
		},
		// {path: '/create', text: 'Create', icon: <FaCirclePlus style={linkIconStyles('/create', false)} />}
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

	const handleSearchLinks = () => {
		setShowSearchLinks(!showSearchLinks)
	}

	const location = useLocation()
	React.useEffect(() => {
		setCurrentPath(location.pathname)
		if (currentPath.split(' ')[0].includes('search')) {
			setShowSearchLinks(true)
		}
	}, [location, currentPath])

	const handleDrawerToggle = () => {
		setNavBarOpen(!navBarOpen)
	}

	const handleResetUseSavedScrollTop = () => dispatch(updateUseSavedScrollTop(false))

	const renderedSearchPaths = searchPaths.map((link) => {
		const isActivePath = currentPath.split(' ')[0] === link.path ? active : '#FFF'
		return (
			<Link to={link.path} key={link.text} style={{textDecoration: 'none', color: isActivePath}}>
				<SideBarListItem
					link={link}
					linkIcon={link.icon}
					onClick={() => handleResetUseSavedScrollTop()}
				/>
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
						linkIcon={link.icon}
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
				<SideBarListItem
					link={link}
					linkIcon={link.icon}
					onClick={() => handleResetUseSavedScrollTop()}
				/>
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
				height: '100%',
				overflow: 'hidden'
			}}
		>
			<Toolbar
				sx={{
					backgroundColor: '#000',
					display: 'flex',
					justifyContent: 'end',
					alignItems: 'center',
					fontSize: '18px',
					color: 'white'
				}}
			>
				<FaX onClick={() => setNavBarOpen(false)} className="nav_menu_close_icon" />
			</Toolbar>
			<Divider />
			<List sx={{overflow: 'auto'}}>{renderedNavLinks}</List>
		</div>
	)

	const renderSearchText = isKeywordSearch && searchKeyword
	const searchResultsText = renderSearchText && (
		<Typography sx={{fontFamily: primaryFont, marginLeft: '10px'}} id="largeViewSearchResultsText">
			Displaying search results for: "{searchKeyword}"
		</Typography>
	)

	const isUserProfilePath = currentPath.split(' ')[0] === '/profile'
	const isSearchByNamePath = currentPath.split(' ')[0] === '/search/byname'
	const isSearcByIngredientPath = currentPath.split(' ')[0] === '/search/byingredient'
	const isSearchBySpiritsPath = currentPath.split(' ')[0] === '/search/byspirit'
	const isRootPath = currentPath.split(' ')[0] === '/'
	const renderSpiritsHeaderDropdown = isSearchBySpiritsPath
	const renderMobileHomePageHeader = isRootPath
	const renderSavedDrinksHeader = currentPath.split(' ')[0] === '/saveddrinks'
	const renderPopularDrinksHeader = currentPath.split(' ')[0] === '/search/popularcocktails'
	const renderNonAlcoholicDrinksHeader = currentPath.split(' ')[0] === '/search/nonalcoholic'

	const renderHeaderText = (textToRender: string): React.ReactElement => (
		<Typography sx={{fontFamily: primaryFont, marginLeft: '10px'}}>{textToRender}</Typography>
	)

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
					{isSearcByIngredientPath && <HeaderIngredientsDropDown />}
					{renderSpiritsHeaderDropdown && <HeaderSpiritsDropDown />}
					{isUserProfilePath && renderHeaderText('Profile')}
					{renderMobileHomePageHeader && renderHeaderText('Cocktail Explorer')}
					{renderSavedDrinksHeader && renderHeaderText('Saved Drinks')}
					{renderPopularDrinksHeader && renderHeaderText('Popular Cocktails')}
					{renderNonAlcoholicDrinksHeader && renderHeaderText('Non-Alcoholic')}
					<UserMenu />
				</Toolbar>
			</AppBar>
			{navBarOpen && (
				<React.Fragment>
					<Drawer
						open={navBarOpen}
						onClose={handleDrawerToggle}
						anchor="left"
						ModalProps={{
							keepMounted: true // Better open performance on mobile.
						}}
						sx={{
							'& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth}
						}}
					>
						{drawer}
					</Drawer>
				</React.Fragment>
			)}
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					width: '100%',
					height: '100%',
					padding: '0px',
					margin: '0px',
					overflow: 'hidden'
				}}
				className='bg-black md:bg-gradient-to-t from-[#434343] to-black md:bg-center md:bg-cover md:bg-no-repeat'
			>
				<Toolbar />
				<Outlet />
			</Box>
		</Box>
	)
}

export default SideBar
