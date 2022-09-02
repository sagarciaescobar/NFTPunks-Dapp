#!/bin/bash

cd ./build
FILES=$(find * -type f | awk -v q="'" '{print " -F " q "file=@\"" $0 "\";filename=\"" $0 "\"" q}')
curl "https://ipfs.infura.io:5001/api/v0/add?pin=true&recursive=true&wrap-with-directory=true&cid-version=1" -u "2EBsaniqr3L3Xx9w3C2AQfvJ6EP:8336014da5834a3846770c22768fbf97" -vv -X POST $FILES
cd ..