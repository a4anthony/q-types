#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build-bundle

npm run tailwind

npm pack

cp q-types-0.1.0.tgz ~/vue/test/

cd ~/vue/test/

npm i q-types-0.1.0.tgz
