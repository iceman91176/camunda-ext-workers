FROM node:9-alpine
ENV NODE_ENV=production
WORKDIR /app

# Install deps for production only
COPY ./package* ./
RUN npm install && \
    npm cache clean --force
	
COPY . /app	

# Start the app
CMD npm start
