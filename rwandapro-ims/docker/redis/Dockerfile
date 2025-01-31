# docker/redis/Dockerfile
FROM redis:7-alpine

# Custom Redis configuration
COPY redis.conf /usr/local/etc/redis/redis.conf
CMD ["redis-server", "/usr/local/etc/redis/redis.conf"]

# Enable security features
RUN echo "requirepass ${REDIS_PASSWORD}" >> /usr/local/etc/redis/redis.conf