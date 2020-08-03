#! /bin/bash
set -x

docker pull telesoftdevops/devops:telesoft-psad-dashboard-stg

if [[ $(docker ps -a | grep $1 | wc -l)  = 1 ]]
then 
  [[ $(docker stop $1 && docker rm $1) ]]
fi
docker run -it -d --restart=always --name $1 -h $1 -p 8090:80 telesoftdevops/devops:telesoft-psad-dashboard-stg
sleep 60
curl_out=$(curl -w "%{http_code}" -s -o /dev/null "https://dashboard.telesoftmobile.com/")
if [ "$curl_out" != "200" ]
then
  exit 1
fi