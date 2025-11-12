# ===============================
# ⚛️ EmpaPortal V2 Frontend - Next.js
# Production Dockerfile
# ===============================

# --- Stage 1: Build ---
FROM node:22-alpine AS builder

# Thư mục làm việc trong container
WORKDIR /app

# Copy các file cần cho dependency resolution
COPY package*.json ./

# Cài đặt dependencies
RUN npm ci --ignore-scripts

# Copy toàn bộ mã nguồn
COPY . .

ENV NEXT_FONT_GOOGLE_DOWNLOAD_URL="http://localhost:12345"
# Build dự án Next.js
RUN npm run build

# --- Stage 2: Run (Production image) ---
FROM node:22-alpine AS runner

WORKDIR /app

# Copy chỉ những phần cần thiết cho runtime
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# Cài dependencies chỉ cho production (giảm dung lượng)
RUN npm ci --omit=dev --ignore-scripts

# Thiết lập biến môi trường production
ENV NODE_ENV=production
ENV PORT=3000

# Expose cổng chạy frontend
EXPOSE 3000

# Lệnh chạy chính thức
CMD ["npm", "run", "start"]
