import React, { useState } from 'react'
import { renderHtmlAstToReact } from '../renderHtmlToReact'
import Header from './header'
import { graphql } from 'gatsby'
import algoliasearch from 'algoliasearch/lite'
import { Page } from '../content'
import { DocumentNavigation } from '../navigation/DocumentNavigation'
import { Navigation } from '../navigation/Navigation'
import styled from 'styled-components'
import {
	wideBreakpoint,
	mobileBreakpoint,
	darkBlue,
	lightBlue,
	softPurple,
	sunshine,
	ultrawideBreakpoint,
	ink,
} from './settings'
import { GuideFooter } from './GuideFooter'

const algoliaClient = algoliasearch(
	process.env.GATSBY_ALGOLIA_APP_ID ?? '',
	process.env.GATSBY_ALGOLIA_SEARCH_KEY ?? '',
)
const pagesIndex = algoliaClient.initIndex('Pages')

const BodyContainer = styled.div`
	display: flex;
	flex-direction: column-reverse;
	@media (min-width: ${wideBreakpoint}) {
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1fr ${mobileBreakpoint} 1fr;
		grid-template-rows: 1fr;
		gap: 0 2rem;
	}
	@media (min-width: ${ultrawideBreakpoint}) {
		grid-template-columns: 1fr ${wideBreakpoint} 1fr;
		gap: 0 4rem;
	}
`

const Main = styled.main`
	margin: 2rem 1rem;
	img {
		max-width: 100%;
	}
	@media (min-width: ${wideBreakpoint}) {
		grid-column: 2;
		grid-row: 1;
		margin-bottom: 4rem;
	}
	color: ${darkBlue};
	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		font-weight: 300;
		font-style: italic;
		text-transform: uppercase;
		margin-top: 3rem;
		&:first-child {
			margin-top: 0;
		}
	}
	h1 {
		font-size: 3rem;
	}
	h2 {
		font-size: 2.5rem;
	}
	h3 {
		font-size: 2rem;
	}
	h4 {
		font-size: 1.5rem;
	}
	a {
		color: ${lightBlue};
		&:visited {
			color: ${softPurple};
		}
	}
	p,
	li {
		line-height: 1.75rem;
		font-size: 1.25rem;
	}
	blockquote {
		background-color: ${sunshine};
		margin: -2rem -1rem 2rem -1rem;
		padding: 0.01rem 1rem;
		@media (min-width: ${wideBreakpoint}) {
			padding: 1rem 2rem;
			margin: 2rem 0 0 0;
		}
	}
`

const Footer = styled.footer`
	padding: 2rem;
	background: linear-gradient(to right, ${ink} 25%, ${darkBlue} 100%);
	color: #ffffff;
	font-size: 1.25rem;
	text-align: center;
	a {
		color: inherit;
		text-decoration: underline;
		text-decoration-color: #ffffff80;
		&:visited {
			color: inherit;
		}
	}
`

export const query = graphql`
	query PageTemplateQuery {
		site {
			siteMetadata {
				title
				shortTitle
				description
			}
		}
	}
`

const PageTemplate = (
	data: Page & {
		data: {
			site: {
				siteMetadata: { title: string; shortTitle: string; description: string }
			}
		}
	},
) => {
	const [searchResult, updateSearchResult] = useState<{ objectID: string }[]>(
		[],
	)

	const onSearch = (query: string) => {
		pagesIndex
			.search(query, { attributesToRetrieve: ['objectID'] })
			.then((res) => {
				updateSearchResult(res.hits)
			})
			.catch(console.error)
	}
	return (
		<>
			<Header
				title={data.data.site.siteMetadata.title}
				shortTitle={data.data.site.siteMetadata.shortTitle}
				description={data.data.site.siteMetadata.description}
			/>
			<BodyContainer>
				{data.pageContext.page.remark?.headings && (
					<DocumentNavigation
						headings={data.pageContext.page.remark.headings}
					/>
				)}
				<Main>
					{data.pageContext.page.remark?.htmlAst !== undefined &&
						renderHtmlAstToReact(data.pageContext.page.remark.htmlAst)}
					<GuideFooter {...data.pageContext.page} />
				</Main>
				<Navigation
					guidePages={data.pageContext.guidePages}
					currentPage={data.pageContext.page}
					onSearch={onSearch}
					onClear={() => {
						updateSearchResult([])
					}}
					searchResult={searchResult}
				/>
			</BodyContainer>

			<Footer id={'mainFooter'}>
				<p>
					Contact:{' '}
					<a href="mailto:hello@distributeaid.org">hello@distributeaid.org</a>
				</p>
				<p>
					<a
						href="https://distributeaid.github.io/slack-invite-link/"
						target="_blank"
						rel="nofollow noopener noreferrer"
					>
						Join our Slack!
					</a>
				</p>
			</Footer>
		</>
	)
}

export default PageTemplate
