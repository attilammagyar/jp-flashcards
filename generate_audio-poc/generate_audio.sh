#!/bin/bash

app_id="TA8Ghe_PxlgpyautAXXm7RtR1invD-D4EiPV3SgGM3b0*"
filter=".*"

if [[ "$1" != "" ]]
then
    filter="$1"
fi

cat readings.txt \
    | grep "$filter"  \
    | while read
      do
        i=$(echo "$REPLY" | cut -d'.' -f1)
        text=$(echo "$REPLY" | cut -d' ' -f2-)
        gender="male"
        if [[ $(($i%2)) -eq 1 ]]
        then
            gender=female
        fi
        # x=$(echo "$REPLY" | grep 'x[.]')
        # if [[ "x$x" != "x" ]]; then
        curl \
            "http://api.microsofttranslator.com/v2/http.svc/speak?appId=$app_id&language=ja-JP&format=audio/wav&options=MaxQuality|$gender&text=$(perl -MURI::Escape -e 'print uri_escape($ARGV[0]);' $text)" \
            -H 'Host: api.microsofttranslator.com' \
            -H 'User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:40.0) Gecko/20100101 Firefox/40.0' \
            -H 'Accept: audio/webm,audio/ogg,audio/wav,audio/*;q=0.9,application/ogg;q=0.7,video/*;q=0.6,*/*;q=0.5' \
            -H 'Accept-Language: en-US,en;q=0.5' \
            -H 'DNT: 1' \
            -H 'Range: bytes=0-' \
            -H 'Referer: http://www.bing.com/translator/' \
            -H 'Connection: keep-alive' > $i.wav
        echo "------------------------- $i"
        # fi
      done
