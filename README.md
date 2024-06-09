# Thoughts-in-Books

## Overview

**Thoughts-in-Books** is a web application designed to manage and organize thoughts in a structured, book-like format. The application includes features such as a file and folder structure similar to Visual Studio Code, a markdown editor, and the ability to paste images directly into the markdown editor.

- [Thoughts-in-Books](#thoughts-in-books)
  - [Overview](#overview)
  - [Features](#features)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Scripts](#scripts)
  - [Technologies Used](#technologies-used)

## Features

1. **Folder Structure Management**
    - Create, edit, and delete files and folders in a structure similar to Visual Studio Code.
  
2. **Markdown Editor**
    - A rich markdown editor that allows users to write and format text easily.
  
3. **Image Pasting in Markdown Editor**
    - Paste images directly into the markdown editor for seamless integration of visual content.

## Getting Started

### Prerequisites

- Node.js
- Bun

### Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/your-username/Thoughts-in-Books.git
    cd Thoughts-in-Books
    ```

2. Install dependencies:

    ```sh
    bun install
    ```

### Scripts

- **Build**:

    ```sh
    bun run build
    ```

- **Development**:

    ```sh
    bun run dev
    ```

- **Lint**:

    ```sh
    bun run lint
    ```

- **Start**:

    ```sh
    bun run start
    ```

- **Database Migration**:

    ```sh
    bun run db:migrate
    ```

- **Database Seeding**:

    ```sh
    bun run db:seed
    ```

## Technologies Used

- **Next.js**: The React framework used for building the application.
- **Vercel Postgres**: Database management.
- **Drizzle ORM**: Used for database migrations and seeding.
- **Tailwind CSS**: For styling the application.
- **Zustand**: For state management.
- **React Markdown**: To render markdown content.
- **Radix UI**: For building accessible and customizable components.
