import './styles.css'
import React, {useEffect, useState} from 'react'
import {primaryFont} from '../../fonts/fonts'
import {Button} from '@mui/material'
import {FaPencil, FaRegTrashCan, FaCheck} from 'react-icons/fa6'
import generateUUID from '../../uuid'

interface CreateFormIngredientProps {
	ingredients: string[]
	index: number
	handleRemoveIngredient: (index: number) => void
	handleDoneAction: (index: number, data: {ingredient: string; amount: string}) => void
	propAmount: string
	propIngredient: string
}

const CreateFormIngredient = (props: CreateFormIngredientProps) => {
	const {ingredients, index, handleRemoveIngredient, handleDoneAction, propAmount, propIngredient} =
		props

	const [selectedIngredient, setSelectedIngredient] = useState('')
	const [amount, setAmount] = useState('')
	const [isFormDisabled, setIsFormDisabled] = useState(true)

	const [renderIngredientValidationMessage, setRenderIngredientValidationMessage] = useState(false)
	const [renderAmountValidationMessage, setRenderAmountValidationMessage] = useState(false)

	useEffect(() => {
		setSelectedIngredient(propIngredient)
		setAmount(propAmount)
	}, [propAmount, propIngredient])

	const labelStyles = {
		fontFamily: primaryFont,
		color: '#fff',
		fontSize: '1.5em',
		display: 'block'
	}
	const inputStyles = {
		fontFamily: primaryFont,
		backgroundColor: 'inherit'
	}
	const selectStyles = {
		fontFamily: primaryFont,
		backgroundColor: 'inherit',
		color: 'white',
		fontSize: '1.5em',
		display: 'block',
		width: '100%',
		height: '50px',
		border: '1px solid white'
	}

	const handleSelectOnChange = (value: string) => {
		setSelectedIngredient(value)
		if (value !== 'Select an ingredient...' && value !== '') {
			setRenderIngredientValidationMessage(false)
		} else {
			setRenderIngredientValidationMessage(true)
		}
	}

	const handleInputOnInput = (value: string) => {
		setAmount(value)
		if (value) {
			setRenderAmountValidationMessage(false)
		} else {
			setRenderAmountValidationMessage(true)
		}
	}

	const handleEditBtn = () => {
		setIsFormDisabled(false)
	}

	const handleDoneBtn = () => {
		const condition1 = amount !== ''
		const condition2 = selectedIngredient !== 'Select an ingredient...' && selectedIngredient !== ''
		if (condition1 && condition2) {
			setIsFormDisabled(true)
			const data = {
				ingredient: selectedIngredient,
				amount: amount
			}
			handleDoneAction(index, data)
		} else {
			if (!condition1) {
				setRenderAmountValidationMessage(true)
			}
			if (!condition2) {
				setRenderIngredientValidationMessage(true)
			}
		}
	}

	const handleDeleteOnClick = () => {
		handleRemoveIngredient(index)
	}

	const renderedEditDoneBtn = () => {
		if (isFormDisabled) {
			return (
				<Button
					sx={{
						color: 'white',
						fontSize: '18px',
						border: '1px solid darkgray',
						margin: '5px 10px 0 5px'
					}}
					onClick={() => handleEditBtn()}
				>
					Edit
					<FaPencil style={{marginLeft: '5px'}} />
				</Button>
			)
		} else {
			return (
				<Button
					sx={{
						color: 'white',
						fontSize: '18px',
						border: '1px solid darkgray',
						margin: '5px 10px 0 5px'
					}}
					onClick={() => handleDoneBtn()}
				>
					Save
					<FaCheck style={{marginLeft: '5px'}} />
				</Button>
			)
		}
	}

	const ingredientValidationMessage = () => {
		return renderIngredientValidationMessage ? (
			<p style={{color: 'red', fontSize: '1em', margin: '5px 0px'}}>
				This field is required, please select an ingredient.
			</p>
		) : (
			<></>
		)
	}

	const amountValidationMessage = () => {
		return renderAmountValidationMessage ? (
			<p style={{color: 'red', fontSize: '1em', margin: '5px 0px'}}>
				This field is required, please enter an amount.
			</p>
		) : (
			<></>
		)
	}

	const getSelectedDefaultIngredient = () => {
		if (selectedIngredient === '') {
			return 'Select an ingredient...'
		}
		return selectedIngredient
	}

	return (
		<div style={{marginBottom: '20px'}} id={generateUUID()}>
			<div style={{display: 'flex', justifyContent: 'space-evenly', backgroundColor: 'inherit'}}>
				<label style={{...labelStyles, width: '35%'}}>Ingredient</label>
				<label style={{...labelStyles, width: '35%'}}>Amount</label>
				<div style={{width: '20%'}}></div>
			</div>
			<div style={{display: 'flex', backgroundColor: 'inherit', justifyContent: 'space-evenly'}}>
				<select
					className="create-form-select"
					style={{...selectStyles, width: '35%', backgroundColor: '#000'}}
					onChange={(event) => handleSelectOnChange(event.target.value)}
					disabled={isFormDisabled}
					value={getSelectedDefaultIngredient()}
				>
					{ingredients.map((ingredient: string) => {
						return (
							<option key={ingredient} value={ingredient}>
								{ingredient}
							</option>
						)
					})}
				</select>
				<input
					value={amount}
					// @ts-expect-error generic
					onInput={(event) => handleInputOnInput(event.target?.value)}
					className="create-form-input"
					style={{...inputStyles, width: '35%'}}
					type="text"
					placeholder="Enter amount..."
					disabled={isFormDisabled}
				/>
				<div style={{width: '20%'}}>
					{renderedEditDoneBtn()}
					{index > 0 && (
						<Button
							sx={{
								color: 'white',
								fontSize: '18px',
								border: '1px solid darkgray',
								margin: '5px 0 0 5px'
							}}
							onClick={() => handleDeleteOnClick()}
						>
							Delete
							<FaRegTrashCan style={{marginLeft: '5px'}} />
						</Button>
					)}
				</div>
			</div>
			<div style={{display: 'flex', justifyContent: 'space-evenly'}}>
				<div style={{width: '35%'}}>{ingredientValidationMessage()}</div>
				<div style={{width: '35%'}}>{amountValidationMessage()}</div>
				<div style={{width: '20%'}}></div>
			</div>
		</div>
	)
}

export default CreateFormIngredient
