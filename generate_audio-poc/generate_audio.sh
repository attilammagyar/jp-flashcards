#!/bin/bash

i=0
cat readings.txt \
    | while read
      do
        i=$(($i+1))
        gender="male"
        if [[ $(($i%2)) -eq 1 ]]
        then
            gender=female
        fi
        text=$(echo "$REPLY" | cut -d' ' -f2-)
        # x=$(echo "$REPLY" | grep 'x[.]')
        # if [[ "x$x" != "x" ]]; then
        curl \
            "http://api.microsofttranslator.com/v2/http.svc/speak?appId=TEsnr_bE8DvBN9-Gy8X1MdyaGQrKuN-vkQ8rnAjK9AXs*&language=ja-JP&format=audio/wav&options=MaxQuality|$gender&text=$(perl -MURI::Escape -e 'print uri_escape($ARGV[0]);' $text)" \
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
