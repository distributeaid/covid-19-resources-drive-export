import React from 'react'
import { PageContent } from '../content'
import { LinkEntry } from '../navigation/Navigation'
import styled from 'styled-components'
import { ink } from '../templates/settings'
import { SearchResult } from '../templates/page'

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
					<em>No result found for &quot;{searchResult.query}&quot;.</em>
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
		</SearchResultList>
	)
}
