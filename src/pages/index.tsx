import React from "react";
import { graphql } from "gatsby";

const IndexPage = ({ data }: any) => <pre>{JSON.stringify(data, null, 2)}</pre>;

export const query = graphql`
  query IndexPageQuery {
    allFile(filter: { sourceInstanceName: { eq: "guide" } }) {
      edges {
        node {
          name
          extension
          dir
          modifiedTime
        }
      }
    }
  }
`;

export default IndexPage;
