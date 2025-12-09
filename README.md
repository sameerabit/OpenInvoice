# Open Invoice

<div align="center">
  <!-- You can replace this with the new OI logo artifact or a generated image later -->
  <font size="6">Open Invoice Management System</font>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
</div>

**Open Invoice** (formerly Lara Auto Service) is a modern, open-source vehicle service invoice generation and management system. It features a clean, professional React frontend and a robust PHP/Symfony backend.

## ✨ Features

- **Dashboard:** At-a-glance metrics for sales, quotes, and activity.
- **Invoice & Quote Generation:** Create professional PDF invoices and quotes.
- **Customer Management:** Store customer details and vehicle history.
- **Product & Service Management:** Manage inventory and service catalog.
- **Light Theme:** Clean, corporate interface for maximum readability.
- **Dockerized:** Easy deployment with Docker Compose.

## 🚀 Run Locally

**Prerequisites:**
- Docker & Docker Compose
- Node.js (for local frontend dev)

### Quick Start (Docker)

1. Clone the repository.
2. Build and start the containers:
   ```bash
   docker compose up --build -d
   ```
3. Access the application at `http://localhost:5173` (or configured port).

### Local Development

1. **Frontend:**
   ```bash
   cd vehicle-service-invoice-generator
   npm install
   npm run dev
   ```

2. **Backend:**
   (See backend README for specific PHP setup instructions if running outside Docker)

## 📄 License

This project is licensed under the [MIT License](LICENSE).
