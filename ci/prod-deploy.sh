#! /bin/bash
set -x

docker pull telesoftdevops/devops:telesoft-psad-dashboard-prod

echo "Remove Dashboard-1 from LB-Pool"
sed -e '/server 127.0.0.1:8091/ s/^#*/#/' -i /etc/nginx/sites-enabled/dashboard.conf
nginx -s reload
docker stop $1
docker rm $1
docker run -it -d --restart=always --name $1 -p 8091:80 -e APP_VERSION=`curl "http:/146.177.0.220:8088/deployments/amount/psad_dashboard/master"` telesoftdevops/devops:telesoft-psad-dashboard-prod
sleep 10
echo "Add back Dashboard-1 to the pool"
sed -i 's/#    server 127.0.0.1:8091;/    server 127.0.0.1:8091;/g' /etc/nginx/sites-enabled/dashboard.conf
nginx -s reload
sleep 5
echo "Remove Dashboard-2 from LB-Pool"
sed -e '/server 127.0.0.1:8092/ s/^#*/#/' -i /etc/nginx/sites-enabled/dashboard.conf
nginx -s reload
docker stop $2
docker rm $2
docker run -it -d --restart=always --name $2 -p 8092:80 -e APP_VERSION=`curl "http:/146.177.0.220:8088/deployments/amount/psad_dashboard/master"` telesoftdevops/devops:telesoft-psad-dashboard-prod
sed -i 's/#    server 127.0.0.1:8092;/    server 127.0.0.1:8092;/g' /etc/nginx/sites-enabled/dashboard.conf
nginx -s reload
docker container ls -a | grep telesoft-psad-dashboard