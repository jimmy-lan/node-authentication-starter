# Shell script to open a url
# Created by Jimmy Lan
# Creation Date: 2021-03-12

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        xdg-open "$1"
elif [[ "$OSTYPE" == "darwin"* ]]; then
        open "$1"
elif [[ "$OSTYPE" == "cygwin" ]]; then
        xdg-open "$1"
elif [[ "$OSTYPE" == "msys" ]]; then
        start "$1"
elif [[ "$OSTYPE" == "win32" ]]; then
        start "$1"
else
        echo "Unknown system. Please navigate to " "$1" " in your browser window to view."
fi