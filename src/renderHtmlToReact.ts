import React from 'react'
import * as hastToHyperscript from 'hast-to-hyperscript'

export const renderHtmlAstToReact = (tree: unknown): any =>
	hastToHyperscript(React.createElement, tree).props.children
