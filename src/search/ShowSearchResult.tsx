import React from 'react'
import { PageContent } from '../content'
import { LinkEntry } from '../navigation/Navigation'
import styled from 'styled-components'
import { ink } from '../templates/settings'
import { SearchResult } from '../templates/page'

import AlgoliaLogo from '../search-by-algolia-light-background.svg'

const AlgoliaFooter = styled.div`
	display: flex;
	flex-direction: row-reverse;
	svg {
		height: 24px;
		opacity: 0.5;
		margin-bottom: 1rem;
		margin-right: 1rem;
	}
`

const SearchResultList = styled.div`
	border-bottom: 1px solid ${ink}33;
`

export const ShowSearchResult = ({
	guidePages,
	searchResult,
}: {
	guidePages: PageContent[]
	searchResult: SearchResult
}) => {
	if (searchResult.matches.length === 0)
		return (
			<SearchResultList>
				<p>
					<em>No result found for &quot;{searchResult.query}&quot;. </em>
				</p>
			</SearchResultList>
		)
	const ids = searchResult.matches.map(({ objectID }) => objectID)
	const matches = guidePages.filter(
		({ driveId }) => driveId !== undefined && ids.includes(driveId),
	)

	return (
		<SearchResultList>
			{matches.map((p, key) => (
				<LinkEntry key={key} page={p} />
			))}
			<AlgoliaFooter>
				<a
					href="https://www.algolia.com/"
					target="_blank"
					rel="noreferrer noopener"
				>
					<AlgoliaLogo />
				</a>
			</AlgoliaFooter>
		</SearchResultList>
	)
}
