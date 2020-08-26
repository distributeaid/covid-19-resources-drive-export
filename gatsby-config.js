require('ts-node').register({ files: true })
const fs = require('fs')
const path = require('path')

const pJSON = JSON.parse(
	fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8'),
)

let indexedChecksum = ''
let exportChecksum = ''
try {
	indexedChecksum = fs.readFileSync(
		path.join(process.cwd(), '.algolia', '.export.indexed.checksum'),
		'utf-8',
	)
} catch {}
try {
	exportChecksum = fs.readFileSync(
		path.join(process.cwd(), '.algolia', '.export.checksum'),
		'utf-8',
	)
} catch {}

const siteUrl = (process.env.SITE_URL || pJSON.homepage).replace(/\//g, '')

const cfg = {
	pathPrefix: process.env.SITE_DIR,
	siteMetadata: {
		title: `Distribute Aid's COVID-19 Aid Workers Guide`,
		shortTitle: `COVID-19 Aid Workers Guide`,
		siteUrl,
		description: `An Aid-Worker’s guide to COVID-19, Community Organising & Care handbooks and resources.`,
	},
	plugins: [
		`gatsby-plugin-typescript`,
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				name: `pages`,
				path: path.join(process.cwd(), 'static'),
			},
		},
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				name: `guide`,
				path: path.join(process.cwd(), 'export'),
				ignore: [`**/.git/**`], // ignore files starting with a dot
			},
		},
		{
			resolve: `gatsby-transformer-remark`,
			options: {
				plugins: [`gatsby-remark-autolink-headers`],
			},
		},
		`gatsby-plugin-styled-components`,
		`gatsby-plugin-react-helmet`,
		`gatsby-plugin-react-svg`,
	],
}

if (
	(process.env.ALGOLIA_DISABLE_INDEX ?? '0' === '1') ||
	process.env.GATSBY_ALGOLIA_APP_ID === undefined ||
	process.env.ALGOLIA_ADMIN_KEY === undefined
) {
	console.debug('Skipping Algolia Index')
} else {
	const indexWithAlgolia = () => {
		cfg.plugins.push({
			resolve: `gatsby-plugin-algolia`,
			options: {
				appId: process.env.GATSBY_ALGOLIA_APP_ID,
				apiKey: process.env.ALGOLIA_ADMIN_KEY,
				queries: [
					{
						query: `{
						pages: allMarkdownRemark {
						  edges {
							node {
							  frontmatter {
								title
								objectID: driveId
							  }
							  excerpt(pruneLength: 5000)
							}
						  }
						}
					  }`,
						transformer: ({
							data: {
								pages: { edges },
							},
						}) =>
							edges
								.map(({ node: { frontmatter, ...rest } }) => ({
									...rest,
									...frontmatter,
								}))
								.filter(({ objectID }) => objectID !== null),
						indexName: `Pages`,
						settings: { attributesToSnippet: [`excerpt:20`] },
					},
				],
				chunkSize: 10000,
			},
		})
		console.log(
			`[Algolia] Writing ${exportChecksum} to ${path.join(
				process.cwd(),
				'.export.indexed.checksum',
			)}.`,
		)
		fs.writeFileSync(
			path.join(process.cwd(), '.algolia', '.export.indexed.checksum'),
			exportChecksum,
			'utf-8',
		)
	}
	if (!indexedChecksum.length) {
		console.log('[Algolia] Index has not yet been created, indexing.')
		indexWithAlgolia()
	} else if (indexedChecksum !== exportChecksum) {
		console.log(
			`[Algolia] Indexed checksum ${indexedChecksum} does not match export checksum ${exportChecksum}, indexing.`,
		)
		indexWithAlgolia()
	} else {
		console.log(
			`[Algolia] Indexed checksum ${indexedChecksum} matches export checksum ${exportChecksum}, skipping index.`,
		)
	}
}

module.exports = cfg
