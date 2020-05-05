import React from "react";
import { renderHtmlAstToReact } from "../renderHtmlToReact";
import { Page } from "../types";

const PageTemplate = (data: Page) => (
  <>
    <main>{renderHtmlAstToReact(data.pageContext.page.remark.htmlAst)}</main>
    <aside>
      <nav>
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          {data.pageContext.guidePages.map((page) => (
            <li key={page.id}>
              <a href={`${page.slug}`}>{page.name}</a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  </>
);

export default PageTemplate;
