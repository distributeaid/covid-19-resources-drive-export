import React from "react";
import { createGlobalStyle } from "styled-components";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import { wideBreakpoint, darkBlue, ink } from "../settings";

import Logo from "../../logo.svg";

const GlobalStyle = createGlobalStyle`
      html,
      body {
        font-family: "Lato", sans-serif;
      }
`;

const StyledHeader = styled.header`
  background: linear-gradient(to right, ${ink} 25%, ${darkBlue} 100%);

  h1 {
    font-weight: 300;
    font-style: italic;
    text-transform: uppercase;
    color: #fff;
    @media (min-width: ${wideBreakpoint}) {
      padding: 0;
      margin: 0;
      font-size: 3rem;
    }
  }
  a {
    text-decoration: none;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem 0 1rem 1rem;
  @media (min-width: ${wideBreakpoint}) {
    margin: 2rem 1rem;
    padding: 2rem 0;
    max-width: ${wideBreakpoint};
    margin: 0 auto;
  }
`;

const StyledLogo = styled(Logo)`
  width: 150px;
  margin-right: 1rem;
  @media (min-width: ${wideBreakpoint}) {
    margin-right: 2rem;
  }
`;

const Header = ({
  title,
  shortTitle,
}: {
  shortTitle: string;
  title: string;
}) => (
  <>
    <Helmet>
      <link
        href="https://necolas.github.io/normalize.css/8.0.1/normalize.css"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;1,300&amp;display=swap"
        rel="stylesheet"
      />
      <title>{title}</title>
    </Helmet>
    <GlobalStyle />
    <StyledHeader>
      <HeaderContainer>
        <a href="/">
          <StyledLogo />
        </a>
        <a href="/">
          <h1>{shortTitle}</h1>
        </a>
      </HeaderContainer>
    </StyledHeader>
  </>
);

export default Header;
