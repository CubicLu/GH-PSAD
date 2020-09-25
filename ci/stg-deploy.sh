#! /bin/bash
set -x

docker pull telesoftdevops/devops:telesoft-psad-dashboard-stg

if [[ $(docker ps -a | grep $1 | grep "0.0.0.0:8090" | wc -l)  = 1 ]]
then 
  [[ $(docker stop $1 && docker rm $1) ]]
fi
docker run -it -d --restart=always --name $1 -h $1 -p 8090:80 -e APP_VERSION=`curl "http:/172.26.16.220:8088/deployments/amount/psad_dashboard/stg"` telesoftdevops/devops:telesoft-psad-dashboard-stg
sleep 60
curl_out=$(curl -w "%{http_code}" -s -o /dev/null "https://dashboard.telesoftmobile.com/")
if [ "$curl_out" != "200" ]
then
  exit 1
fi