#!/bin/bash

i=0
w=""
g=""
rm lyrics.txt
ls -1 ?????.wav \
    | sort \
    | while read
        do
            p=$(echo "$REPLY" | cut -d. -f1)
            n=$(echo "$p" | sed "s/^0*//")
            w="$w$p.wav $p.wav $p.wav "
            i=$(($i+1))
            grep "^$n[.] " kanji.txt >>lyrics.txt
            grep "^$n[.] " kana.txt >>lyrics.txt
            grep "^$n[.] " english.txt >>lyrics.txt
            echo >>lyrics.txt
            if [[ $i -eq 5 ]]
            then
                i=0
                jn=$(echo "$w" | sed 's/[^0-9][^0-9]*/_/g ; s/_$// ; s/^\([0-9][0-9]*\)_.*_\([0-9][0-9]*\)$/\1_\2/')
                sox $w "$jn.wav"
                mv lyrics.txt "$jn.txt"
                w=""
            fi
        done

# for i in *_*.wav ; do n=$(echo "$i" | sed s/wav/mp3/) ; lame -b 192 -m m $i $n ; done
# for i in *_*.mp3 ; do n=$(echo "$i" | sed s/mp3/txt/) ; eyeD3 --to-v2.3 --set-encoding=utf16-BE -a jp-flashcards -A jp-flashcards -t "$i" --lyrics=jpn:$n:"$(cat $n) " $i ; done
