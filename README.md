MERN CHALLENGE FRONTEND 

OVERVIEW
____________________
    This repository manages the Front End of the Mern Challenge, a project focused on the managment of 
student information through CRUD operations. 

CORE FILES
______________________
Home.tsx - Contains the majority of CRUD features, from here you can add,delete,sort, and edit student 
data which will be saved to the backend.

Add.tsx- Code for the UI of the add student modal

EditStudentModal.tsx- Allows user to click a student row too edit information that is inputted.

AppRoutes.tsx-Routes leading to the home page and the Ai chatbot page.

Aichatbot.tsx-Ui for the Ai chatbot. User message is sent from here to the google gemini LLM 
to provide a concise answer based on information from the mongo db database.


TECH STACK
____________________

React19 
Vite 
Headless UI
Tailwind CSS
React Router 
Heroicons 
clsx

CORE FEATURES
___________________

Paginated Table
Sorting(name,age,grade,school name)
Add Student 
Edit Student Information 
Student Deletion 
Email Validation 
Chatbot

INSTALLATION
___________________
git clone <repo>
cd MernChallenge-FrontEnd
npm install
npm run dev

ADDITIONAL NOTES
__________________
Download MERNCHALLENGE BACKEND and run it for main features to work as intended 
