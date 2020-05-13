import React from 'react'
import { PageContent, LinkEntry } from '../templates/page'
import { SearchResultList } from '../templates/components/search'

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
