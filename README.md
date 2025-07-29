# Authentication Microservice

A NestJS-based microservice for user authentication using Clean Architecture principles. This service provides secure authentication through CURP/password credentials or QR codes, along with JWT token validation.

## 🏗️ Architecture

This microservice follows **Clean Architecture** with clear separation of concerns:

- **Domain Layer**: Business entities, interfaces, and rules
- **Data Layer**: Repository implementations, DTOs, and database entities
- **Application Layer**: Services and controllers

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [PostgreSQL](https://www.postgresql.org/) (v12 or higher)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) (optional)
- [RabbitMQ](https://www.rabbitmq.com/) (for microservice communication)

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd auth-microservice
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=auth_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure
JWT_EXPIRATION=2h

# Encryption Configuration (must be exactly 32 characters)
ENCRYPTION_KEY=your_32_character_encryption_key

# Message Broker Configuration
BROKER_HOSTS=amqp://localhost:5672

# External Services
DISABILITY_SERVICE_URL=http://localhost:3001

# Server Configuration
PORT=3000
```

4. **Database Setup**

Create the PostgreSQL database and tables:

```sql
-- Create database
CREATE DATABASE auth_db;

-- Use the database
\c auth_db;

-- Create tables
CREATE TABLE persona (
    id_persona SERIAL PRIMARY KEY,
    primer_nombre VARCHAR(32) NOT NULL,
    segundo_nombre VARCHAR(32),
    apellido_paterno VARCHAR(32) NOT NULL,
    apellido_materno VARCHAR(32) NOT NULL,
    curp VARCHAR(18) UNIQUE NOT NULL,
    numero_ine VARCHAR(13) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    genero CHAR(1) CHECK (genero IN ('M', 'F')) NOT NULL,
    codigo_postal VARCHAR(5) NOT NULL,
    estado VARCHAR(100) NOT NULL,
    municipio VARCHAR(100) NOT NULL,
    localidad VARCHAR(100) NOT NULL,
    vialidad_nombre VARCHAR(100) NOT NULL,
    id_vialidad_tipo INTEGER NOT NULL,
    asentamiento VARCHAR(100) NOT NULL,
    id_asentamiento_tipo INTEGER NOT NULL,
    password VARCHAR(32) NOT NULL
);

CREATE TABLE rol (
    id_rol SERIAL PRIMARY KEY,
    nombre VARCHAR(64) UNIQUE NOT NULL
);

CREATE TABLE persona_rol (
    id_persona_rol SERIAL PRIMARY KEY,
    id_persona INTEGER REFERENCES persona(id_persona),
    id_rol INTEGER REFERENCES rol(id_rol)
);

-- Insert sample data
INSERT INTO rol (nombre) VALUES 
    ('Estudiante'),
    ('Profesor'),
    ('Administrador');

INSERT INTO persona (
    primer_nombre, segundo_nombre, apellido_paterno, apellido_materno,
    curp, numero_ine, fecha_nacimiento, genero, codigo_postal,
    estado, municipio, localidad, vialidad_nombre, id_vialidad_tipo,
    asentamiento, id_asentamiento_tipo, password
) VALUES 
    ('Juan', 'Carlos', 'Pérez', 'García', 
     'PEGJ900101HDFRRN01', '1234567890123', '1990-01-01', 'M', '12345',
     'Chiapas', 'Tuxtla Gutiérrez', 'Centro', 'Av. Central', 1,
     'Centro', 1, 'password123'),
    ('María', 'Elena', 'López', 'Hernández',
     'LOHM850515MCHPRR02', '2345678901234', '1985-05-15', 'F', '23456',
     'Chiapas', 'San Cristóbal', 'Zona Norte', 'Calle Principal', 2,
     'Barrio Norte', 2, 'password456');

INSERT INTO persona_rol (id_persona, id_rol) VALUES 
    (1, 1), -- Juan is Estudiante
    (2, 2); -- María is Profesor
```

## 🚀 Running the Application

### Development Mode
```bash
# Start the application in development mode
npm run start:dev
```

### Production Mode
```bash
# Build the application
npm run build

# Start in production mode
npm run start:prod
```

### Using Docker
```bash
# Build and start with Docker Compose
docker-compose up --build
```

## 📚 API Documentation

Once the application is running, access the Swagger documentation at:

```
http://localhost:3000/docs
```

## 🔌 API Endpoints

### 1. Login with Credentials
**POST** `/auth/login/credentials`

```json
{
  "curp": "PEGJ900101HDFRRN01",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userInfo": {
    "id_persona": 1,
    "username": "PEGJ900101HDFRRN01",
    "role_name": "Estudiante",
    "disability_name": "Sordomudo",
    "learning_path": "Visual Learning Path"
  }
}
```

### 2. Login with QR Code
**POST** `/auth/login/qr`

```json
{
  "encryptedToken": "73c39e42eceb378c88605ef9e08920c1:71a7dda1e0e099af..."
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userInfo": {
    "id_persona": 1,
    "username": "PEGJ900101HDFRRN01",
    "role_name": "Estudiante",
    "disability_name": "Sordomudo",
    "learning_path": "Visual Learning Path"
  }
}
```

### 3. Validate Token
**POST** `/auth/validate-token`

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "isValid": true,
  "isExpired": false,
  "payload": {
    "id_persona": 1,
    "username": "PEGJ900101HDFRRN01",
    "role_name": "Estudiante",
    "disability_name": "Sordomudo",
    "learning_path": "Visual Learning Path",
    "iat": 1639764800,
    "exp": 1639772000
  },
  "message": "Token is valid"
}
```

## 🔧 Configuration

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Run test coverage
npm run test:cov
```

## 🚀 Deployment

### Docker Deployment

1. **Build the image**
```bash
docker build -t auth-microservice .
```

2. **Run with Docker Compose**
```bash
docker-compose up -d
```

### Production Considerations

- Set `synchronize: false` in TypeORM configuration
- Use environment-specific configuration files
- Implement proper logging
- Set up monitoring and health checks
- Use secrets management for sensitive variables

## 📝 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions, please contact the development team.