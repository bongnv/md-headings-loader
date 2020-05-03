const { getOptions } = require("loader-utils");
const visit = require("unist-util-visit");

module.exports = function (source, map, meta) {
  const options = getOptions(this);
  const depth = options && options.depth ? options.depth : 3;

  const callback = this.async();
  let headings = [];

  visit(meta.ast, "heading", (node) => {
    const heading = { depth: node.depth, value: "", anchor: "" };
    const children = node.children || [];

    for (let i = 0, l = children.length; i < l; i++) {
      const el = children[i];

      if (el.type === "link") {
        heading.anchor = el.url;
      } else if (el.value) {
        heading.value += el.value;
      }
    }

    headings.push(heading);
  });

  headings = headings.filter((heading) => heading.depth <= depth);
  const attributes = {
    ...meta.attributes,
    headings,
  };

  const newMeta = {
    ...meta,
    attributes,
  };
  callback(null, source, map, newMeta);
};
