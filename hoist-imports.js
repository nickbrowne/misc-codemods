export default function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  let imports = [];

  let paths = root.find(j.ImportDeclaration, {
    type: "ImportDeclaration"
  }).forEach((x) => imports.push(x));

  imports.reverse().forEach(path => {
    let thing = j(path);
    root.get().node.program.body.unshift(thing.toSource());
    thing.remove();
  });

  return root.toSource();
}
