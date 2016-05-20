#!/bin/sh

# Set identity
git config --global user.email "travis@travis-ci.org"
git config --global user.name "Travis"

# Build and publish docs
npm run deploy-docs
