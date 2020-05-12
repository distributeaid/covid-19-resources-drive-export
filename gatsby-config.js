require('ts-node').register({ files: true })
const fs = require('fs')
const path = require('path')

const pJSON = JSON.parse(
	fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8'),
)

const siteUrl = (process.env.SITE_URL || pJSON.homepage).replace(/\//g, '')

module.exports = {
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
		`gatsby-transformer-remark`,
		`gatsby-plugin-styled-components`,
		`gatsby-plugin-react-helmet`,
		`gatsby-plugin-react-svg`,
		{
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
		},
	],
}
