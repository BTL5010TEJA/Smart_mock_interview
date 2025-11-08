AI Mock Interview
AI Mock Interview is an interactive platform designed to simulate real job interviews using advanced AI models. It helps users prepare for technical and HR rounds through realistic question prompts and instant performance feedback.

If you haven’t answered any mock questions yet, the system will display an accuracy score of 0/10 by default — once you attempt the interview, your personalized score and detailed feedback will appear automatically.

You can also try answering a few questions to see how the AI evaluates your responses in real time.
Make sure to update your Google Gemini API key in the config file, as the existing one may expire after some time.
Project Structure
The application is a single-page application built with React and TypeScript.

Project Result :
<img width="1920" height="1020" alt="Screenshot 2025-11-08 211737" src="https://github.com/user-attachments/assets/da1fc549-d092-461d-a205-0d92e8dd5ce7" />

<img width="1920" height="1020" alt="Screenshot 2025-11-08 211803" src="https://github.com/user-attachments/assets/59feb471-3d29-4754-99cb-c523c32bfa40" />

<img width="1920" height="1020" alt="Screenshot 2025-11-08 212156" src="https://github.com/user-attachments/assets/7a1009c3-ce9e-4594-8f93-a0668b850d8f" />

<img width="1920" height="1020" alt="Screenshot 2025-11-08 215052" src="https://github.com/user-attachments/assets/5f3b05da-800f-4f17-b0cc-e56967022f63" />

<img width="1920" height="1020" alt="Screenshot 2025-11-08 214958" src="https://github.com/user-attachments/assets/d4cc61ec-636f-41ef-81ac-42347b61b9ae" />

<img width="1920" height="1020" alt="Screenshot 2025-11-08 215009" src="https://github.com/user-attachments/assets/8329c74c-a865-47cf-9977-11d772f0581e" />

![Uploading Screenshot 2025-11-08 215052.png…]()

<img width="1920" height="1020" alt="Screenshot 2025-11-08 212324" src="https://github.com/user-attachments/assets/dd8c3f6e-c444-477c-8f00-7ec0d5534bff" />

<img width="1920" height="1020" alt="Screenshot 2025-11-08 212334" src="https://github.com/user-attachments/assets/0e2cfe81-f335-4ac4-9d73-a092f440aa2c" />

index.html: The main entry point of the application.
index.tsx: The root of the React application.
App.tsx: The main application component, managing state and flow.
components/: Contains all React components.
utils/: Contains utility functions, including session management and Gemini API interactions.
types.ts: Defines all TypeScript types used in the application.
constants.ts: Contains application-level constants.
Setup
This project uses an import map in index.html to handle dependencies, so no npm install is required for the provided libraries.
