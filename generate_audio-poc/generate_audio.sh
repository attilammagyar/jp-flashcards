#!/bin/bash

app_id="TBVTPzbBcNNnonHm4pDVwYN5wm8tCmJLQ1LdcYy7O4u8*"
filter=".*"

if [[ "$1" != "" ]]
then
    filter="$1"
fi

cat text.txt \
    | grep "^[0-9]*[.] reading: " \
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
        # x=$(echo "$REPLY" | grep 'x[.]')
        # if [[ "x$x" != "x" ]]; then
        if [[ ! -e "$p.wav" ]]
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
            echo "------------------------- $p"
        fi
        # fi
      done
