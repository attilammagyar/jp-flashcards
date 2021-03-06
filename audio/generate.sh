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
        d=$(echo ${p:0:3})
        f="$d/$p"
        text=$(echo "$REPLY" | cut -d' ' -f3-)
        gender="male"
        if [[ $(($i%2)) -eq 1 ]]
        then
            gender="female"
        fi
        if [[ ! -e "$f.wav" ]] && [[ ! -e "$f.audio" ]]
        then
            url_text=$(perl -MURI::Escape -e 'print uri_escape($ARGV[0]);' $text)
            # curl \
                # "http://api.microsofttranslator.com/v2/http.svc/speak?appId=$app_id&language=ja-JP&format=audio/wav&options=MaxQuality|$gender&text=$url_text" \
                # -H 'Host: api.microsofttranslator.com' \
                # -H 'User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:40.0) Gecko/20100101 Firefox/40.0' \
                # -H 'Accept: audio/webm,audio/ogg,audio/wav,audio/*;q=0.9,application/ogg;q=0.7,video/*;q=0.6,*/*;q=0.5' \
                # -H 'Accept-Language: en-US,en;q=0.5' \
                # -H 'DNT: 1' \
                # -H 'Range: bytes=0-' \
                # -H 'Referer: http://www.bing.com/translator/' \
                # -H 'Connection: keep-alive' > "$f.wav"

            curl \
                "http://www.bing.com/translator/api/language/Speak?locale=ja-JP&gender=$gender&media=audio/wav&text=$url_text" \
                -H 'Host: www.bing.com' \
                -H 'User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:43.0) Gecko/20100101 Firefox/43.0' \
                -H 'Accept: audio/webm,audio/ogg,audio/wav,audio/*;q=0.9,application/ogg;q=0.7,video/*;q=0.6,*/*;q=0.5' \
                -H 'Accept-Language: en-US,en;q=0.5' \
                -H 'Range: bytes=0-' \
                -H 'Referer: http://www.bing.com/translator' \
                -H 'Cookie: mtstkn=Sy38fSIayZK2cGoWGEGUn1mNmAqbUo5BMLmpWpshyLHtIT8OVbrdM6BRmspeE4%2B6; _EDGE_S=F=1&SID=0C49EF07471769060583E7DE46E568C6; _EDGE_V=1; MUID=1128BAC3D836616A3492B21AD9C46029; MUIDB=1128BAC3D836616A3492B21AD9C46029; srcLang=-; destLang=en; smru_list=; dmru_list=en; destDia=en-US; sourceDia=ja-JP; WLS=C=&N=; SRCHD=AF=NOFORM; SRCHUID=V=2&GUID=6E09F2A61B604B828E60ADC13690A0EE; SRCHUSR=DOB=20160315; _SS=SID=0C49EF07471769060583E7DE46E568C6' \
                -H 'Connection: keep-alive' > "$f.wav"
        fi
        if [[ ! -e "$f.audio" ]]
        then
            lame -b 80 -m m "$f.wav" "$f.audio"
            rm "$f.wav"
        fi
        grep "^$i[.] " text.txt | grep -v "^$i[.] line: " | cut -d" " -f2- > "lyrics.txt"
        eyeD3 \
            --remove-all \
            "$f.audio"
        eyeD3 \
            --to-v2.3 \
            --set-encoding=utf16-BE \
            --no-tagging-time-frame \
            -a jp-fc \
            -A "jp-fc-$d" \
            -t "jp-fc-$p" --lyrics=jpn:$n:"$(cat lyrics.txt)  " \
            "$f.audio"
        rm lyrics.txt
        echo "------------------------- ${f}.audio"
      done


# mkdir okay bad ; for i in $(ls -1 | sort) ; do while true ; do mplayer "$i" ; echo -n "$i Okay / Bad / Repeat? (o/b/r) " ; read ; if [[ "$REPLY" = "o" ]]; then mv "$i" okay/ ; break ; fi ; if [[ "$REPLY" = "b" ]]; then mv "$i" bad/ ; break ; fi ; done ; done
#
# diff -u text-base.txt text.txt | grep '^[+][0-9]*[.] line: ' | cut -d+ -f2-
#
# ( diff -u text-base.txt text.txt | grep '^[+][0-9]*[.] line: ' | cut -d+ -f2- | cut -d. -f1 | while read ; do echo -n "$REPLY " ; done ; echo ; echo bad/*.mp3 | sed 's/bad.0*//g ; s/[.]mp3//g' )
