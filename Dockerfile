# Gunakan Node.js official image dari Docker Hub
FROM node:16

# Set working directory
WORKDIR /usr/src/app

# Salin package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin semua file aplikasi ke dalam container
COPY . .

# Expose port yang akan digunakan oleh aplikasi
EXPOSE 8080

# Jalankan aplikasi Node.js
CMD ["node", "app.js"]
