export default function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  // hunt for any global use of underscore using
  // a call expression style aka. _(x).map(...)
  let matches = root.find(j.CallExpression, {
    callee: {
      type: "MemberExpression",
      object: {
        type: "CallExpression",
        callee: {
          type: "Identifier",
          name: "_"
        }
      },
      property: {
        type: "Identifier"
      },
    }
  });

  let modules_to_import = new Set();

  matches.forEach((path) => {
    let underscore_method_name = path.get().value.callee.property.name;
    modules_to_import.add(underscore_method_name);

    j(path).replaceWith(nodePath => {
      const { node } = nodePath;

      // change the callee object callee (HEH) to be the underscore
      // method we're extracting an import for
      node.callee.object.callee.name = underscore_method_name;

      // drain the original arguments onto the callee object
      while(node.arguments.length) {
        node.callee.object.arguments.push(node.arguments.shift());
      }

      // return the callee object in place of the call expression
      return node.callee.object;
    });
  });

  // don't change anything if there is nothing to import
  if (modules_to_import.size) {
    // see if there's an existing underscore import
    let existing_imports = root.find(j.ImportDeclaration, {
      type: "ImportDeclaration",
      source: {
        type: "Literal",
        value: "underscore"
      }
    });

    // after we've grabbed added any existing imported modules
    // to our set, remove the existing import so we can rewrite
    // one with everything
    if(existing_imports.length) {
      let path = existing_imports.forEach((path) => {
        path.node.specifiers.forEach((specifier) => {
          modules_to_import.add((specifier.imported.name));
        });

        j(path).remove();
      });
    }

    // write a brand new underscore import with every module
    let modules_str = Array.from(modules_to_import).sort().join(", ");
    root.get().node.program.body.unshift(`import { ${modules_str} } from \"underscore\";`)
  }

  return root.toSource();
}
