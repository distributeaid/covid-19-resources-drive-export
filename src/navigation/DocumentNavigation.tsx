import React, { useState, useEffect } from 'react'
import { PageHeading } from '../content'
import styled from 'styled-components'
import { extrawideBreakpoint, grey } from '../templates/settings'

import ClearIcon from 'feather-icons/dist/icons/x.svg'
import MenuIcon from 'feather-icons/dist/icons/menu.svg'

const DocumentNavigationContainer = styled.aside`
	display: none;
	@media (min-width: ${extrawideBreakpoint}) {
		display: block;
		margin-top: 2rem;
	}
	> div {
		display: flex;
		flex-direction: column;
	}
	&.scrolling {
		> div {
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
}: {
	headings: PageHeading[]
}) => {
	if (!headings.length) return null
	const [scrollTop, setScrollTop] = useState(0)
	const [showMenu, setShowMenu] = useState(
		windowGlobal?.localStorage.getItem(
			'resources:content-navigation:closed',
		) !== '1',
	)
	const top =
		windowGlobal?.document.getElementsByTagName('header')?.[0]?.clientHeight ??
		0
	useEffect(() => {
		if (windowGlobal) windowGlobal.onscroll = () => setScrollTop(window.scrollY)
	}, [windowGlobal])

	return (
		<DocumentNavigationContainer className={scrollTop > top ? 'scrolling' : ''}>
			<div>
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
				{showMenu &&
					headings.map(({ id, depth, value }, key) => (
						<a href={`#${id}`} key={key} className={`level-${depth}`}>
							{value}
						</a>
					))}
			</div>
		</DocumentNavigationContainer>
	)
}
