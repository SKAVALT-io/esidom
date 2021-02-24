FROM node:12.20.1-buster

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
WORKDIR /usr/src/esidom/client
COPY client/package*.json ./
COPY client/build ./build
RUN npm ci --only=production
# && npm run build
#RUN npm prune --production
# RUN npm ci --only=production
# COPY client/ ./

WORKDIR /usr/src/esidom/server
COPY server/package*.json ./
COPY server/.env ./
COPY server/dist ./dist
RUN npm ci --only=production
#&& npm run build
#RUN npm prune --production
# --only=production

WORKDIR /usr/src/esidom/
COPY run_all.sh .
RUN chmod u+x run_all.sh

EXPOSE 8080
EXPOSE 3000
CMD ./run_all.sh

