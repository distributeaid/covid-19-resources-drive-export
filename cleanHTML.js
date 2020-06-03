const JSDOM = require('jsdom').JSDOM

const removeTags = (tagName, window) => {
	const tags = window.document.getElementsByTagName(tagName)
	if (tags.length <= 0) return
	for (tag of tags) {
		tag.remove()
	}
	return removeTags(tagName, window)
}

module.exports = {
	cleanHTML: (source) => {
		const jsdom = new JSDOM(source)
		const { window } = jsdom
		// Remove headers, footers, and comments (they are in divs)
		removeTags('div', window)
		removeTags('sup', window) // Footnote links
		// Remove style tags
		removeTags('style', window)
		// Remove styling
		;[
			'body',
			'a',
			'span',
			'hr',
			'p',
			'ul',
			'li',
			'h1',
			'h2',
			'h3',
			'h4',
			'h5',
			'h6',
		].forEach((tag) => {
			const tags = window.document.getElementsByTagName(tag)
			;[].forEach.call(tags, (tag) => {
				tag.removeAttribute('style')
				tag.removeAttribute('class')
				tag.removeAttribute('id')
			})
		})
		let html = jsdom.serialize().replace(/(&nbsp;)+/g, ' ')
		html = jsdom.serialize().replace(/[\.…]{2,}/g, '') // Remove dot indentation
		html = html.replace(/<\/ul><ul>/g, '') // Merge directly adjacent ULs
		return html
	},
}
