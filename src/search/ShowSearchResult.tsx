import React from 'react'
import { PageContent, LinkEntry } from '../templates/page'

export const ShowSearchResult = ({
	guidePages,
	searchResult,
}: {
	guidePages: PageContent[]
	searchResult: { objectID: string }[]
}) => {
	const ids = searchResult.map(({ objectID }) => objectID)
	const pages = guidePages.filter(({ driveId }) => ids.includes(driveId))
	return (
		<>
			{pages.map((p, key) => (
				<LinkEntry key={key} page={p} />
			))}
		</>
	)
}
