#! /bin/bash
set -x

docker pull telesoftdevops/devops:telesoft-psad-dashboard-release

if [[ $(docker ps -a | grep $1 | wc -l)  = 1 ]]
then 
  [[ $(docker stop $1 && docker rm $1) ]]
fi
docker run -it -d --restart=always --name $1 -h $1 -p 8095:80 telesoftdevops/devops:telesoft-psad-dashboard-release
sleep 60
curl_out=$(curl -w "%{http_code}" -s -o /dev/null "https://dashboard-stable.telesoftmobile.com/")
if [ "$curl_out" != "200" ]
then
  exit 1
fi