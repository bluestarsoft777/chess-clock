#!/bin/bash

echo -e "\033[0;32mDeploying updates to GitHub...\033[0m"

# Build the project.
npm run build

# Go To Public folder
cd build
# Add changes to git.
git add .

# Commit changes.
msg="rebuilding app `date`"
if [ $# -eq 1 ]
  then msg="$1"
fi
git commit -m "$msg"

# Push source and build repos.
git push origin app

# Come Back up to the Project Root
cd ..