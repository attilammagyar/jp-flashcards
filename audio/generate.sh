#!/bin/bash

app_id="TBtjtRi7eI9b7ztC0FztAF4M5EwACq-Tqf9VdOUw6IWY*"
filter=".*"

if [[ "$1" != "" ]]
then
    filter="$1"
fi

cat text.txt \
    | grep "^[0-9]*[.] line: " \
    | grep "$filter"  \
    | while read
      do
        i=$(echo "$REPLY" | cut -d'.' -f1)
        p=$(printf '%05d' "$i")
        text=$(echo "$REPLY" | cut -d' ' -f3-)
        gender="male"
        if [[ $(($i%2)) -eq 1 ]]
        then
            gender=female
        fi
        if [[ ! -e "$p.wav" ]] && [[ ! -e "$p.mp3" ]]
        then
            curl \
                "http://api.microsofttranslator.com/v2/http.svc/speak?appId=$app_id&language=ja-JP&format=audio/wav&options=MaxQuality|$gender&text=$(perl -MURI::Escape -e 'print uri_escape($ARGV[0]);' $text)" \
                -H 'Host: api.microsofttranslator.com' \
                -H 'User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:40.0) Gecko/20100101 Firefox/40.0' \
                -H 'Accept: audio/webm,audio/ogg,audio/wav,audio/*;q=0.9,application/ogg;q=0.7,video/*;q=0.6,*/*;q=0.5' \
                -H 'Accept-Language: en-US,en;q=0.5' \
                -H 'DNT: 1' \
                -H 'Range: bytes=0-' \
                -H 'Referer: http://www.bing.com/translator/' \
                -H 'Connection: keep-alive' > "$p.wav"
        fi
        if [[ ! -e "$p.mp3" ]]
        then
            lame -b 80 -m m "$p.wav" "$p.mp3"
            rm "$p.wav"
        fi
        grep "^$i[.] " text.txt | grep -v "^$i[.] line: " | cut -d" " -f2- > "lyrics.txt"
        eyeD3 \
            --to-v2.3 \
            --set-encoding=utf16-BE \
            -a jp-flashcards \
            -A jp-flashcards \
            -t "jp-fc $p" --lyrics=jpn:$n:"$(cat lyrics.txt)  " "$p.mp3"
        rm lyrics.txt
        echo "------------------------- $p"
      done
