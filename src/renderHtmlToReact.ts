import React from 'react'
import * as hastToHyperscript from 'hast-to-hyperscript'

export const renderHtmlAstToReact = (tree: any) =>
	hastToHyperscript(React.createElement, tree).props.children
