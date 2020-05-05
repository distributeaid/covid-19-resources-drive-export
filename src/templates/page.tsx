import React from "react";
import { renderHtmlAstToReact } from "../renderHtmlToReact";
import { Page } from "../types";
import Header from "./components/header";
import { graphql } from "gatsby";
import { BodyContainer } from "./components/body";
import Footer from "./components/footer";

export const query = graphql`
  query PageTemplateQuery {
    site {
      siteMetadata {
        title
        shortTitle
      }
    }
  }
`;

const PageTemplate = (
  data: Page & {
    data: { site: { siteMetadata: { title: string; shortTitle: string } } };
  }
) => {
  console.log(data);
  return (
    <>
      <Header
        title={data.data.site.siteMetadata.title}
        shortTitle={data.data.site.siteMetadata.shortTitle}
      />
      <BodyContainer>
        {renderHtmlAstToReact(data.pageContext.page.remark.htmlAst)}
      </BodyContainer>
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
      <Footer>
        <p>
          Contact:{" "}
          <a href="mailto:hello@distributeaid.org">hello@distributeaid.org</a>
        </p>
        <p>
          <a
            href="https://distributeaid.github.io/slack-invite-link/"
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            Join our Slack!
          </a>
        </p>
      </Footer>
    </>
  );
};

export default PageTemplate;
