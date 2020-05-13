import React, { useState } from 'react'
import {
	SearchInput,
	SearchInputContainer,
	ClearButton,
	SearchIcon,
} from '../templates/components/search'
import { useDebouncedCallback } from 'use-debounce'

import ClearIcon from 'feather-icons/dist/icons/x.svg'

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
