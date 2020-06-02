import React from 'react'
import styled from 'styled-components'
import { PageContent } from '../content'
import { formatDistanceToNow } from 'date-fns'
import ReactDOMServer from 'react-dom/server'

import FeedbackIcon from 'feather-icons/dist/icons/message-square.svg'
import LastUpdatedIcon from 'feather-icons/dist/icons/clock.svg'

const Footer = styled.footer`
	color: gray;
	font-size: 80%;
`
const HR = styled.hr`
	border-bottom: 0;
`

const P = styled.p`
	display: flex;
	align-items: center;
	svg {
		margin-right: 0.5rem;
	}
`

const Attribute = styled.p`
	font-style: italic;
	@media print {
		display: none;
	}
`

const Snippet = styled.div`
	background-color: #8080802e;
	font-size: 14px;
	line-height: 1rem;
	padding: 0.5rem;
	@media print {
		display: none;
	}
`

const copyrightYearString = `${
	new Date().getFullYear() > 2020 ? `2020—` : ''
}${new Date().getFullYear()}`

const Copyright = () => (
	<>
		&copy; {copyrightYearString}{' '}
		<a
			href="https://distributeaid.org/"
			target="_blank"
			rel="noreferrer noopener"
		>
			Distribute Aid
		</a>
		. This guide is licensed under the{' '}
		<a
			href="https://creativecommons.org/licenses/by-sa/2.0/"
			target="_blank"
			rel="noreferrer noopener"
		>
			CC BY-SA 2.0
		</a>{' '}
		license.
	</>
)

export const GuideFooter = ({ driveId, modifiedTime }: PageContent) => (
	<Footer>
		<HR />
		{modifiedTime !== null && (
			<P>
				<LastUpdatedIcon />
				<span>
					Last updated:{' '}
					<time dateTime={modifiedTime} className={'noprint'}>
						{formatDistanceToNow(new Date(modifiedTime))} ago
					</time>
					<time dateTime={modifiedTime} className={'noscreen'}>
						{modifiedTime}
					</time>
				</span>
			</P>
		)}
		<P className={'noprint'}>
			<FeedbackIcon />
			<span>
				Please provide feedback to this guide{' '}
				<a href={`https://docs.google.com/document/d/${driveId}`}>
					in the original Google Doc
				</a>
				.
			</span>
		</P>
		<p>
			<em>
				<strong>Steal this Guide!</strong>
				<br />
				This content is licensed under the{' '}
				<a
					href="https://creativecommons.org/licenses/by-sa/2.0/"
					target="_blank"
					rel="noreferrer noopener"
				>
					Creative Commons Attribution-ShareAlike 2.0 Generic
				</a>{' '}
				license.
			</em>
		</p>
		<Attribute>
			Please attribute like this: <br />
			<Copyright />
			<br />
			HTML snippet:
			<br />
			<Snippet>
				<code>
					{ReactDOMServer.renderToString(<Copyright />).replace(
						/<!-- -->/g,
						'',
					)}
				</code>
			</Snippet>
		</Attribute>
	</Footer>
)
