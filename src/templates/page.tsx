import React from "react";
import { renderHtmlAstToReact } from "../renderHtmlToReact";
import { Page, PageContent } from "../types";
import Header from "./components/header";
import { graphql } from "gatsby";
import {
  BodyContainer,
  Main,
  GuideNavigation,
  FolderName,
  PageName,
} from "./components/body";
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

const Navigation = ({ guidePages }: { guidePages: PageContent[] }) => {
  let lastFolder = "";
  return (
    <GuideNavigation>
      <h2>
        <FolderName>Guide</FolderName>
      </h2>
      <PageName>
        <a href="/">Home</a>
      </PageName>
      {guidePages
        .sort(({ folder: f1 }, { folder: f2 }) =>
          f1.join("/").localeCompare(f2.join("/"))
        )
        .map((page) => {
          const f = page.folder.join("/");
          const newFolder = lastFolder !== f;
          lastFolder = f;
          return (
            <React.Fragment key={page.id}>
              {newFolder && (
                <h2>
                  {page.folder.map((f, k) => (
                    <FolderName key={k}>{f}</FolderName>
                  ))}
                </h2>
              )}
              <PageName>
                <a href={`${page.slug}`}>{page.name}</a>
              </PageName>
            </React.Fragment>
          );
        })}
    </GuideNavigation>
  );
};

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
        <Main>
          {renderHtmlAstToReact(data.pageContext.page.remark.htmlAst)}
        </Main>
        <Navigation guidePages={data.pageContext.guidePages} />
      </BodyContainer>

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
