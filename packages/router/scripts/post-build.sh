#!/usr/bin/env sh

cat >.build/cjs/package.json <<!EOF
{
  "type": "commonjs",
  "imports": {
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
    "#src/*": {
      "types": "./*.d.ts",
      "default": "./*.js"
    }
  }
}
!EOF
