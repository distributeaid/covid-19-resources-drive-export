import React, { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import styled from 'styled-components'
import { grey, wideBreakpoint } from '../templates/settings'

import Icon from 'feather-icons/dist/icons/search.svg'
import ClearIcon from 'feather-icons/dist/icons/x.svg'

const SearchInput = styled.input`
	padding: 0 0.5rem;
	background-color: transparent;
	border: 0;
	flex-grow: 1;
`

const ClearButton = styled.button`
	background-color: transparent;
	border: 0;
	flex-grow: 0;
`

export const SearchInputContainer = styled.div`
	border: 1px solid ${grey};
	border-radius: 25px;
	height: 25px;
	display: flex;
	background-color: #fff;
	justify-content: space-between;
	margin: 0 1rem;
	@media (min-width: ${wideBreakpoint}) {
		margin-left: 0;
	}
`

const SearchIcon = styled(Icon)`
	margin-left: 0.25rem;
	opacity: 0.5;
	flex-grow: 0;
`

export const SearchBar = ({
	onSearch,
	onClear,
}: {
	onSearch: (query: string) => void
	onClear: () => void
}) => {
	const [query, updateQuery] = useState('')
	const [debouncedOnSearch] = useDebouncedCallback(() => {
		onSearch(query)
	}, 250)
	return (
		<SearchInputContainer>
			<SearchIcon />
			<SearchInput
				placeholder={'Search ...'}
				value={query}
				onChange={({ target: { value } }) => {
					updateQuery(value.trim())
					if (value.trim().length > 3) {
						debouncedOnSearch()
					}
				}}
			/>
			{query.length > 0 && (
				<ClearButton
					onClick={() => {
						updateQuery('')
						onClear()
					}}
				>
					<ClearIcon />
				</ClearButton>
			)}
		</SearchInputContainer>
	)
}
