import './styles.css'
import {FaAnglesRight} from 'react-icons/fa6'
import {primaryFont} from '../../fonts/fonts'
import {updateRenderNextSetOfDrinks} from '../../store'
import {useDispatch} from 'react-redux'

const MobileHomePageHeader = (): JSX.Element => {
	const dispatch = useDispatch()
	const handleOnClick = () => {
		dispatch(updateRenderNextSetOfDrinks(true))
	}

	return (
		<div className="mobileHomePageHeaderContainer">
			<h3 className="mobileHomePageHeaderLabel" style={{fontFamily: primaryFont}}>
				Cocktail Explorer
			</h3>
			<button
				onClick={handleOnClick}
				className="mobileHomePageHeaderBtn"
				style={{
					fontFamily: primaryFont
				}}
			>
				Next
				<FaAnglesRight style={{marginLeft: '5px'}} />
			</button>
		</div>
	)
}

export default MobileHomePageHeader
