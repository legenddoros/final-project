# MEDP33100 - Final Project, Public Archive

## Live Demo

- [https://final-project-b4sm.onrender.com](https://final-project-b4sm.onrender.com)

## Project Overview

Pollster is an interactive web-based polling application that allows users to submit anonymous responses to a series of thought-provoking questions. The main purpose of the project is to collect user opinions in real-time and display aggregated results dynamically within the same interface. Users can submit answers one at a time by pressing "Enter" and results are immediately updated without refreshing the page.

---

## Endpoints

| Endpoint | Method | Description                                                                                                                                                                    |
| -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/polls` | GET    | Retrieves all poll responses from the database. Used to calculate and display aggregated results on the frontend.                                                              |
| `/polls` | POST   | Submits a single answer or part of an answer to a poll. Supports individual question submissions (q1, q2p1, q2p2, q3, q4, q5) and validates data before storing it in MongoDB. |

> Note: Each submission creates a new poll document with only the provided fields. Empty or invalid submissions are rejected.

---

## Technologies Used

**Languages:**

- HTML
- CSS
- JavaScript

**Libraries & Frameworks:**

- Express.js (server and routing)
- Mongoose (MongoDB schema and interaction)
- Node.js (server runtime)

**Other Tools:**

- Google Gemini for AI-assisted image generation
- Digital-7 font for retro digital display style

---

## Credits

**Third-Party Assets:**

- **Fonts:** Digital-7

**Resources & Tutorials:**

- Mozilla Developer Network (MDN) — HTML, CSS, JavaScript references
- MongoDB Documentation — Mongoose schema design and queries
- Express.js Guides — API routing and middleware

---

## Future Enhancements

- Add more questions and question types to expand the polling experience.
- Changing daily for interest.
