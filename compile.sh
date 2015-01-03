#!/bin/bash

if [[ -e "cards.js" ]]
then
    echo -n "cards.js already exists, do you want to overwrite? [Y/n]: "
    read
    if [[ "$REPLY" != "Y" ]]
    then
        echo "Exiting without overwriting anything"
        exit 1
    fi
fi

source ./py3/bin/activate
PYTHONIOENCODING=utf-8 python3 ./compile.py "cards.roomaji.js" "cards.js"
deactivate
