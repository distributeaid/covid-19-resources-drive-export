import styled from "styled-components";
import {
  wideBreakpoint,
  mobileBreakpoint,
  darkBlue,
  lightBlue,
  softPurple,
  sunshine,
  ultrawideBreakpoint,
  ink,
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
    margin-bottom: 4rem;
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
    background-color: ${sunshine}77;
    border-right: 1px solid ${ink}33;
    grid-column: 1;
    grid-row: 1;
    padding: 2rem 0 4rem 2rem;
  }
`;

export const FolderName = styled.p`
  text-transform: uppercase;
  font-size: 80%;
  color: ${softPurple};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1rem 1rem 1rem;
  margin: 0;
  svg {
    width: 16px;
    height: 16px;
  }
  cursor: pointer;
`;

export const Children = styled.div`
  margin-left: 1rem;
`;

export const PageName = styled.p`
  font-weight: 300;
  margin: 0;
  padding: 1rem 1rem 1rem 1rem;
  & + & {
    padding-top: 0;
  }
  opacity: 0.8;
  a {
    color: ${darkBlue};
    text-decoration: none;
  }
`;

export const Folder = styled.div`
  &.open {
    > ${FolderName} {
      background-color: #fffffffa;
    }
  }
`;
