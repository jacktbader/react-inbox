#!/bin/bash

set -e

git checkout master
git push origin master -f

git checkout 01-components
git rebase master
git push origin 01-components -f

git checkout 02-api-integration
git rebase 01-components
git push origin 02-api-integration -f

git checkout 03-redux
git rebase 02-api-integration
git push origin 03-redux -f

git checkout 04-react-router
git rebase 03-redux
git push origin 04-react-router -f
