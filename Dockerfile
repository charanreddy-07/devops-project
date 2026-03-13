FROM node:20-alpine
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app
COPY app/ .
RUN chown -R appuser:appgroup /app
USER appuser
EXPOSE 3000
CMD ["node", "server.js"]
