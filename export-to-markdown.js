const fs = require('fs')
const path = require('path')
const { google } = require('googleapis')
const { cleanHTML } = require('./cleanHTML')
const exec = require('child_process').exec
const prettier = require('prettier')
const sanitize = require('sanitize-filename')
const Bottleneck = require('bottleneck')

const baseFolder =
	process.env.GOOGLE_DRIVE_ID || '1FpnENOl1oZXLzmvvIqrR3kJgPNsGaDTo'
const exportDir = [process.cwd(), 'export']
const limiter = new Bottleneck({
	minTime: 110,
})

const supportedMimeTypes = [
	'application/vnd.google-apps.document',
	'application/vnd.google-apps.folder',
	'application/pdf',
	'video/mp4',
]

/**
 * Lists the names and IDs of up to 100 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
const listFiles = (parentFolder, parents = []) => async (auth) =>
	new Promise((resolve, reject) => {
		const drive = google.drive({ version: 'v3', auth })
		limiter
			.schedule(() =>
				drive.files.list({
					q: `"${parentFolder}" in parents and (${supportedMimeTypes
						.map((type) => `mimeType = '${type}'`)
						.join(' or ')})`,
					pageSize: 100,
					fields: 'nextPageToken, files(id, name, mimeType, webViewLink)',
				}),
			)
			.then((res) => {
				const files = res.data.files
				if (!files.length) return resolve()
				return Promise.all(
					files.map(async (file) => {
						if (file.mimeType === 'application/vnd.google-apps.document') {
							await exportFile(file.id, file.name, file.mimeType, parents, auth)
						} else if (file.mimeType === 'application/vnd.google-apps.folder') {
							await listFiles(file.id, [...parents, file.name.trim()])(auth)
						} else {
							await exportFileLink(
								file.id,
								file.name,
								file.mimeType,
								parents,
								file.webViewLink,
							)
						}
					}),
				)
			})
			.catch((err) => reject('Could not list files: ' + err))
	})

const exportFileLink = async (
	fileId,
	title,
	mimeType,
	parents,
	downloadUrl,
) => {
	const folder = path.join(...exportDir, ...parents.map(sanitize))
	const outFile = path.join(folder, `${sanitize(title)}.md`)
	await fs.promises.mkdir(folder, { recursive: true })
	await fs.promises.writeFile(
		outFile,
		[
			'---',
			`title: "${title}"`,
			`driveId: ${fileId}`,
			`mimeType: ${mimeType}`,
			`url: ${downloadUrl}`,
			'---',
			'',
			`# ${title}`,
			'',
			`[Click here](${downloadUrl}) to download the file.`,
		].join('\n'),
	)
	console.log(outFile, 'written')
}

const exportFile = async (fileId, title, mimeType, parents, auth) => {
	const drive = google.drive({ version: 'v3', auth })
	const folder = path.join(...exportDir, ...parents.map(sanitize))
	const outFile = path.join(folder, `${sanitize(title)}.md`)
	fs.mkdirSync(folder, { recursive: true })
	await new Promise((resolve, reject) => {
		limiter
			.schedule(() =>
				drive.files.export({
					fileId,
					mimeType: 'text/html',
				}),
			)
			.then(
				(res) =>
					new Promise((resolve, reject) => {
						const e = exec(
							'pandoc -f html-native_divs-native_spans -t commonmark-raw_html --columns=1000',
							(err, res) => {
								if (err) return reject(err)
								resolve(res)
							},
						)
						e.stdin.write(cleanHTML(res.data))
						e.stdin.end()
					}),
			)
			// Replace Table of Content links
			.then((markdown) =>
				markdown
					.split('\n')
					.map((s) =>
						s.replace(
							/^\[[^\]]+\]\(#h\.[a-z0-9]+\)\s+\[[0-9]+\]\(#h\.[a-z0-9]+\)/,
							'',
						),
					)
					.join('\n')
					.replace(/\n{3,}/g, '\n\n'),
			)
			.then((markdown) => prettier.format(markdown, { parser: 'markdown' }))
			.then((markdown) =>
				fs.promises.writeFile(
					outFile,
					[
						'---',
						`title: "${title}"`,
						`driveId: ${fileId}`,
						`mimeType: ${mimeType}`,
						'---',
						'',
						markdown,
					].join('\n'),
				),
			)
			.then(() => {
				console.log(outFile, 'written')
				resolve(outFile)
			})
			.catch((err) => reject('Could not export files: ' + err))
	})
}

const main = async () => {
	const auth = new google.auth.GoogleAuth({
		keyFile: path.join(__dirname, 'jwt.keys.json'),
		scopes: 'https://www.googleapis.com/auth/drive.readonly',
	})
	const client = await auth.getClient()

	await listFiles(baseFolder)(client)
}

main().catch((err) => {
	console.error(err)
	process.exit(1)
})
