FROM node:lts-buster
RUN git clone https://github.com/WeedTech/Fus-e-MD/root/WeedTech 
WORKDIR /root/WeedTech 
RUN npm install && npm install -g pm2 || yarn install --network-concurrency 1
COPY . .
EXPOSE 9090
CMD ["npm", "start"]
