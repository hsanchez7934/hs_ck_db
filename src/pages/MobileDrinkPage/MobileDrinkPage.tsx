import React, { ReactElement } from 'react'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'

const MobileDrinkPage = (): ReactElement => {
	const content = <LoadingSpinner />
	return <div style={{overflow: 'auto', height: 'calc(100% - 64px)', backgroundColor: 'pink'}}>{content}</div>
}

export default MobileDrinkPage
