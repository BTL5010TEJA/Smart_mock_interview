# AI Mock Interview

A voice-based mock interview application that provides AI-powered feedback and evaluation on your answers.

## Project Structure

The application is a single-page application built with React and TypeScript.

-   `index.html`: The main entry point of the application.
-   `index.tsx`: The root of the React application.
-   `App.tsx`: The main application component, managing state and flow.
-   `components/`: Contains all React components.
-   `utils/`: Contains utility functions, including session management and Gemini API interactions.
-   `types.ts`: Defines all TypeScript types used in the application.
-   `constants.ts`: Contains application-level constants.

## Setup

This project uses an import map in `index.html` to handle dependencies, so no `npm install` is required for the provided libraries.

## Environment Variables

To run this application, you need to set up a Google Gemini API key.

1.  Obtain an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  Your development environment must provide this key as an environment variable named `API_KEY`.

The application is configured to load this `API_KEY` from the environment. If the key is not found, the application will show an error message.

## Deployment

When deploying this application, ensure that your hosting provider is configured to serve from the project's root directory where `index.html` is located. Most modern static site hosting platforms (like Vercel, Netlify, or Firebase Hosting) do this by default.

The build process must be configured to make the `API_KEY` environment variable available on the client-side. The application expects to find it at `process.env.API_KEY`.