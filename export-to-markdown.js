const fs = require('fs')
const path = require('path')
const { google } = require('googleapis')
const { cleanHTML } = require('./cleanHTML')
const exec = require('child_process').exec
const prettier = require('prettier')
const sanitize = require('sanitize-filename')
const Bottleneck = require('bottleneck')

const baseFolder = '1FpnENOl1oZXLzmvvIqrR3kJgPNsGaDTo'
const exportDir = [process.cwd(), 'export']
const limiter = new Bottleneck({
	minTime: 110,
})

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
					q: `"${parentFolder}" in parents and (mimeType = 'application/vnd.google-apps.folder' or mimeType = 'application/vnd.google-apps.document')`,
					pageSize: 100,
					fields: 'nextPageToken, files(id, name, mimeType)',
				}),
			)
			.then((res) => {
				const files = res.data.files
				if (!files.length) return resolve()
				return Promise.all(
					files.map(async (file) => {
						if (file.mimeType === 'application/vnd.google-apps.document') {
							await exportFile(file.id, file.name, parents, auth)
						}
						if (file.mimeType === 'application/vnd.google-apps.folder') {
							await listFiles(file.id, [...parents, file.name.trim()])(auth)
						}
					}),
				)
			})
			.catch((err) => reject('Could not list files: ' + err))
	})

const exportFile = async (fileId, name, parents, auth) => {
	const drive = google.drive({ version: 'v3', auth })
	const folder = path.join(...exportDir, ...parents.map(sanitize))
	const outFile = path.join(folder, `${sanitize(name)}.md`)
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
							'pandoc -f html -t markdown_strict --columns=1000',
							(err, res) => {
								if (err) return reject(err)
								resolve(res)
							},
						)
						e.stdin.write(cleanHTML(res.data))
						e.stdin.end()
					}),
			)
			.then((markdown) => prettier.format(markdown, { parser: 'markdown' }))
			.then((markdown) => fs.promises.writeFile(outFile, markdown))
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
