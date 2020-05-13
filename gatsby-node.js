require('ts-node').register({ files: true })
const path = require('path')

const slugify = (str) =>
	str
		.trim()
		.replace(/ /g, '-')
		.replace(/[^A-Z0-9-]/gi, '')
		.replace(/-{2,}/g, '-')

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
								depth
								value
							}
							htmlAst
							frontmatter {
								driveId
								title
								url
								mimeType
							}
						}
					}
				}
			}
		}
	`).then((guidePages) => {
		if (guidePages.errors) {
			throw guidePages.errors
		}
		return Promise.all([
			graphql(`
				query IndexPageQuery {
					allFile(
						filter: {
							sourceInstanceName: { eq: "pages" }
							name: { eq: "README" }
						}
					) {
						edges {
							node {
								childMarkdownRemark {
									htmlAst
									headings {
										depth
										value
									}
								}
							}
						}
					}
				}
			`).then((indexPage) => {
				if (indexPage.errors) {
					throw indexPage.errors
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
						title: childMarkdownRemark?.frontmatter?.title,
						url: childMarkdownRemark?.frontmatter?.url,
						mimeType: childMarkdownRemark?.frontmatter?.mimeType,
						remark: childMarkdownRemark,
					}),
				)

				// Render index page
				indexPage.data.allFile.edges.forEach(
					({ node: { childMarkdownRemark } }) => {
						createPage({
							path: '/',
							component: path.join(
								process.cwd(),
								'src',
								'templates',
								'page.tsx',
							),
							context: {
								page: {
									remark: childMarkdownRemark,
								},
								guidePages: guidePageData,
							},
						})
					},
				)

				// Render guide pages
				guidePages.data.allFile.edges.forEach(
					({
						node: {
							id,
							fields: { slug },
						},
					}) => {
						createPage({
							path: slug,
							component: path.join(
								process.cwd(),
								'src',
								'templates',
								'page.tsx',
							),
							context: {
								page: guidePageData.find(({ id: pId }) => pId === id),
								guidePages: guidePageData,
							},
						})
					},
				)
			}),
		])
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
