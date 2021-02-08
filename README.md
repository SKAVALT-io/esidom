# esidom



## Client

_TODO_

## Server

### Install dependencies

`npm install`

### Building

`npm run build`

### Testing

`npm run test`

### Lauching

`npm run start`


## Docker

### Build image
`docker build -t esdidom[:tag] .`

### Run image
`docker run -p 8080:8080 -p 3000:3000 -d --name esidom esidom`

### Check logs
`docker logs esidom`

### Remove image
`docker stop esidom && docker rm esidom`
