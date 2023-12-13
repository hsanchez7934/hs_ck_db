const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
require('dotenv').config()

const requireHTTPS = (request, response, next) => {
	// eslint-disable-next-line
	if (request.header('x-forwarded-proto') != 'https') {
		return response.redirect(`https://${request.header('host')}${request.url}`)
	}
	return next()
}

if (process.env.NODE_ENV === 'production') {
	app.use(requireHTTPS)
}

app.set('port', process.env.PORT || 3000)
app.use(express.static(__dirname + '/build'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.locals.title = 'Cocktail DB'

app.listen(app.get('port'), () => {
	console.log(`${app.locals.title} is running on ${app.get('port')}.`)
})

app.get('/*', function (req, res) {
	res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

module.exports = app
