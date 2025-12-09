FROM php:8.4-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libpq-dev \
    libsqlite3-dev \
    zip \
    unzip \
    postgresql-client \
    sqlite3 \
    && docker-php-ext-install pdo_mysql pdo_pgsql pdo_sqlite mbstring exif pcntl bcmath gd zip

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy existing application directory contents (except files that might change often)
COPY . .

# Change ownership of the app directory to www-data
RUN chown -R www-data:www-data /var/www

# Create JWT keys directory and generate keys if not exist
RUN mkdir -p config/jwt && \
    if [ ! -f config/jwt/private.pem ]; then \
        openssl genrsa -out config/jwt/private.pem -aes256 -passout pass:$JWT_PASSPHRASE 4096 && \
        openssl rsa -pubout -in config/jwt/private.pem -out config/jwt/public.pem -passin pass:$JWT_PASSPHRASE; \
    fi

# Expose port 9000 and start php-fpm server
EXPOSE 9000
CMD ["php-fpm"]
