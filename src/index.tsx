import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {Provider} from 'react-redux'
import {store} from './store'
import {BrowserRouter} from 'react-router-dom'
import {Auth0Provider} from '@auth0/auth0-react'

const element = document.getElementById('root') as HTMLElement
const root = ReactDOM.createRoot(element)
// const url = window.location.origin + '/saveddrinks'

root.render(
	<Auth0Provider
		domain={`${process.env.REACT_APP_AUTH0_DOMAIN}`}
		clientId={`${process.env.REACT_APP_AUTH0_CLIENTID}`}
		authorizationParams={{
		redirect_uri: `${window.location.origin}`
		}}
	>
		<React.StrictMode>
			<BrowserRouter>
				<Provider store={store}>
					<App />
				</Provider>
			</BrowserRouter>
		</React.StrictMode>
	</Auth0Provider>
)
