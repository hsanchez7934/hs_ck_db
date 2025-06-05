import './styles.css'
import React from 'react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import DrinkCard from '../DrinkCard/DrinkCard'
import {useNavigate} from 'react-router-dom'
import {useAppDispatch, useAppSelector} from '../../store/hooks'
import {updateIsModalOpen, updateModalDrink} from '../../store'

const style = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)'
}

const DrinkModal = (): JSX.Element => {
	const dispatch = useAppDispatch()
	const {isModalOpen, drink} = useAppSelector(({modalDrinkState}) => modalDrinkState)
	const navigate = useNavigate()

	const handleClose = () => {
		dispatch(updateIsModalOpen(false))
		dispatch(updateModalDrink(null))
		navigate(-1)
	}

	return (
		<div>
			<Modal
				open={isModalOpen}
				onClose={handleClose}
			>
				<Box sx={style} id="drinkModalContainer">
					<DrinkCard drink={drink} />
				</Box>
			</Modal>
		</div>
	)
}

export default DrinkModal
