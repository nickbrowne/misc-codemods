# Miscellaneous Codemods

A collection of codemods to perform various tasks, mostly around modernising Javascript.

Example usage:

    jscodeshift your/code/directory -t hoist-imports.js


## hoist-imports.js

Shifts es6 imports to the top of the file.

<table>
<tr><th>Before</th><th>After</th></tr>
<tr><td>

```js
import Abacus from "lib/abacus";
const FOO = "bar";

import VideoPlayer from "lib/video_player";
```

</td><td>

```js
import Abacus from "lib/abacus";
import VideoPlayer from "lib/video_player";

const FOO = "bar";
```

</td></tr>
</table>

## localise-underscore-imports.js

Converts global usage of underscore functions to local imports of each individual function. Would be fairly easy to adapt to lodash if necessary.

<table>
<tr><th>Before</th><th>After</th></tr>
<tr><td>

```js
_.filter(["a", "b", "c"], (item) => {
  return item == "b";
});
```

</td><td>

```js
import { filter } from "underscore";

filter(["a", "b", "c"], (item) => {
  return item == "b";
});
```

</td></tr>
</table>

## localise-underscore-call-expression-imports.js

Converts global usage of underscore functions in the call expression syntax to local imports of each individual function.

<table>
<tr><th>Before</th><th>After</th></tr>
<tr><td>

```js
_([1, 2, 3]).each((item) => {
  console.log(item);
});

```

</td><td>

```js
import { each } from "underscore";

each([1, 2, 3], (item) => {
  console.log(item);
});

```

</td></tr>
</table>

## TODO

 - Combine `localise-underscore-imports.js` and `localise-underscore-call-expression-imports.js`
