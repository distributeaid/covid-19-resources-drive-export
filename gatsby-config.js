require("ts-node").register({ files: true });
const fs = require("fs");
const path = require("path");

const pJSON = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "package.json"), "utf-8")
);

const siteUrl = (process.env.SITE_URL || pJSON.homepage).replace(/\//g, "");

module.exports = {
  siteMetadata: {
    title: `Distribute Aid's COVID-19 Aid Workers Guide`,
    siteUrl,
    description: `An Aid-Worker’s guide to COVID-19, Community Organising & Care handbooks and resources.`,
  },
  plugins: [
    `gatsby-plugin-typescript`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: path.join(process.cwd(), "static"),
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `guide`,
        path: path.join(process.cwd(), "export"),
        ignore: [`**/.git/**`], // ignore files starting with a dot
      },
    },
    `gatsby-transformer-remark`,
  ],
};
