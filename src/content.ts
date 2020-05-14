export enum MimeType {
	pdf = 'application/pdf',
	video = 'video/mp4',
	document = 'application/vnd.google-apps.document',
}

export type PageHeading = {
	id: string
	depth: number
	value: string
}

export type PageContent = {
	id: string
	name: string
	folder?: string[]
	slug: string
	driveId: string
	title: string
	url?: string
	mimeType: MimeType
	remark?: {
		htmlAst: string
		headings: PageHeading[]
	}
}

export type Page = {
	path: string
	location: URL
	pageContext: {
		page: PageContent
		guidePages: PageContent[]
	}
}

export type Folder = {
	label: string
	children: (PageContent | Folder)[]
}

/**
 * Takes the list of all pages and turns it into a tree with folders and subfolders
 */
export const buildTree = (
	pages: PageContent[],
	level = 0,
	parentFolder?: string[],
): (PageContent | Folder)[] => [
	...pages.filter(
		({ folder }) => folder?.join('/') === (parentFolder?.join('/') ?? ''),
	),
	...[
		...new Set(
			pages
				.filter(({ folder }) => folder?.[level])
				.filter(({ folder }) =>
					folder?.join('/').startsWith(parentFolder?.join('/') ?? ''),
				)
				.map(({ folder }) => folder?.[level]) as string[],
		),
	].map((label) => ({
		label,
		children: buildTree(pages, level + 1, [...(parentFolder ?? []), label]),
	})),
]
