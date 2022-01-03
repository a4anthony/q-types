#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build-bundle

npm run tailwind

npm pack

cp q-types-module-1.0.5.tgz ~/www/teq/

#cd ~/vue/test/

cd ~/www/teq/

npm i q-types-module-1.0.5.tgz

npm run dev
