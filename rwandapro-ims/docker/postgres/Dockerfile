# docker/postgres/Dockerfile
FROM postgres:15-alpine

# Enable pg_stat_statements for query monitoring
RUN echo "shared_preload_libraries = 'pg_stat_statements'" >> /usr/share/postgresql/postgresql.conf.sample

# Custom initialization scripts (optional)
COPY ./initdb /docker-entrypoint-initdb.d

# Healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD pg_isready -U postgres -d rwandapro