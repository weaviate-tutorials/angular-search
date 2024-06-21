# angular-search


## Installation

### Angular CLI

```
npm install -g @angular/cli@latest
```

### NestJS

```
npm i -g @nestjs/cli
```

## Environment variables

Add `.env` file to the backed folder with the following values:

```
export WEAVIATE_URL=your-weaviate-cloud-url
export WEAVIATE_ADMIN_KEY=your-weaviate-cloud-apikei
export WEAVIATE_QUERY_KEY=your-weaviate-cloud-apikei
export COHERE_API_KEY=your-cohere-key
export GOOGLE_API_KEY=your-google-vertex-key
```

> note: you can skip `GOOGLE_API_KEY` if you are not going to use multimodal search.

## Run the project

### Backend

```
cd backend
```

**Run in dev mode with livereload.**

```
yarn start:dev
```

### Frontend

```
cd frontend
ng serve -o
```

## Multimodal setup

### Get VertexAI token with GCloud CLI

```bash
gcloud auth print-access-token
```

And update `GOOGLE_API_KEY` in `backend/.env` file.
```
