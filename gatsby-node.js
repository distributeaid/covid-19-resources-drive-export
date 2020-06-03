require('ts-node').register({ files: true })
const path = require('path')

const slugify = (str) =>
	str
		.trim()
		.replace(/ /g, '-')
		.replace(/[^A-Z0-9-]/gi, '')
		.replace(/-{2,}/g, '-')

const renderStaticPage = async (
	name,
	pagePath,
	guidePageData,
	createPage,
	graphql,
) => {
	const indexPage = await graphql(`
	query IndexPageQuery {
		allFile(
			filter: { sourceInstanceName: { eq: "pages" }, name: { eq: "${name}" } }
		) {
			edges {
				node {
					childMarkdownRemark {
						htmlAst
						headings {
							id
							depth
							value
						}
					}
				}
			}
		}
	}
`)

	if (indexPage.errors) {
		throw indexPage.errors
	}
	// Render index page
	await Promise.all(
		indexPage.data.allFile.edges.map(({ node: { childMarkdownRemark } }) =>
			createPage({
				path: pagePath,
				component: path.join(process.cwd(), 'src', 'templates', 'page.tsx'),
				context: {
					page: {
						remark: childMarkdownRemark,
					},
					guidePages: guidePageData,
				},
			}),
		),
	)
}

exports.createPages = ({ graphql, actions: { createPage } }) =>
	graphql(`
		query GuidePagesQuery {
			allFile(filter: { sourceInstanceName: { eq: "guide" } }) {
				edges {
					node {
						id
						fields {
							slug
						}
						name
						relativeDirectory
						childMarkdownRemark {
							headings {
								id
								depth
								value
							}
							htmlAst
							frontmatter {
								driveId
								modifiedTime
								title
								url
								mimeType
							}
						}
					}
				}
			}
		}
	`).then(async (guidePages) => {
		if (guidePages.errors) {
			throw guidePages.errors
		}

		const guidePageData = guidePages.data.allFile.edges.map(
			({
				node: {
					id,
					name,
					relativeDirectory,
					childMarkdownRemark,
					fields: { slug },
				},
			}) => ({
				id,
				name,
				folder: relativeDirectory?.split('/') ?? [],
				slug,
				driveId: childMarkdownRemark?.frontmatter?.driveId,
				modifiedTime: childMarkdownRemark?.frontmatter?.modifiedTime,
				title: childMarkdownRemark?.frontmatter?.title,
				url: childMarkdownRemark?.frontmatter?.url,
				mimeType: childMarkdownRemark?.frontmatter?.mimeType,
				remark: childMarkdownRemark,
			}),
		)

		await renderStaticPage('README', '/', guidePageData, createPage, graphql)
		await renderStaticPage(
			'PrivacyPolicy',
			'/PrivacyPolicy',
			guidePageData,
			createPage,
			graphql,
		)

		// Render guide pages
		await Promise.all(
			guidePages.data.allFile.edges.map(({ node: { id, fields: { slug } } }) =>
				createPage({
					path: slug,
					component: path.join(process.cwd(), 'src', 'templates', 'page.tsx'),
					context: {
						page: guidePageData.find(({ id: pId }) => pId === id),
						guidePages: guidePageData,
					},
				}),
			),
		)
	})

exports.onCreateNode = ({ node, getNode, actions }) => {
	const { createNodeField } = actions
	if (node.internal.type === `File`) {
		createNodeField({
			node,
			name: `slug`,
			value: `${
				node.relativeDirectory.length
					? `/${node.relativeDirectory.split('/').map(slugify).join('/')}`
					: ''
			}/${slugify(node.name)}`,
		})
	}
}
