import './styles.css'
import React, {useEffect, useState} from 'react'
import {Button} from '@mui/material'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import {primaryFont} from '../../fonts/fonts'
import {useAppSelector, useAppDispatch} from '../../store/hooks'
import {useAuth0} from '@auth0/auth0-react'
import axios from 'axios'
import CreateFormIngredient from '../../components/CreateFormIngredient/CreateFormIngredient'
import SimpleDialog from '../../components/SimpleDialog/SimpleDialog'

import {FaPlus, FaCheck} from 'react-icons/fa6'
import {has} from 'lodash'

const fetchCategorySelectItems = (): Promise<any | null> =>
	axios
		.get(
			`${process.env.REACT_APP_CK_DB_BASE_URL}${process.env.REACT_APP_CK_DB_KEY}/list.php?c=list`
		)
		.then((response) => {
			return response.data.drinks
		})
		.catch((error) => {
			throw error
		})

const fetchGlassTypeSelectItems = () => {
	return axios
		.get(
			`${process.env.REACT_APP_CK_DB_BASE_URL}${process.env.REACT_APP_CK_DB_KEY}/list.php?g=list`
		)
		.then((response) => response.data.drinks)
		.catch((error) => {
			throw error
		})
}

const fetchDrinkTypeSelectItems = () => {
	return axios
		.get(
			`${process.env.REACT_APP_CK_DB_BASE_URL}${process.env.REACT_APP_CK_DB_KEY}/list.php?a=list`
		)
		.then((response) => response.data.drinks)
		.catch((error) => {
			throw error
		})
}

const fetchIngredientsFullList = () => {
	return axios
		.get(
			`${process.env.REACT_APP_CK_DB_BASE_URL}${process.env.REACT_APP_CK_DB_KEY}/list.php?i=list`
		)
		.then((response) => response.data.drinks)
		.catch((error) => {
			throw error
		})
}

const CreateDrinkPage = () => {
	const {loginWithPopup} = useAuth0()
	const {user, isAuthenticated, isLoading} = useAuth0()

	const [drinkNameValue, setDrinkNameValue] = useState('')

	const [categorySelectItems, setCategorySelectItems] = useState([])
	const [selectedCategoryValue, setSelectedCategoryValue] = useState('')

	const [glassTypeSelectItems, setGlassTypeSelectItems] = useState([])
	const [selectedGlassTypeValue, setSelectedGlassTypeValue] = useState('')

	const [drinkTypeSelectItems, setDrinkTypeSelectItems] = useState([])
	const [selectedDrinkTypeValue, setSelectedDrinkTypeValue] = useState('')

	const [ingredients, setIngredients] = useState([])
	const [ingredientsNodeList, setIngredientsNodeList] = useState([])

	const [drinkInstructionsValue, setDrinkInstructionsValue] = useState('')

	const [openValidationDialog, setOpenValidationDialog] = useState(false)
	const [addValidationDialogText, setAddValidationDialogText] = useState('')
	const [addValidationDialogTextColor, setAddValidationDialogTextColor] = useState('')

	useEffect(() => {
		fetchCategorySelectItems().then((response) => {
			const selectItems = response.map(({strCategory}: {strCategory: string}) => {
				return strCategory
			})
			setCategorySelectItems(selectItems.sort())
			setSelectedCategoryValue(selectItems[0])
		})
		fetchGlassTypeSelectItems().then((response) => {
			const selectItems = response.map(({strGlass}: {strGlass: string}) => {
				return strGlass
			})
			setGlassTypeSelectItems(selectItems.sort())
			setSelectedGlassTypeValue(selectItems[0])
		})
		fetchDrinkTypeSelectItems().then((response) => {
			const selectedItems = response.map(({strAlcoholic}: {strAlcoholic: string}) => {
				return strAlcoholic
			})
			setDrinkTypeSelectItems(selectedItems.sort())
			setSelectedDrinkTypeValue(selectedItems[0])
		})
		fetchIngredientsFullList().then((response) => {
			const ingredients = response.map(({strIngredient1}: {strIngredient1: string}) => {
				return strIngredient1
			})
			const sorted = ingredients.sort()
			sorted.unshift('Select an ingredient...')
			setIngredients(sorted)
			setIngredientsNodeList([
				// @ts-expect-error generic
				{
					amount: '',
					ingredient: ''
				}
			])
		})
	}, [])

	const handleLogin = async () => {
		loginWithPopup()
	}

	const toggleDialog = (color: string, text: string) => {
		setAddValidationDialogTextColor(color)
		setAddValidationDialogText(text)
		setOpenValidationDialog(true)
		setTimeout(() => {
			setOpenValidationDialog(false)
		}, 3000)
	}

	const handleRemoveIngredient = (index: number) => {
		const copy = [...ingredientsNodeList]
		const filtered = copy.filter((node, idx) => idx !== index)
		setIngredientsNodeList(filtered)
	}

	const handleAddIngredient = () => {
		const newNodeList = [...ingredientsNodeList]
		const {length} = newNodeList
		const node: {amount: string; ingredient: string} = newNodeList[length - 1]
		if (!node?.amount || !node?.ingredient) {
			toggleDialog(
				'red',
				'Select an ingredient and enter an amount to continue adding ingredients.'
			)
			return
		}
		// @ts-expect-error generic
		newNodeList.push({
			amount: '',
			ingredient: ''
		})
		setIngredientsNodeList(newNodeList)
	}

	const handleDoneAction = (index: number, data: {ingredient: string; amount: string}) => {
		const newNodeList = [...ingredientsNodeList]
		// @ts-expect-error generic
		newNodeList[index] = data
		setIngredientsNodeList(newNodeList)
	}

	const handleOnSubmit = () => {
		if (drinkNameValue === '') {
			toggleDialog('red', 'Please enter a name for your drink.')
			return
		}
		let hasIngredients = true
		ingredientsNodeList.forEach((node: {amount: string; ingredient: string}) => {
			if (!node?.amount || !node?.ingredient) {
				hasIngredients = false
			}
		})
		if (!hasIngredients) {
			toggleDialog('red', 'Ingredient information is missing, please review ingredients.')
			return
		}
		if (drinkInstructionsValue === '') {
			toggleDialog('red', 'Please enter instructions for your drink.')
			return
		}

		const drinkDataPoint = {
			strDrink: drinkNameValue,
			strCategory: selectedCategoryValue,
			strGlass: selectedGlassTypeValue,
			strAlcoholic: selectedDrinkTypeValue,
			strInstructions: drinkInstructionsValue,
		}
		ingredientsNodeList.forEach((node: {amount: string; ingredient: string}, idx: number) => {
			// @ts-expect-error generic
			drinkDataPoint[`strIngredient${idx + 1}`] = node?.ingredient
			// @ts-expect-error generic
			drinkDataPoint[`strMeasure${idx + 1}`] = node?.amount
		})
		console.log(drinkDataPoint)
	}

	const renderedIngredientsFormList = () => {
		return ingredientsNodeList.map((node, index) => {
			return (
				<CreateFormIngredient
					key={index}
					index={index}
					handleRemoveIngredient={(index: number) => handleRemoveIngredient(index)}
					handleDoneAction={(index: number, data: {ingredient: string; amount: string}) =>
						handleDoneAction(index, data)
					}
					ingredients={ingredients}
					// @ts-expect-error generic
					propIngredient={node?.ingredient}
					// @ts-expect-error generic
					propAmount={node?.amount}
				/>
			)
		})
	}

	const renderLoginNotice = () => {
		return (
			<div
				style={{
					height: '100%',
					width: '100%',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: '#000',
					flexDirection: 'column'
				}}
			>
				<p
					style={{
						fontSize: '1.8em',
						color: '#fff',
						textAlign: 'center',
						padding: '0px 10px',
						fontFamily: primaryFont
					}}
				>
					You must be signed in to be able to create drinks. Click the button below to sign in.
				</p>
				<button
					id="btn_loginFromSavedDrinksPage"
					onClick={() => handleLogin()}
					style={{fontFamily: primaryFont}}
				>
					Sign In
				</button>
			</div>
		)
	}

	const renderDrinkNameValidationMessage = () => {
		if (drinkNameValue === '') {
			return (
				<p style={{color: 'red', fontSize: '1em', margin: '5px 0px'}}>
					This field is required, please enter a name.
				</p>
			)
		} else {
			return <></>
		}
	}

	const renderDrinkInstructionsValidationMessage = () => {
		if (drinkInstructionsValue === '') {
			return (
				<p style={{color: 'red', fontSize: '1em', margin: '5px 0px'}}>
					This field is required, please enter instructions.
				</p>
			)
		} else {
			return <></>
		}
	}

	const renderedForm = () => {
		const labelStyles = {
			fontFamily: primaryFont,
			color: '#fff',
			fontSize: '2em',
			display: 'block'
		}
		const inputStyles = {
			fontFamily: primaryFont,
			padding: '5px'
		}
		const selectStyles = {
			fontFamily: primaryFont,
			backgroundColor: 'inherit',
			color: 'white',
			fontSize: '1.6em',
			display: 'block',
			width: '100%',
			height: '50px',
			border: '1px solid white'
		}

		return (
			<form style={{backgroundColor: '#000', height: '100%', padding: '30px', overflow: 'auto'}}>
				<div className="create-form-section" style={{marginTop: '0px'}}>
					<label style={labelStyles} htmlFor="drinkName">
						Drink Name:
					</label>
					<input
						className="create-form-input"
						type="text"
						value={drinkNameValue}
						onChange={(event) => setDrinkNameValue(event.target.value)}
						style={inputStyles}
						placeholder="Enter drink name here..."
						id="drinkName"
					/>
					{renderDrinkNameValidationMessage()}
				</div>

				<div className="create-form-section">
					<label style={labelStyles} htmlFor="drinkCategory">
						Category:
					</label>
					<select
						className="create-form-select"
						style={selectStyles}
						onChange={(event) => setSelectedCategoryValue(event.target.value)}
						id="drinkCategory"
						value={selectedCategoryValue}
					>
						{categorySelectItems.map((category) => {
							return (
								<option key={category} value={category}>
									{category}
								</option>
							)
						})}
					</select>
				</div>

				<div className="create-form-section">
					<label style={labelStyles} htmlFor="drinkGlassType">
						Glass Type:
					</label>
					<select
						className="create-form-select"
						style={selectStyles}
						onChange={(event) => setSelectedGlassTypeValue(event.target.value)}
						id="drinkGlassType"
						value={selectedGlassTypeValue}
					>
						{glassTypeSelectItems.map((glassType) => {
							return (
								<option key={glassType} value={glassType}>
									{glassType}
								</option>
							)
						})}
					</select>
				</div>

				<div className="create-form-section">
					<label style={labelStyles} htmlFor="drinkType">
						Drink Type:
					</label>
					<select
						className="create-form-select"
						style={selectStyles}
						onChange={(event) => setSelectedDrinkTypeValue(event.target.value)}
						id="drinkType"
						value={selectedDrinkTypeValue}
					>
						{drinkTypeSelectItems.map((drinkType) => {
							return (
								<option key={drinkType} value={drinkType}>
									{drinkType}
								</option>
							)
						})}
					</select>
				</div>

				<div className="create-form-section">
					<label style={labelStyles}>Ingredients:</label>
					<div style={{border: '1px solid white', padding: '20px 0', backgroundColor: 'inherit'}}>
						{renderedIngredientsFormList()}
						<div
							style={{padding: '10px 0 0px 0px', display: 'flex', justifyContent: 'space-evenly'}}
						>
							<div style={{width: '35%'}}>
								<Button
									sx={{
										color: 'white',
										fontSize: '18px',
										border: '1px solid darkgray',
										margin: '0'
									}}
									onClick={() => handleAddIngredient()}
								>
									Add Ingredient
									<FaPlus style={{marginLeft: '5px'}} />
								</Button>
							</div>
							<div style={{width: '35%'}}></div>
							<div style={{width: '20%'}}></div>
						</div>
					</div>
				</div>

				<div className="create-form-section">
					<label style={labelStyles} htmlFor="drinkInstructions">
						Instructions:
					</label>
					<textarea
						className="create-form-textarea"
						placeholder="Enter instructions here..."
						style={inputStyles}
						id="drinkInstructions"
						// @ts-expect-error generic
						onInput={(event) => setDrinkInstructionsValue(event.target.value)}
						value={drinkInstructionsValue}
					></textarea>
					{renderDrinkInstructionsValidationMessage()}
				</div>

				<div className="create-form-section">
					<div
						style={{width: '90%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
					>
						<Button
							sx={{
								color: 'white',
								fontSize: '24px',
								border: '1px solid darkgray',
								margin: '5px 0 0 5px'
							}}
							onClick={() => handleOnSubmit()}
						>
							Submit
							<FaCheck style={{marginLeft: '5px'}} />
						</Button>
					</div>
				</div>
			</form>
		)
	}

	const renderedCreateContent = (content: any) => {
		content = renderedForm()
		return (
			<div style={{height: '100%'}}>
				<div
					style={{
						height: '70px',
						backgroundColor: '#000',
						borderTop: '1px solid darkgray',
						borderBottom: '1px solid darkgray'
					}}
				>
					<Button
						sx={{color: 'white', fontSize: '18px', border: '1px solid white'}}
					>
						Add Drink
						<FaPlus style={{marginLeft: '5px'}} />
					</Button>
				</div>
				<div style={{height: 'calc(100% - 70px)', overflow: 'auto'}}>{content}</div>
			</div>
		)
	}

	let content = <LoadingSpinner />
	if (isLoading) {
		content = <LoadingSpinner />
	} else if (!isAuthenticated) {
		content = renderLoginNotice()
	} else {
		content = renderedCreateContent(<></>)
	}

	return (
		<div style={{overflow: 'hidden', height: 'calc(100% - 64px)'}}>
			{content}
			<SimpleDialog
				open={openValidationDialog}
				dialogTextColor={addValidationDialogTextColor}
				dialogText={addValidationDialogText}
				isLoginDialog={false}
			/>
		</div>
	)
}

export default CreateDrinkPage
