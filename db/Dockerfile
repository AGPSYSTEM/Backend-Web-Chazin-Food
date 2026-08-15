FROM mysql:8.0

# Default environment variables (overridable from docker-compose or .env)
ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=chazinfood
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=root

EXPOSE 3306

# Use the official image entrypoint. Any SQL files placed in
# /docker-entrypoint-initdb.d/ will be executed on first startup.