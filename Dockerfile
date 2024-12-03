# Menggunakan Node.js versi 18 sebagai base image
FROM node:18

# Menentukan direktori kerja di dalam container
WORKDIR /usr/src/app

# Menyalin package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Menyalin seluruh kode aplikasi ke dalam container
COPY . .

# Menentukan port yang akan digunakan
EXPOSE 8080

# Menjalankan aplikasi saat container dijalankan
CMD ["npm", "start"]
