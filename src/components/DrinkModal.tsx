import * as React from 'react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import DrinkCard from './DrinkCard'
import {useNavigate, useParams} from 'react-router-dom'
import {useAppDispatch, useAppSelector} from '../store/hooks'
import {updateIsModalOpen, updateModalDrink} from '../store'

const style = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '70%',
  height: '80%',
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 0
}

const DrinkModal = (): JSX.Element => {
	const dispatch = useAppDispatch()
	const {isModalOpen, drink} = useAppSelector(({modalDrink}) => modalDrink)
	console.log(drink)
	let navigate = useNavigate()
	let {id} = useParams<'id'>()

	const handleClose = () => {
		dispatch(updateIsModalOpen(false))
		dispatch(updateModalDrink(null))
	}

	return (
		<div>
			<Modal
				open={isModalOpen}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}><DrinkCard drink={drink} /></Box>
			</Modal>
		</div>
	)
}

export default DrinkModal