#!/bin/bash
bash -c "cd client && npm run start &" && bash -c "cd server && npm run start"
