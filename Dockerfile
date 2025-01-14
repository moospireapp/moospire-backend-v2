# Use a Node.js base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Set environment argument
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

# Install dependencies in the container
RUN if [ "$NODE_ENV" = "development" ]; then \
      npm install -g nodemon && npm install; \
    else \
      npm install --include=dev && npm install -g pm2; \
    fi

# Install TypeScript globally (ensures `tsc` is available)
RUN npm install -g typescript

# Copy the rest of the app's code
COPY . .

# Build TypeScript in production
RUN if [ "$NODE_ENV" = "production" ]; then \
      npm run build; \
    fi

# Expose application port
EXPOSE 4001

# Default command
CMD ["npm", "run", "dev"]