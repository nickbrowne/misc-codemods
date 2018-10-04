# Miscellaneous Codemods

A collection of codemods to perform various tasks, mostly around modernising Javascript.

Example usage:

    jscodeshift your/code/directory -t hoist-imports.js


## hoist-imports.js

Shifts es6 imports to the top of the file.

```js
import Abacus from "lib/abacus";
const FOO = "bar";

import VideoPlayer from "lib/video_player";
```

```js
import Abacus from "lib/abacus";
import VideoPlayer from "lib/video_player";

const FOO = "bar";
```
