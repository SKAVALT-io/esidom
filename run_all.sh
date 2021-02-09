#!/bin/bash
bash -c "cd client && npm run startProd &" && bash -c "cd server && npm run startProd"
