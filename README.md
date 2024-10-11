# Technical Assessment

## Description
Svelte frontend and NodeJS web backend in Javascript

### Features
1. Upload a CSV file with appropriate feedback to the user on the upload progress.

2. List the data uploaded with pagination.

3. Search data from the uploaded file. The web application should be responsive while listing of data and searching of data.

---

## Prerequisites
Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/en/) (version 20.10.0 or later)
- [npm](https://www.npmjs.com/get-npm) (version 10.2.3 or later)
- [MongoDB](https://www.mongodb.com/)

## Setup and Installation

### 1. Clone the repository:
```bash
git clone https://github.com/your-username/project-name.git
cd project-name
```
### 2. Install dependencies:
```
npm install
```
### 3. Environment Variables:
```
PORT=<port>
NODE_ENV=development
DB_LOCAL_URI=<mongodb_connection_url>
```
### 4. Run the project:
```
npm run dev
```
### 5. Running Tests:
```
npm test
```
## Assumptions
1. Only CSV file is accepted
