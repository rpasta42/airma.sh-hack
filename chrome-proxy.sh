#!/bin/bash

#script for playing airma.sh through proxy
#usage: ./chrome-proxy.sh username@ip 8120

#can replace with google-chrome
browser=chromium-browser

#if using PEM key for server, set this to: "-i /path/to/credential.pem"
amazon_pem_key=""


port=$2
user_ip=$1


ssh $amazon_pem_key -D $port -f -C -q -N $user_ip;
$browser --proxy-server="socks5://localhost:$port"

