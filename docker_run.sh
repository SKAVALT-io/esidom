#/bin/bash

if(($# != 3))
then		echo "Usage : $0 <adresse IP:port> <user> <password>"
		exit 1
fi

server=$1
user=$2
password=$3
filename="server/.env"
container_name="esidom"
image_name="esidom"

echo "baseUrl=${server}" > ${filename}
echo "user=${user}" >> ${filename}
echo "password=${password}" >> ${filename}

docker build -t ${image_name} .

docker rm -f ${container_name}
docker run -p 8080:8080 -p 3000:3000 -d --restart unless-stopped --name ${container_name} ${image_name}
