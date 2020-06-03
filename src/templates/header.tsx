import React from 'react'
import { createGlobalStyle } from 'styled-components'
import styled from 'styled-components'
import { Helmet } from 'react-helmet'
import {
	wideBreakpoint,
	darkBlue,
	ink,
	mobileBreakpoint,
	ultrawideBreakpoint,
} from './settings'
import { withPrefix } from 'gatsby'

import Logo from '../logo.svg'

const GlobalStyle = createGlobalStyle`
      html,
      body {
        font-family: "Lato", sans-serif;
      }
	  .noprint {
		  @media print {
			  display: none;
		  }
	  }
	  .noscreen {
		  @media screen {
			  display: none;
		  }
	  }
`

const StyledHeader = styled.header`
	background: linear-gradient(to right, ${ink} 25%, ${darkBlue} 100%);

	@media print {
		display: none;
	}

	h1 {
		font-weight: 300;
		font-style: italic;
		text-transform: uppercase;
		color: #fff;
		@media (min-width: ${wideBreakpoint}) {
			padding: 0;
			margin: 0;
			font-size: 3rem;
		}
	}
	a {
		text-decoration: none;
	}
`

const TitleContainer = styled.div`
	@media (min-width: ${wideBreakpoint}) {
		grid-column: 2 / span 2;
	}
`

const HeaderContainer = styled.div`
	display: flex;
	align-items: center;
	padding: 1rem 0 1rem 1rem;
	@media (min-width: ${wideBreakpoint}) {
		padding: 2rem 0 2rem 1rem;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1fr ${mobileBreakpoint} 1fr;
		grid-template-rows: 1fr;
		gap: 0 2rem;
	}
	@media (min-width: ${ultrawideBreakpoint}) {
		grid-template-columns: 1fr ${wideBreakpoint} 1fr;
		gap: 0 4rem;
	}
`

const StyledLogo = styled(Logo)`
	width: 100px;
	margin-right: 1rem;
	@media (min-width: ${wideBreakpoint}) {
		width: 150px;
		margin-right: 4rem;
	}
`

const LogoContainer = styled.div`
	@media (min-width: ${wideBreakpoint}) {
		display: flex;
		align-items: flex-end;
		flex-direction: column;
	}
`

const Header = ({
	title,
	shortTitle,
	description,
}: {
	shortTitle: string
	title: string
	description: string
}) => (
	<>
		<Helmet>
			<link
				href="https://necolas.github.io/normalize.css/8.0.1/normalize.css"
				rel="stylesheet"
			/>
			<link
				href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;1,300&amp;display=swap"
				rel="stylesheet"
			/>
			<title>{title}</title>
			<meta name="description" content={description} />
			<html lang="en" />
			<link rel="icon" type="image/svg+xml" href={withPrefix('/favicon.svg')} />
		</Helmet>
		<GlobalStyle />
		<StyledHeader>
			<HeaderContainer>
				<LogoContainer>
					<a href={withPrefix('/')} title="Go to the start page">
						<StyledLogo />
					</a>
				</LogoContainer>
				<TitleContainer>
					<a href={withPrefix('/')} title="Go to the start page">
						<h1>{shortTitle}</h1>
					</a>
				</TitleContainer>
			</HeaderContainer>
		</StyledHeader>
	</>
)

export default Header
