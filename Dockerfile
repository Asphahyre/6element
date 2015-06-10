FROM ants/nodejs:v1
MAINTAINER Alexandre Vallette <alexandre.vallette@ants.builders>

RUN mkdir /6element
WORKDIR /6element

COPY . .
RUN npm install
RUN npm run build