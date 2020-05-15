import React, { useState } from 'react'
import { PageContent, buildTree, Folder, MimeType } from '../content'
import styled from 'styled-components'
import {
	sunshine,
	wideBreakpoint,
	darkBlue,
	ink,
	softPurple,
	ultrawideBreakpoint,
	grey,
} from '../templates/settings'
import { withPrefix } from 'gatsby'
import { SearchBar } from '../search/SearchBar'
import { ShowSearchResult } from '../search/ShowSearchResult'
import { SearchInputContainer } from '../search/SearchBar'

import ChevronRightIcon from 'feather-icons/dist/icons/chevron-right.svg'
import ChevronDownIcon from 'feather-icons/dist/icons/chevron-down.svg'
import DownloadIcon from 'feather-icons/dist/icons/download.svg'
import VideoIcon from 'feather-icons/dist/icons/video.svg'
import MenuIcon from 'feather-icons/dist/icons/menu.svg'
import CloseMenuIcon from 'feather-icons/dist/icons/x.svg'
import DocumentIcon from 'feather-icons/dist/icons/file-text.svg'

const FolderName = styled.p`
	text-transform: uppercase;
	color: ${softPurple};
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1rem 1rem 1rem 1rem;
	margin: 0;
	svg {
		width: 16px;
		height: 16px;
	}
	cursor: pointer;
	font-size: 1.25rem;
	@media (min-width: ${wideBreakpoint}) {
		font-size: 1rem;
	}
`

const Children = styled.div`
	margin-left: 1rem;
`

const PageName = styled.p`
	font-weight: 300;
	margin: 0;
	padding: 1rem 1rem 1rem 1rem;
	& + & {
		padding-top: 0;
	}
	opacity: 0.8;
	a {
		color: ${darkBlue};
		text-decoration: none;
	}
	font-size: 1.25rem;
	@media (min-width: ${wideBreakpoint}) {
		font-size: 1rem;
	}
	a {
		display: flex;
		align-items: center;
		svg {
			opacity: 0.75;
			margin-right: 0.5rem;
			flex-shrink: 0;
		}
	}
`

const GuideNavigation = styled.nav`
	background-color: ${sunshine}77;
	@media (max-width: ${wideBreakpoint}) {
		&.hidden {
			${FolderName}, ${PageName}, ${SearchInputContainer} {
				display: none;
			}
		}
	}
	@media (min-width: ${wideBreakpoint}) {
		padding: 1rem 0 2rem 1rem;
		border-right: 1px solid ${ink}33;
		grid-column: 1;
		grid-row: 1;
	}
	@media (min-width: ${ultrawideBreakpoint}) {
		padding: 2rem 0 4rem 2rem;
	}
`

const FolderContainer = styled.div`
	&.open {
		> ${FolderName} {
			background-color: #fffffffa;
		}
	}
`

const NavigationToggle = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1rem;
	color: ${grey};
	cursor: pointer;
	button {
		background-color: transparent;
		color: inherit;
		border: 0;
		padding: 0;
		margin: 0;
	}
	@media (min-width: ${wideBreakpoint}) {
		display: none;
	}
`

export const LinkEntry = ({ page }: { page: PageContent }) => {
	if (page.mimeType === MimeType.pdf || page.mimeType === MimeType.video) {
		return (
			<PageName>
				<a href={page.url} target="_blank" rel="noopener noreferrer">
					{page.mimeType === MimeType.pdf && <DownloadIcon />}
					{page.mimeType === MimeType.video && <VideoIcon />}
					{page.name}
				</a>
			</PageName>
		)
	}
	return (
		<PageName>
			<a href={withPrefix(page.slug)}>
				<DocumentIcon />
				{page.name}
			</a>
		</PageName>
	)
}

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
		<FolderContainer className={visible ? 'open' : 'closed'}>
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
							<LinkEntry key={key} page={page as PageContent} />
						))}
				</Children>
			)}
		</FolderContainer>
	)
}

export const Navigation = ({
	guidePages,
	currentPage,
	onSearch,
	onClear,
	searchResult,
}: {
	guidePages: PageContent[]
	currentPage: PageContent
	onSearch: (query: string) => void
	onClear: () => void
	searchResult: { objectID: string }[]
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
			<SearchBar onSearch={onSearch} onClear={onClear} />
			{searchResult && (
				<ShowSearchResult searchResult={searchResult} guidePages={guidePages} />
			)}
			<PageName>
				<a href={withPrefix('/')} title="Go to the start page">
					<DocumentIcon />
					Home
				</a>
			</PageName>
			{pageTree
				.filter((entry) => !('children' in entry))
				.map((page, key) => (
					<LinkEntry key={key} page={page as PageContent} />
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
