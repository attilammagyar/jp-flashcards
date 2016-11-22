#!/bin/bash

main()
{
    local word=""
    local skritter_list="skritter/skritter.my_list.txt"

    while read
    do
        word=$(echo "$REPLY" | cut -d' ' -f1)
        grep -q "^$word " "$skritter_list" || (
            echo "$REPLY" >>"$skritter_list"
            echo "$word"
        )
    done
}

main "$@"
