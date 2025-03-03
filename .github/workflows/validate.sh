#!/bin/bash


# Run the readme update script
node /home/iptv/tv_plusplus/.github/scripts/readme-m3u.js /home/iptv/tv_plusplus/accountbanned_tv++.m3u
node /home/iptv/tv_plusplus/.github/scripts/groups.js /home/iptv/tv_plusplus/accountbanned_tv++.m3u

# Commit changes to files
git config --global user.name 'Bot Bot'
git config --global user.email 'noreply@accountbanned.com'
git add --all
git diff --quiet && git diff --staged --quiet
if [ $? -ne 0 ]; then
    git commit -m "Automated updates of M3U Files"
    git push
fi
