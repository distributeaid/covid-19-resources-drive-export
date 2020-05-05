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

export const BodyContainer = styled.main`
  margin: 2rem 1rem;
  @media (min-width: ${wideBreakpoint}) {
    max-width: ${mobileBreakpoint};
    margin: 0 auto;
  }
  @media (min-width: ${ultrawideBreakpoint}) {
    max-width: ${wideBreakpoint};
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
