#!/usr/bin/env bash
echo "Please, provide a commit message"
read c
echo  "Apply major, minor or patch version update?"
read t
git add -A
git commit -m "$c"
npm version $t
