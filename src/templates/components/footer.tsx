import styled from "styled-components";
import { darkBlue, ink } from "../settings";

const StyledFooter = styled.footer`
  padding: 2rem;
  background: linear-gradient(to right, ${ink} 25%, ${darkBlue} 100%);
  color: #ffffffe0;
  font-size: 1.25rem;
  text-align: center;
  a {
    color: inherit;
    text-decoration: underline;
    text-decoration-color: #ffffff80;
    &:visited {
      color: inherit;
    }
  }
`;

export default StyledFooter;
