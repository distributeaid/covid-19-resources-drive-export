import React from "react";

const hastToHyperscript = require("hast-to-hyperscript");

export const renderHtmlAstToReact = (node: any) => {
  return hastToHyperscript(React.createElement, node);
};
