const JSDOM = require("jsdom").JSDOM;

module.exports = {
  cleanHTML: (source) => {
    const jsdom = new JSDOM(source);
    const { window } = jsdom;
    const styleTags = window.document.getElementsByTagName("style");
    // Remove style tags
    [].forEach.call(styleTags, (style) => {
      style.remove();
    });
    // Remove styling
    [
      "body",
      "div",
      "a",
      "span",
      "hr",
      "p",
      "ul",
      "li",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
    ].forEach((tag) => {
      const tags = window.document.getElementsByTagName(tag);
      [].forEach.call(tags, (tag) => {
        tag.removeAttribute("style");
        tag.removeAttribute("class");
      });
    });
    let html = jsdom.serialize().replace(/(&nbsp;)+/g, " ");
    html = jsdom.serialize().replace(/[\.…]{2,}/g, ""); // Remove dot indentation
    html = html.replace(/<\/ul><ul>/g, ""); // Merge directly adjacent ULs
    return html;
  },
};
