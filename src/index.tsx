import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {Provider} from 'react-redux'
import {store} from './store'
import {BrowserRouter} from 'react-router-dom'

const element = document.getElementById('root') as HTMLElement
const root = ReactDOM.createRoot(element)

root.render(
	<React.StrictMode>
		<BrowserRouter>
			<Provider store={store}>
				<App />
			</Provider>
		</BrowserRouter>
	</React.StrictMode>
)
