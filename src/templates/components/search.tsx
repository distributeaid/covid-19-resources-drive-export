import styled from 'styled-components'
import { grey, ink, wideBreakpoint } from '../settings'

import Icon from 'feather-icons/dist/icons/search.svg'

export const SearchInput = styled.input`
	padding: 0 0.5rem;
	background-color: transparent;
	border: 0;
	flex-grow: 1;
`

export const ClearButton = styled.button`
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
export const SearchResultList = styled.div`
	border-bottom: 1px solid ${ink}33;
`

export const SearchIcon = styled(Icon)`
	margin-left: 0.25rem;
	opacity: 0.5;
	flex-grow: 0;
`
