---
emoji:  🎴
title: How to set homescreen and lockscreen wallpaper for linux ( KDE , Gnome, Xfce ) from r/wallpaper using shell script
date: '2022-08-14 17:25:00'
author: chirag padyal
tags: r/wallpaper linux ricing unix beginner  ui customization wallpaper scripts shell  
categories: linux featured

---
Hi! Are you bored of those static wallpapers and love r/wallpaper then this script is about, "How to fetch wallpaper from r/wallpaper and set them as wallpaper on linux "

## Script  to fetch Image from r/wallpaper:
```bash
#!/bin/bash

WALLPAPER_DIR="$HOME/Pictures/Wallpapers"
URI="https://www.reddit.com/r/wallpapers/new.json?limit=25"

USERAGENT="Mozilla/5.0 (X11; Linux x86_64; rv:100.0) Gecko/20100101 Firefox/100.0"

IMGURL=$(curl -H "User-Agent: $USERAGENT" "$URI"   | jq '.data.children' | jq '.[].data.url' | grep -E "(jpe?g|png)\"$" | sed s/\"//g | sort -R | head -1)
echo "$IMGURL"
FILEPATH=$WALLPAPER_DIR/$(printf "%s\n" "${IMGURL##*/}")
echo "$FILEPATH"
curl "$IMGURL" -o "$FILEPATH"
COLORSCHEME=$(gsettings get org.gnome.desktop.interface color-scheme)
```

## Script that stores reddit api response in json and also check if image already exist. 
```bash
#!/bin/bash

# cron example:
# 0 * * * * ~/.local/bin/reddit-wallpaper

# Cache file to save Reddit api response.
JSONCACHE="/tmp/reddit-wallpaper-cache.json"

# Directory where wallpapers are going to be saved
WPATH=${WALLPAPER_PATH:-"$HOME/Pictures/Wallpapers"}
mkdir -p "$WPATH"

# We need to change our user agent so Reddit allow us to get the JSON without errors
USERAGENT="Mozilla/5.0 (X11; Linux x86_64; rv:100.0) Gecko/20100101 Firefox/100.0"

APIURL="https://www.reddit.com/r/wallpapers.json?limit=100"

# Remove cached response if older than 2 hours.
find $(dirname $JSONCACHE) -name "$(basename $JSONCACHE)" -mmin +120 -exec rm {} \; 2>/dev/null

# Remove wallpapers older than 2 days
find $(dirname "$WPATH") -mtime +2 -exec rm {} \; 2>/dev/null

# exit on error
set -e

# If the cache file doesnt exist, we create it.
if [ ! -f "$JSONCACHE" ]; then
  curl -H "User-Agent: $USERAGENT" "$APIURL" -s > $JSONCACHE
fi

# loop through the JSON until a valid image is found
while : ; do
  # Get a random item from the returned JSON
  WJSON=$(cat $JSONCACHE | jq -c '.data.children[].data' --raw-output | shuf -n 1)
  # Check if crosspost
  CROSSPOST=$(echo "$WJSON" | jq -c '.crosspost_parent_list[0]' --raw-output)
  if [ "$CROSSPOST" != "null" ]; then
    WJSON=$CROSSPOST
  fi
  WDOMAIN=$(echo "$WJSON" | jq '.domain' --raw-output)
  if [ "$WDOMAIN" = "i.redd.it" ]; then
    break
  fi
  if [ "$WDOMAIN" = "reddit.com" ]; then
    break
  fi
  if [ "$WDOMAIN" = "i.imgur.com" ]; then
    break
  fi
done

# If the item is gallery, pick a random item from the gallery
WISGALLERY=$(echo "$WJSON" | jq '.is_gallery')
if [ "$WISGALLERY" = "true" ]; then
  GITEM=$(echo "$WJSON" | jq -c '.media_metadata' --raw-output | jq -c 'to_entries[] | .value' | shuf -n 1)
  WMIME=$(echo "$GITEM" | jq '.m' --raw-output)
  WEXT=$(basename "$WMIME")
  WID=$(echo "$GITEM" | jq '.id' --raw-output)
  WURI="https://i.redd.it/$WID.$WEXT"
# If the item is not gallery, obtain the image URL directly
else
  WURI=$(echo "$WJSON" | jq '.url' --raw-output)
fi

echo "$WURI"

# Get the image name + extension
WNAME=$(basename "$WURI")

FILEPATH="$WPATH/$WNAME"

# If the image doesnt exists in our system, we download it.
if [ ! -f "$FILEPATH" ]; then
  curl "$WURI" -s > "$FILEPATH"
fi

echo "$FILEPATH"
``` 
## Set Image as Homescreen And Lockscreen Wallpaper from ~/Wallpapers folder
Just attach the below code with any of fetching script to set it as wallpaper
### For Gnome bash DE :
- #### Homescreen Wallpaper
```
if [ "$COLORSCHEME" = "'prefer-dark'" ]
then COLORSCHEME="picture-uri-dark" 
else COLORSCHEME="picture-uri" 
fi

gsettings set org.gnome.desktop.background $COLORSCHEME file://"$FILEPATH"
```
- #### Lockscreen Wallpaper
```
if [ "$COLORSCHEME" = "'prefer-dark'" ]
then COLORSCHEME="picture-uri-dark" 
else COLORSCHEME="picture-uri" 
fi
```
Ubuntu older version
```
gsettings set org.gnome.desktop.screensaver $COLORSCHEME file://"$FILEPATH"
```
or
```
gsettings set org.gnome.desktop.background $COLORSCHEME file://"$FILEPATH"
```
Ubuntu 22.04 and later
```
gsettings set com.canonical.unity-greeter background file://"$FILEPATH"
```
### For KDE based DE :
- #### homescreen
```
qdbus org.kde.plasmashell /PlasmaShell org.kde.PlasmaShell.evaluateScript "
    var allDesktops = desktops();
    for (i=0;i<allDesktops.length;i++) {{
        d = allDesktops[i];
        d.wallpaperPlugin = 'org.kde.image';
        d.currentConfigGroup = Array('Wallpaper',
                                     'org.kde.image',
                                     'General');
        d.writeConfig('Image', 'file://${FILEPATH}')
    }}
"
```
- #### lockscreen
```
kwriteconfig5 --file kscreenlockerrc --group Greeter --group Wallpaper --group org.kde.image --group General --key Image "file://$FILEPATH"
```
### For Xfce based DE :
- #### homescreen
 ```
xfconf-query --channel xfce4-desktop --property /backdrop/screen0/monitor0/image-path --set $FILEPATH
```
(Note that if you have multiple monitors/screens, this only sets the first one--add monitors accordingly. If you need others, you can get the list from `xfconf-query --channel xfce4-desktop --list`.)
- #### lockscreen
```bash
 xfconf-query -c xfce4-desktop -p insert_property_here -s $FILEPATH
```

## Change wallpaper at certain interval of time
We will use watch command to run the above script after every 10 seconds, but for that we must make the script executable, i have stored the script in Wallpaper folder.
```bash
chmod +x ~/Pictures/Wallpapers/wallpaper.sh
```
```bash
watch -n 10 ~/Pictures/Wallpapers/wallpaper.sh
```



# Thank you

That's it, i loved to share what i know about shell script with you all and hope you also liked my content ... do give a try to mine other works, i  hope we will meet again till then keep learning. 

```toc

```

