# Dockerized Application

## How to Build and Run

# Currency Converter - Dockerized Application

## Prerequisites

- Install [Docker](https://docs.docker.com/get-docker/) on your machine.

## How to Build and Run the Docker Container


1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Wassword/currency_converter.git
   cd currency_converter 



### 2. **Ensure Your `.dockerignore` File Is Set:**
The `.dockerignore` file is important for excluding unnecessary files when building the Docker image (such as `node_modules`, temporary files, etc.). Here’s a quick check for what it should include:

```bash
node_modules
npm-debug.log
.dockerignore
.git



Great! Now that your Dockerized application is running successfully, here’s a step-by-step guide on what to do next to finalize your assignment:

1. Update Your README.md File:
Make sure your README.md file contains clear instructions on how to build and run the Docker container. Here’s an example template you can use:

markdown
Copy code
# Currency Converter - Dockerized Application

## Prerequisites

- Install [Docker](https://docs.docker.com/get-docker/) on your machine.

## How to Build and Run the Docker Container

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-repo/currency_converter.git
   cd currency_converter
Build the Docker Image:

bash
Copy code
docker build -t app-image .
Run the Docker Container:

bash
Copy code
docker run -p 3000:3000 app-image
Access the Application: Open your browser and navigate to:

arduino
Copy code
http://localhost:3000
Optional: Using Docker Compose: If you have a docker-compose.yml file, you can run:

bash
Copy code
docker-compose up
Technologies Used
Node.js
SQLite
Docker
javascript
Copy code

### 2. **Ensure Your `.dockerignore` File Is Set:**
   The `.dockerignore` file is important for excluding unnecessary files when building the Docker image (such as `node_modules`, temporary files, etc.). Here’s a quick check for what it should include:

```bash
node_modules
npm-debug.log
.dockerignore
.git

Build the Docker Image:

bash
Copy code
docker build -t app-image .
Run the Docker Container:

bash
Copy code
docker run -p 3000:3000 app-image
Access the Application: Open your browser and navigate to:

arduino
Copy code
http://localhost:3000

3. Test Your Application:
Before submitting, ensure that:

The Docker container builds correctly with docker build -t app-image ..
The container runs as expected with docker run -p 3000:3000 app-image.
You can access the app via http://localhost:3000.
