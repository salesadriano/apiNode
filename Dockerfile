FROM node:19-slim

ADD id_ed25519 / 

RUN npm install -g typescript && \
    npm install -g nodemon  && \
    apt update -y && apt -y install curl git && \
    mkdir ~/.ssh && \
    mv id_ed25519 ~/.ssh && \
    chmod 600 ~/.ssh/id_ed25519

CMD [ "tail", "-f", "/dev/null" ]