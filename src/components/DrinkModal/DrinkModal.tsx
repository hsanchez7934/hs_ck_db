import './styles.css'
import React from 'react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import {motion, useReducedMotion} from 'framer-motion'
import DrinkCard from '../DrinkCard/DrinkCard'
import {useNavigate} from 'react-router-dom'
import {useAppDispatch, useAppSelector} from '../../store/hooks'
import {updateIsModalOpen, updateModalDrink} from '../../store'
import {modalContentVariants} from '../../theme/motion'

const DrinkModal = (): JSX.Element => {
	const dispatch = useAppDispatch()
	const {isModalOpen, drink} = useAppSelector(({modalDrinkState}) => modalDrinkState)
	const navigate = useNavigate()
	const shouldReduceMotion = useReducedMotion()

	const handleClose = React.useCallback(() => {
		dispatch(updateIsModalOpen(false))
		dispatch(updateModalDrink(null))
		navigate(-1)
	}, [dispatch, navigate])

	const modalContent = (
		<Box className="drink-modal-content" id="drinkModalContainer">
			<DrinkCard drink={drink} handleClose={handleClose} />
		</Box>
	)

	return (
		<Modal
			open={isModalOpen}
			onClose={handleClose}
			slotProps={{
				backdrop: {
					style: {backgroundColor: 'var(--overlay)'}
				}
			}}
		>
			<Box className="drink-modal-overlay">
				{shouldReduceMotion ? (
					<Box className="drink-modal-wrapper">{modalContent}</Box>
				) : (
					<Box
						component={motion.div}
						className="drink-modal-wrapper"
						variants={modalContentVariants}
						initial="hidden"
						animate="visible"
						exit="exit"
					>
						{modalContent}
					</Box>
				)}
			</Box>
		</Modal>
	)
}

export default DrinkModal
