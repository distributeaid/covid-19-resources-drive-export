import React, { useState, useEffect, useRef } from 'react'
import { PageHeading } from '../content'
import styled from 'styled-components'
import { extrawideBreakpoint, grey } from '../templates/settings'

import ClearIcon from 'feather-icons/dist/icons/x.svg'
import MenuIcon from 'feather-icons/dist/icons/menu.svg'

const LinkContainer = styled.div`
	display: flex;
	flex-direction: column;
	max-height: 100%;
	overflow: hidden;
	overflow-y: auto;
`

const NavigationWithMenu = styled.div``

const DocumentNavigationContainer = styled.aside`
	display: none;
	@media (min-width: ${extrawideBreakpoint}) {
		display: block;
		margin-top: 2rem;
	}
	&.scrolling {
		${NavigationWithMenu} {
			position: fixed;
			top: 2rem;
		}
	}
	a {
		color: ${grey};
		font-weight: 300;
		text-decoration: none;
		margin-top: 0.5rem;
		&.level-1 {
		}
		&.level-2 {
			margin-left: 1rem;
		}
		&.level-3 {
			margin-left: 2rem;
		}
		&.level-4 {
			margin-left: 3rem;
		}
		&.level-5 {
			margin-left: 4rem;
		}
		&.level-6 {
			margin-left: 5rem;
		}
	}
	@media print {
		display: none;
	}
`

const ToggleButton = styled.button`
	background: 0;
	border: 0;
	padding: 0;
	opacity: 0.5;
`

const Toggle = styled.div`
	display: flex;
	flex-direction: row;
`

const windowGlobal = (typeof window !== 'undefined' && window) || undefined

export const DocumentNavigation = ({
	headings,
	onToggle,
}: {
	headings: PageHeading[]
	onToggle: (shown: boolean) => void
}) => {
	if (!headings.length) return null

	// We need to calculate the maximum height for the LinkContainer, which is the space on the righthand side minus the header and the footer (if visible).
	// This is needed to deal with documents that have a lot of entries and are displayed on small screens.
	const linkContainerRef = useRef<HTMLDivElement>(null)
	const [scrollTop, setScrollTop] = useState(0)
	const [footerSize, setFooterSize] = useState(0)
	const [showMenu, setShowMenu] = useState(
		windowGlobal?.localStorage.getItem(
			'resources:content-navigation:closed',
		) !== '1',
	)
	onToggle(showMenu)
	const top =
		windowGlobal?.document.getElementsByTagName('header')?.[0]?.clientHeight ??
		0
	const linkContainerTop =
		linkContainerRef.current?.getBoundingClientRect().top ?? 0
	const height = windowGlobal?.innerHeight ?? Number.MAX_SAFE_INTEGER
	const maxLinkContainerHeight = Math.floor(
		height - linkContainerTop - footerSize,
	)

	useEffect(() => {
		if (windowGlobal)
			windowGlobal.onscroll = () => {
				setScrollTop(window.scrollY)
				setFooterSize(
					Math.max(
						0,
						(windowGlobal?.innerHeight ?? 0) -
							(windowGlobal?.document
								.getElementById('mainFooter')
								?.getBoundingClientRect().top ?? 0),
					),
				)
			}
	}, [windowGlobal])

	return (
		<DocumentNavigationContainer className={scrollTop > top ? 'scrolling' : ''}>
			<NavigationWithMenu>
				<Toggle>
					{showMenu && (
						<ToggleButton
							title={'Hide content navigation'}
							onClick={() => {
								setShowMenu(false)
								windowGlobal?.localStorage.setItem(
									'resources:content-navigation:closed',
									'1',
								)
							}}
						>
							<ClearIcon />
						</ToggleButton>
					)}
					{!showMenu && (
						<ToggleButton
							title={'Show content navigation'}
							onClick={() => {
								setShowMenu(true)
								windowGlobal?.localStorage.removeItem(
									'resources:content-navigation:closed',
								)
							}}
						>
							<MenuIcon />
						</ToggleButton>
					)}
				</Toggle>
				<LinkContainer
					ref={linkContainerRef}
					style={{ maxHeight: maxLinkContainerHeight }}
				>
					{showMenu &&
						headings.map(({ id, depth, value }, key) => (
							<a href={`#${id}`} key={key} className={`level-${depth}`}>
								{value}
							</a>
						))}
				</LinkContainer>
			</NavigationWithMenu>
		</DocumentNavigationContainer>
	)
}
