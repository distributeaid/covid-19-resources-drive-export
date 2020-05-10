import React, { useState } from 'react'
import { renderHtmlAstToReact } from '../renderHtmlToReact'
import { Page, PageContent } from '../types'
import Header from './components/header'
import { graphql } from 'gatsby'
import {
	BodyContainer,
	Main,
	GuideNavigation,
	FolderName,
	Folder,
	PageName,
	Children,
	NavigationToggle,
} from './components/body'
import Footer from './components/footer'

import ChevronRightIcon from 'feather-icons/dist/icons/chevron-right.svg'
import ChevronDownIcon from 'feather-icons/dist/icons/chevron-down.svg'
import MenuIcon from 'feather-icons/dist/icons/menu.svg'
import CloseMenuIcon from 'feather-icons/dist/icons/x.svg'

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

type Folder = {
	label: string
	children: (PageContent | Folder)[]
}

const buildTree = (
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

const NavigationFolder = ({
	folder,
	currentPage,
	parents,
}: {
	folder: Folder
	currentPage: PageContent
	parents?: Folder[]
}) => {
	const [visible, setVisible] = useState(
		currentPage.folder
			?.join('/')
			.startsWith(
				[...(parents?.map(({ label }) => label) ?? []), folder.label].join('/'),
			),
	)
	if (folder.children?.length === 0) return null
	return (
		<Folder className={visible ? 'open' : 'closed'}>
			<FolderName onClick={() => setVisible((v) => !v)}>
				{folder.label}
				{visible && <ChevronDownIcon />}
				{!visible && <ChevronRightIcon />}
			</FolderName>
			{visible && (
				<Children>
					{folder.children
						.filter((entry) => 'children' in entry)
						.map((entry, key) => (
							<NavigationFolder
								key={key}
								folder={entry as Folder}
								currentPage={currentPage}
								parents={[...(parents ?? []), folder]}
							/>
						))}
					{folder.children
						.filter((entry) => !('children' in entry))
						.map((page, key) => (
							<PageName key={key}>
								<a href={`${(page as PageContent).slug}`}>
									{(page as PageContent).name}
								</a>
							</PageName>
						))}
				</Children>
			)}
		</Folder>
	)
}

const Navigation = ({
	guidePages,
	currentPage,
}: {
	guidePages: PageContent[]
	currentPage: PageContent
}) => {
	const pageTree = buildTree(guidePages)
	const [menuVisible, setMenuVisible] = useState(false)
	return (
		<GuideNavigation className={menuVisible ? 'visible' : 'hidden'}>
			<NavigationToggle onClick={() => setMenuVisible((v) => !v)}>
				Menu
				{menuVisible ? (
					<button title="Hide menu">
						<CloseMenuIcon />
					</button>
				) : (
					<button title="Show menu">
						<MenuIcon />
					</button>
				)}
			</NavigationToggle>
			<PageName>
				<a href="/" title="Go to the start page">
					Home
				</a>
			</PageName>
			{pageTree
				.filter((entry) => !('children' in entry))
				.map((page, key) => (
					<PageName key={key}>
						<a href={`${(page as PageContent).slug}`}>
							{(page as PageContent).name}
						</a>
					</PageName>
				))}
			{pageTree
				.filter((entry) => 'children' in entry)
				.map((entry, key) => (
					<NavigationFolder
						key={key}
						folder={entry as Folder}
						currentPage={currentPage}
					/>
				))}
		</GuideNavigation>
	)
}

const PageTemplate = (
	data: Page & {
		data: {
			site: {
				siteMetadata: { title: string; shortTitle: string; description: string }
			}
		}
	},
) => (
	<>
		<Header
			title={data.data.site.siteMetadata.title}
			shortTitle={data.data.site.siteMetadata.shortTitle}
			description={data.data.site.siteMetadata.description}
		/>
		<BodyContainer>
			<Main>{renderHtmlAstToReact(data.pageContext.page.remark.htmlAst)}</Main>
			<Navigation
				guidePages={data.pageContext.guidePages}
				currentPage={data.pageContext.page}
			/>
		</BodyContainer>

		<Footer>
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

export default PageTemplate
