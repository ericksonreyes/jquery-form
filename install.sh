#!/bin/sh

green='\e[1;32m%s\e[0m\n'

set -e

clear


printf "$green" "#######################################################################"
printf "$green" "# "
printf "$green" "# jquery-form Installer."
printf "$green" "# "
printf "$green" "# This requires the following to be installed in your computer:"
printf "$green" "# 1. Docker - https://www.docker.com/"
printf "$green" "# "
printf "$green" "# Do you want to install jquery-form in your computer? [Y/n]?"
printf "$green" "# "
printf "$green" "#######################################################################"
read -p "" choice


if [ "$choice" = "Y" ]; then
SECONDS=0
  printf "$green" "#######################################################################"
  printf "$green" "# "
  printf "$green" "# Do you want a fresh installation? [Y/n]"
  printf "$green" "# "
  printf "$green" "# This will:"
  printf "$green" "# 2. Delete node_modules/ folder."
  printf "$green" "# "
  printf "$green" "#######################################################################"
  read -p "" fresh_installation

  echo ""
  echo ""
  printf "$green" "#######################################################################"
  printf "$green" "# "
  printf "$green" "# [2/9] Shutting down existing jquery-form containers."
  printf "$green" "# "
  printf "$green" "#######################################################################"

  if [ "$fresh_installation" = "Y" ]; then
    docker compose down -v
  else
    docker compose down
  fi

  echo ""
  echo ""
  if [ "$fresh_installation" = "Y" ]; then
    printf "$green" "#######################################################################"
    printf "$green" "# "
    printf "$green" "# [3/9] Deleting node_modules/ folders."
    printf "$green" "# "
    printf "$green" "#######################################################################"
    rm -Rf node_modules/
  else
    printf "$green" "#######################################################################"
    printf "$green" "# "
    printf "$green" "# [3/9] Deleting node_modules/ folders. Skipped."
    printf "$green" "# "
    printf "$green" "#######################################################################"
  fi

  echo ""
  echo ""
  printf "$green" "#######################################################################"
  printf "$green" "# "
  printf "$green" "# [5/9] Building docker images."
  printf "$green" "# "
  printf "$green" "#######################################################################"
  docker compose build

  echo ""
  echo ""
  printf "$green" "#######################################################################"
  printf "$green" "# "
  printf "$green" "# [6/9] Starting new jquery-form containers as daemons."
  printf "$green" "# "
  printf "$green" "#######################################################################"
  docker compose up -d app

	echo ""
	echo ""
	if [[ ! -f package.json ]]; then
    printf "$green" "#######################################################################"
    printf "$green" "# "
    printf "$green" "# [8/9] Installing NodeJS libraries. Skipped. Missing package.json file."
    printf "$green" "# "
    printf "$green" "#######################################################################"
  else
    printf "$green" "#######################################################################"
    printf "$green" "# "
    printf "$green" "# [8/9] Installing NodeJS libraries."
    printf "$green" "# "
    printf "$green" "#######################################################################"
    docker compose run --rm npm install
  fi

  t=$SECONDS
  echo ""
  echo ""
  printf "$green" "#######################################################################"
  printf "$green" "# "
  printf "$green" "# jquery-form installed!"
  printf "$green" "# Done in $(( t / 60 )) minutes and $(( (t % 60))) seconds."
  printf "$green" "# "
  printf "$green" "#######################################################################"
  echo ""
  echo ""
fi
