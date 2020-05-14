import React, { useState, useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { PageHeading } from '../content'
import styled from 'styled-components'
import { extrawideBreakpoint, grey } from '../templates/settings'

const DocumentNavigationContainer = styled.aside`
	display: none;
	@media (min-width: ${extrawideBreakpoint}) {
		display: flex;
		flex-direction: column;
		transition: 1s all ease;
		margin-top: 4rem;
	}
	a {
		color: ${grey};
		font-weight: 300;
		text-decoration: none;
		margin-top: 1rem;
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

const windowGlobal = (typeof window !== 'undefined' && window) || undefined

export const DocumentNavigation = ({
	headings,
}: {
	headings: PageHeading[]
}) => {
	if (!headings.length) return null
	const [scrollTop, setScrollTop] = useState(0)
	const top =
		windowGlobal?.document.getElementsByTagName('header')?.[0]?.clientHeight ??
		0
	const [debounceOnScroll] = useDebouncedCallback(() => {
		setScrollTop(window.scrollY)
	}, 250)
	useEffect(() => {
		if (windowGlobal) windowGlobal.onscroll = debounceOnScroll
	}, [windowGlobal])
	return (
		<DocumentNavigationContainer
			style={{ paddingTop: Math.max(0, scrollTop - top) }}
		>
			{headings.map(({ id, depth, value }, key) => (
				<a href={`#${id}`} key={key} className={`level-${depth}`}>
					{value}
				</a>
			))}
		</DocumentNavigationContainer>
	)
}
