import React from 'react'
import './styles.css'

type Props = {
	spirit: string
	isActiveTab: boolean
	setActiveTab: (spirit: string) => void
}

const SpiritTabs = ({spirit, isActiveTab, setActiveTab}: Props): JSX.Element => {
	return (
		<button
			type="button"
			className={`spirit-tab${isActiveTab ? ' spirit-tab-active' : ''}`}
			onClick={() => setActiveTab(spirit)}
			aria-pressed={isActiveTab}
			aria-label={`Browse ${spirit} cocktails`}
		>
			{spirit}
		</button>
	)
}

export default SpiritTabs
