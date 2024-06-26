# This is a Vector Search, RAG and Multimodal Search demo built with [Weaviate](https://weaviate.io/), [Cohere](https://cohere.com/), [Open AI](https://openai.com/en-GB/) and [Angular 18](https://angular.dev/).

This repo should help get you started developing with Weaviate and Angular.

![Logo Gif](https://github.com/weaviate-tutorials/angular-search/blob/main/angular.gif)

## 🐥 Get Started

First, clone the project with the command below

```bash
git clone https://github.com/weaviate-tutorials/angular-search
```

The repository lets you do three things

1. Run the Angular frontend and Nest.js backend.
2. Create a Weaviate Sandbox
3. Import images, audio and videos into your Weaviate database.
4. Search 🔍

## 🚀 Run your Angular Application.

### Angular CLI

```
npm install -g @angular/cli@latest
```

### Nest.js

```
npm i -g @nestjs/cli
```

## 🏗️ Create a Weaviate Instance (Using Vertex AI)

Create a Weaviate instance on Weaviate Cloud Services as described in [this guide](https://weaviate.io/developers/weaviate/quickstart#step-2-create-an-instance)


### Get VertexAI token with GCloud CLI

```bash
gcloud auth print-access-token
```

And update `GOOGLE_API_KEY` in `backend/.env` file.


### 🦿 Create a `.env` file and add the following keys

Add `.env` file to the backed folder with the following values:

```
export WEAVIATE_HOST_URL=your-weaviate-cloud-url
export WEAVIATE_ADMIN_KEY=your-weaviate-cloud-apikei
export WEAVIATE_READ_KEY=your-weaviate-cloud-apikei
export COHERE_API_KEY=your-cohere-key
export GOOGLE_API_KEY=your-google-vertex-key
```

> note: you can skip `GOOGLE_API_KEY` if you are not going to use multimodal search.

- You can get your Google keys in your [Vertex AI settings](https://console.cloud.google.com/apis/credentials)
- You can get your Weaviate details in your [Weaviate dashboard](https://console.weaviate.cloud/dashboard) under sandbox details
- You can get your Open AI keys in your [Open AI settings](https://platform.openai.com/account/api-keys)
- You can get your Cohere keys in your [Cohere settings](https://dashboard.cohere.com/api-keys)

## 🏃🏽‍♂️Run the project

### Backend

```
cd backend
```

**Run in dev mode with livereload.**

```
yarn start:dev
```

## 📩 Importing Data
> Before you can import data, add media files to their respective media type folder in the `public/assets` folder. 

With your data in the right folder, run the backend and call `http://localhost:3000/setup/createWiki` to create a collection and then  `http://localhost:3000/setup/importData` to import data. 


This may take a minute or two.


### Frontend

```
cd frontend
ng serve -o
```

aaannd search away!!


## 📚 Resources
Learn more about Weaviate applications
- [Weaviate Generative Search](https://weaviate.io/developers/weaviate/modules/reader-generator-modules/generative-openai)
- [Vector Search](https://weaviate.io/developers/weaviate/search/similarity)
  
## 🤷🏾‍♂️ Troubleshooting
- Check out the [Weaviate Docs](https://weaviate.io/developers/weaviate)
- Open an [Issue](https://github.com/malgamves/vue-vector-search-demo/issues/new)
   




