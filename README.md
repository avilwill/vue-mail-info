# Willora – Project Management Application

A refactored Vue.js application originally based on an open-source email inbox example, redesigned into a project management tool for tracking SDLC tasks.

## About Me

I am a Software Developer with a focus on full-stack development using Vue.js, Ruby on Rails, and PostgreSQL. I have experience building scalable applications, integrating APIs, and improving legacy systems for performance and maintainability.

This project is part of my ePortfolio for course CS499 and demonstrates my ability to analyze, refactor, present, and enhance an existing codebase into a more functional and user-focused application.

## Project Overview

This application allows users to manage and track tasks through different stages of development:

- Board (On Deck, In Progress, QA Testing)
- Backlog
- Priority
- Done

Tickets can be created, updated, and moved between stages to support workflow organization and decision making.

## Enhancements and Contributions

I transformed the original inbox application into a project management system by:

- Refactoring the UI to support SDLC task tracking with a table, instead of messaging
- Fixing modal issues (preventing multiple instances and ensuring proper close behavior)
- Replacing inconsistent action buttons with a reusable dropdown component
- Creating reusable components to reduce code duplication
- Using props to dynamically control behavior across views
- Implementing ticket filtering logic based on active page (Board, Backlog, Priority, Done)
- Improving overall usability and consistency of the interface

These changes improved maintainability, scalability, and user experience.

## Tech Stack

- Vue.js
- JavaScript (ES6)
- HTML5 / CSS
- Node.js (if applicable)

Code Review: 

## Getting up and Running

``` bash
# Install the dependencies
npm install

# Serve with hot reload at http://localhost:8080
npm run dev

# Start the API server at http://localhost:3001
npm run server

# Build for production with minification
npm run build
```
