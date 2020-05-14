import React from 'react'
import { PageContent } from '../content'
import { LinkEntry } from '../navigation/Navigation'
import styled from 'styled-components'
import { ink } from '../templates/settings'

const SearchResultList = styled.div`
	border-bottom: 1px solid ${ink}33;
`

export const ShowSearchResult = ({
	guidePages,
	searchResult,
}: {
	guidePages: PageContent[]
	searchResult: { objectID: string }[]
}) => {
	if (searchResult.length === 0) return null
	const ids = searchResult.map(({ objectID }) => objectID)
	const matches = guidePages.filter(({ driveId }) => ids.includes(driveId))
	return (
		<SearchResultList>
			{matches.map((p, key) => (
				<LinkEntry key={key} page={p} />
			))}
		</SearchResultList>
	)
}
