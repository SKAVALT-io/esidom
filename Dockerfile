FROM node:12

WORKDIR /usr/src/esidom/client
COPY client/package*.json ./
#RUN npm install
RUN npm ci --only=production
COPY client/ ./

WORKDIR /usr/src/esidom/server
COPY server/package*.json ./
#RUN npm install
RUN npm ci --only=production
COPY server/ ./

WORKDIR /usr/src/esidom/
COPY run_all.sh .

EXPOSE 8080
EXPOSE 3000
CMD ./run_all.sh
