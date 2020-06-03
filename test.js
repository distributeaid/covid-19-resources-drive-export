const { cleanHTML } = require('./cleanHTML')
const fs = require('fs')
const prettier = require('prettier')

const html = fs.readFileSync(
	'export/COVID-19 Guides/COVID-19 & Aid Operations.html',
	'utf-8',
)

console.log(prettier.format(cleanHTML(html), { parser: 'html' }))
