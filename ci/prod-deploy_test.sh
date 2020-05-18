#! /bin/bash
set -x

echo "Remove Dashboard-1 from LB-Pool"
echo "Deploying new Dashboard-1"
echo stop $1
echo "Add back Dashboard-1 to the pool"
echo "Remove Dashboard-2 from LB-Pool"
echo "Deploying new Dashboard-2"
echo stop $2
echo "Add back Dashboard-2 to the pool"