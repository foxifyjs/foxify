#!/usr/bin/env sh

cat >.build/cjs/package.json <<!EOF
{
  "type": "commonjs",
  "imports": {
    "#src/config": {
      "types": "./config.cjs.d.ts",
      "default": "./config.cjs.js"
    },
    "#src/*": {
      "types": "./*.d.ts",
      "default": "./*.js"
    }
  }
}
!EOF

cat >.build/esm/package.json <<!EOF
{
  "type": "module",
  "imports": {
    "#src/config": {
      "types": "./config.esm.d.ts",
      "default": "./config.esm.js"
    },
    "#src/*": {
      "types": "./*.d.ts",
      "default": "./*.js"
    }
  }
}
!EOF
