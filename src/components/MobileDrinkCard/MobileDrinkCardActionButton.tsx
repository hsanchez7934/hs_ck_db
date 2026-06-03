import React from 'react'

type Props = {
	label: string
	onClick?: () => void
	disabled?: boolean
	active?: boolean
	children: React.ReactNode
}

const MobileDrinkCardActionButton = ({
	label,
	onClick,
	disabled = false,
	active = false,
	children
}: Props): JSX.Element => {
	return (
		<button
			type="button"
			className={`mobile-drink-card-action-btn${active ? ' mobile-drink-card-action-btn--active' : ''}${disabled ? ' mobile-drink-card-action-btn--disabled' : ''}`}
			onClick={onClick}
			disabled={disabled}
			aria-label={label}
			title={label}
		>
			{children}
		</button>
	)
}

export default MobileDrinkCardActionButton
