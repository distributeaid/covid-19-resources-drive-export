export type PageContent = {
	id: string
	name: string
	folder?: string[]
	slug: string
	remark: {
		htmlAst: string
		headings: {
			depth: number
			value: string
		}[]
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

declare module '*.svg' {
	const content: React.StatelessComponent<React.SVGAttributes<SVGElement>>
	export default content
}
