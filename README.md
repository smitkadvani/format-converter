# 🔄 Format Converter

A modern, full-stack web application for detecting and converting between JSON, XML, YAML, and TOON formats with automatic format detection.

## ✨ Features

- **🔍 Automatic Format Detection**: Intelligent detection of JSON, XML, YAML, and TOON formats
- **🔄 Bidirectional Conversion**: Convert between any supported format
- **🎨 Modern UI**: Clean, intuitive interface inspired by popular converter tools
- **⚡ Real-time Conversion**: Instant format conversion with visual feedback
- **📋 Copy & Swap**: Easy-to-use copy and swap functionality
- **🐳 Docker Ready**: Fully containerized for easy deployment
- **☁️ Cloud Deployment**: Single-command deployment to Google Cloud Platform
- **✅ Bug-Free**: Robust error handling and validation
- **🌟 TOON Format Support**: Full support for the TOON data serialization format

## 🏗️ Architecture

### Backend
- **Node.js + Express**: RESTful API for format detection and conversion
- **js-yaml**: YAML parsing and generation
- **xml2js**: XML parsing and generation
- **@toon-format/toon**: TOON format parsing and generation
- **CORS enabled**: Secure cross-origin requests

### Frontend
- **React + Vite**: Fast, modern frontend framework
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Axios**: HTTP client for API communication
- **CSS Grid Layout**: Modern, flexible layout system

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Docker
- npm or yarn
- Git

### Local Development (Without Docker)

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd format-converter
   ```

2. **Start the backend**
   ```bash
   cd backend
   npm install
   npm start
   ```
   Backend will run on http://localhost:3001

3. **Start the frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend will run on http://localhost:3000

### Local Development (With Docker)

1. **Clone and run**
   ```bash
   git clone <your-repo-url>
   cd format-converter
   docker-compose up --build
   ```

2. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost:3001

## ☁️ GCP Deployment

Deploy to Google Cloud Platform with a single command!

### Prerequisites

- Google Cloud Platform account
- [gcloud CLI](https://cloud.google.com/sdk/docs/install) installed
- Docker installed
- GCP project with billing enabled

### Deploy

```bash
./deploy.sh
```

You'll be prompted for:
- GCP Project ID
- (Optional) Region (defaults to us-central1)

The script will:
1. Enable required GCP APIs
2. Build and push Docker images
3. Deploy to Cloud Run
4. Provide you with the application URL

### Environment Variables for GCP

You can set these before running the deploy script:

```bash
export GCP_PROJECT_ID="your-project-id"
export GCP_REGION="us-central1"
./deploy.sh
```

## 📚 API Documentation

### Health Check
```
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Detect Format
```
POST /api/detect
Content-Type: text/plain

<your data>
```

**Response:**
```json
{
  "success": true,
  "detectedFormat": "json",
  "input": "..."
}
```

### Convert Format
```
POST /api/convert
Content-Type: application/json

{
  "input": "<your data>",
  "targetFormat": "json|xml|yaml|toon"
}
```

**Response:**
```json
{
  "success": true,
  "sourceFormat": "json",
  "targetFormat": "yaml",
  "converted": "..."
}
```

## 🧪 Testing

### Test JSON to YAML

**Input:**
```json
{
  "name": "John Doe",
  "age": 30,
  "city": "New York"
}
```

**Output:**
```yaml
name: John Doe
age: 30
city: New York
```

### Test XML to JSON

**Input:**
```xml
<root>
  <name>John Doe</name>
  <age>30</age>
  <city>New York</city>
</root>
```

**Output:**
```json
{
  "root": {
    "name": "John Doe",
    "age": "30",
    "city": "New York"
  }
}
```

### Test YAML to XML

**Input:**
```yaml
name: John Doe
age: 30
city: New York
```

**Output:**
```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<root>
  <name>John Doe</name>
  <age>30</age>
  <city>New York</city>
</root>
```

### Test JSON to TOON

**Input:**
```json
{
  "name": "John Doe",
  "age": 30,
  "active": true
}
```

**Output:**
```toon
name: "John Doe"
age: 30
active: true
```

### Test TOON to JSON

**Input:**
```toon
# User configuration
name: "Jane Smith"
email: "jane@example.com"
roles: ["admin", "user"]
```

**Output:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "roles": ["admin", "user"]
}
```

## 🗂️ Project Structure

```
format-converter/
├── backend/               # Node.js backend
│   ├── server.js         # Express server with conversion logic
│   ├── package.json      # Backend dependencies
│   ├── Dockerfile        # Backend container
│   └── .dockerignore
├── frontend/             # React frontend
│   ├── src/
│   │   ├── App.jsx       # Main application component
│   │   ├── App.css       # Application styles
│   │   ├── main.jsx      # React entry point
│   │   └── index.css     # Global styles
│   ├── index.html        # HTML template
│   ├── package.json      # Frontend dependencies
│   ├── vite.config.js    # Vite configuration
│   ├── nginx.conf        # Nginx configuration
│   ├── Dockerfile        # Frontend container
│   └── .dockerignore
├── deployment/           # Deployment scripts
│   └── deploy-gcp.sh     # GCP deployment script
├── docker-compose.yml    # Docker Compose configuration
├── deploy.sh             # Simple deployment wrapper
├── .gitignore
└── README.md
```

## 🔧 Configuration

### Backend Environment Variables

- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment mode (development/production)

### Frontend Environment Variables

- `VITE_API_URL`: Backend API URL (default: http://localhost:3001)

## 🐛 Error Handling

The application includes comprehensive error handling:

- Invalid format detection
- Parse errors with helpful messages
- Network error handling
- Input validation
- User-friendly error messages

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Inspired by [jsontoon.com](https://jsontoon.com/)
- TOON format specification: [toon-format/toon](https://github.com/toon-format/toon)
- Built with modern web technologies
- Designed for simplicity and reliability

## 📞 Support

If you encounter any issues or have questions:

1. Check the [API Documentation](#-api-documentation)
2. Review the [Error Handling](#-error-handling) section
3. Open an issue on GitHub

## 🎯 Future Enhancements

- Support for more formats (TOML, CSV, etc.)
- Batch conversion
- File upload/download
- Syntax highlighting
- Format validation
- API rate limiting
- User authentication
- Conversion history

---

Made with ❤️ | Happy Converting!
