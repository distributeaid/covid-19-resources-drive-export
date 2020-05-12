import React, { useState } from 'react'
import {
	SearchInput,
	SearchInputContainer,
} from '../templates/components/search'
import { useDebouncedCallback } from 'use-debounce'

export const SearchBar = ({
	onSearch,
}: {
	onSearch: (query: string) => void
}) => {
	const [query, updateQuery] = useState('')
	const [debouncedOnSearch] = useDebouncedCallback(() => {
		onSearch(query)
	}, 250)
	return (
		<SearchInputContainer>
			<SearchInput
				placeholder={'Search ...'}
				value={query}
				onChange={({ target: { value } }) => {
					updateQuery(value.trim())
					if (value.trim().length > 0) {
						debouncedOnSearch()
					}
				}}
			/>
		</SearchInputContainer>
	)
}
