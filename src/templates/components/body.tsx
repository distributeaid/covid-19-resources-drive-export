import styled from "styled-components";
import {
  wideBreakpoint,
  mobileBreakpoint,
  darkBlue,
  lightBlue,
  softPurple,
  sunshine,
  ultrawideBreakpoint,
} from "../settings";

export const BodyContainer = styled.div`
  margin: 2rem 1rem;
  @media (min-width: ${wideBreakpoint}) {
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr ${mobileBreakpoint} 1fr;
    grid-template-rows: 1fr;
    gap: 0 2rem;
  }
  @media (min-width: ${ultrawideBreakpoint}) {
    grid-template-columns: 1fr ${wideBreakpoint} 1fr;
    gap: 0 4rem;
  }
`;

export const Main = styled.main`
  @media (min-width: ${wideBreakpoint}) {
    grid-column: 2;
    grid-row: 1;
  }
  color: ${darkBlue};
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: 300;
    font-style: italic;
    text-transform: uppercase;
    margin-top: 3rem;
  }
  h1 {
    font-size: 3rem;
  }
  h2 {
    font-size: 2.5rem;
  }
  h3 {
    font-size: 2rem;
  }
  h4 {
    font-size: 1.5rem;
  }
  a {
    color: ${lightBlue};
    &:visited {
      color: ${softPurple};
    }
  }
  p,
  li {
    line-height: 1.75rem;
    font-size: 1.25rem;
  }
  blockquote {
    background-color: ${sunshine};
    margin: -2rem -1rem 2rem -1rem;
    padding: 0.01rem 1rem;
    @media (min-width: ${wideBreakpoint}) {
      padding: 1rem 2rem;
      margin: 2rem 0 0 0;
    }
  }
`;

export const GuideNavigation = styled.nav`
  @media (min-width: ${wideBreakpoint}) {
    grid-column: 1;
    grid-row: 1;
    text-align: right;
    padding: 2rem 0 2rem 2rem;
  }
`;

export const FolderName = styled.span`
  text-transform: uppercase;
  font-size: 0.8rem;
  color: ${softPurple};
  &:after {
    content: " / ";
  }
  &:last-child {
    &:after {
      content: "";
    }
  }
`;

export const PageName = styled.p`
  font-weight: 300;
  margin: 0;
  padding: 0;
  opacity: 0.8;
  & + & {
    margin-bottom: 0.5rem;
  }
  a {
    color: ${darkBlue};
    text-decoration: none;
  }
`;
