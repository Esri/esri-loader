#!/bin/bash
set -e
CHANGE="$1"

# update CHANGELOG
carriage-return --level "$CHANGE"

# bump version 
# NOTE: force is needed so that the preversion script can run
# and preversion creates production build and runs tests
npm version "$CHANGE" --force

# push version commit and tags to github
git push --follow-tags

# publish to npm
# TODO: uncomment this once this script is locked and loaded
# npm publish
