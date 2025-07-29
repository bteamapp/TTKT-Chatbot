##### Based on ideas and supported by our talented programmers at VDJGO! and bTeam Developer
---

# TTKT-Chatbot

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Project Status](https://img.shields.io/badge/status-production_ready-brightgreen)](https://github.com/bteamapp/TTKT-Chatbot)
[![Node.js](https://img.shields.io/badge/Node.js-18.x+-43853d.svg)](https://nodejs.org/)
[![Render](https://img.shields.io/badge/Hosted%20on-Render-46E3B7.svg)](https://render.com)

**TTKT-Chatbot** is an intelligent, context-aware AI assistant designed for Blogger, or plain HTML-based Learning Management Systems (LMS). It enhances the learning experience by providing an embeddable chat widget that allows students to ask questions and receive instant, relevant answers based on the content of the specific blog post they are viewing.

The entire service, including the responsive chat UI and the robust backend API, is built with Node.js and designed for seamless, single-instance deployment on [Render](https://render.com).

## Table of Contents

- [Architectural Overview](#architectural-overview)
- [How It Works](#how-it-works)
- [Key Features](#key-features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [Deployment on Render](#deployment-on-render)
- [Integration with Blogger](#integration-with-blogger)
- [API Endpoints](#api-endpoints)
- [Security](#security)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

## Architectural Overview

The system is designed for simplicity, security, and scalability. The data flow ensures that the AI's context is always relevant to the article the student is reading.

```mermaid
graph TD
    subgraph Student_Browser
        A[User on Blogger Post] --> B{Clicks AI Button}
        B --> C[Iframe Loads UI from Render]
    end

    subgraph Render_Service_NodeJS
        D[Chat UI (EJS/CSS/JS)]
        E[API Backend (Express)]
        F[Security Middleware<br/>(CORS, Rate Limit, Validator)]
        G[Services<br/>(Crawler, Gemini)]
        H[Config<br/>(Allowed Domains)]
    end

    subgraph External_Services
        I[Google Gemini API]
        J[Blogger Post Content]
    end

    C -- "GET /chat?url=..." --> F
    F -- "URL Validated" --> E
    E --> D --> C

    C -- "User sends question<br/>POST /api/ask" --> F
    F -- "Request Validated" --> E
    E -- "Instructs Crawler" --> G
    G -- "Fetches HTML" --> J
    G -- "Extracts Content &<br/>Forwards to Gemini" --> I
    I -- "Returns Answer" --> G
    G -- "Sends response back" --> E
    E -- "Returns JSON to UI" --> C

```

## How It Works

1.  **User Interaction**: A student clicks the "AI Assistant" button on a blog post.
2.  **Iframe Initialization**: JavaScript on the Blogger site creates an `iframe` that points to the Render application's `/chat` endpoint, passing the current post's URL as a query parameter.
3.  **UI & Validation**: The Render app receives the request. It first validates if the source URL's domain is on the `allowedDomains` whitelist. If valid, it serves the responsive chat interface.
4.  **Asking a Question**: The student types a question into the chat UI. The frontend sends a `POST` request to the `/api/ask` endpoint, including the question and the original post URL.
5.  **Content Crawling**: The backend receives the request, re-validates the URL, and then uses a crawler (`axios` + `cheerio`) to fetch the live content from the blog post URL. It extracts only the main article text, stripping away HTML, sidebars, and footers.
6.  **AI Interaction**: The extracted article content and the student's question are sent to the Google Gemini API with a carefully crafted system prompt. This prompt instructs the AI to act as a helpful tutor and answer questions based *only* on the provided text.
7.  **Displaying the Answer**: The AI's response is sent back to the chat UI and displayed to the student.

## Key Features

- **Context-Aware Q&A**: AI is initialized in real-time with the specific article's content, ensuring highly relevant and accurate answers.
- **Production-Ready Security**:
  - **Domain Whitelisting (CORS & URL)**: Prevents unauthorized sites from embedding the chat or using the API.
  - **Rate Limiting**: Protects the service from abuse and spam.
- **All-in-One Deployment**: Frontend and backend are served from a single, easy-to-manage Node.js instance on Render.
- **Stateless & Scalable**: Each request is self-contained, making the application stateless and horizontally scalable.
- **Zero-Config on Blogger**: Simple copy-paste integration for the blog administrator.
- **Responsive UI**: The chat interface works great on desktop and mobile, ready for future native app integration.
- **Health Checks**: Includes a `/healthz` endpoint for service monitoring.

## Project Structure

The project follows a clean and maintainable structure.

```
ttkt-chatbot/
├── public/                 # Frontend static assets
│   ├── css/style.css
│   └── js/chat.js
├── views/                  # EJS templates for server-side rendering
│   └── chat.ejs
├── src/
│   ├── services/
│   │   ├── crawler.js      # Module for crawling and extracting content
│   │   └── gemini.js       # Module for interacting with the Gemini API
│   ├── middleware/
│   │   └── validator.js    # Middleware for URL validation
│   └── routes/
│       └── api.js          # API and view routes
├── config.js               # Centralized configuration (whitelists, rate limits)
├── .env                    # Environment variables (API keys)
├── .env.example            # Example environment file
├── server.js               # Main Express server entry point
└── package.json
```

## Getting Started

Follow these steps to get a local copy up and running.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18.x or later)
-   `npm` or a compatible package manager
-   A **Google Gemini API Key**. Get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/bteamapp/TTKT-Chatbot.git
    cd TTKT-Chatbot
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    -   Create a `.env` file in the root directory by copying the example:
        ```sh
        cp .env.example .env
        ```
    -   Open the new `.env` file and add your Gemini API key:
        ```dotenv
        # .env
        GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
        ```
    -   Go to the  `Environment ` tab, add the  `GEMINI_API_KEY ` variable with the value of your  `API key `.

## Configuration

All major settings are located in `config.js`. You can modify this file to suit your needs.

-   `allowedDomains`: An array of domains (e.g., `'yourblog.blogspot.com'`) that are permitted to use the chatbot.
-   `rateLimit`: Configuration for `express-rate-limit` to prevent abuse.
-   `contentSelector`: The CSS selector used to find the main article content on your blog. You may need to inspect your blog's HTML to find the correct selector (e.g., `.post-body`, `article`, `#main-content`).

```javascript
// config.js (example)
module.exports = {
    allowedDomains: [
        'ttkntc.blogspot.com',
        'localhost' // For local testing
    ],
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100,
        // ...
    },
    // IMPORTANT: Change this to match your Blogger theme's structure
    contentSelector: '.post-body' 
};
```

## Running the Project

Start the local development server:

```sh
npm start
```

The application will be available at `http://localhost:3000`. You can test it by navigating to:
`http://localhost:3000/chat?url=<a_valid_whitelisted_url>`

## Deployment on Render

This project is optimized for a zero-hassle deployment on Render.

1.  **Push your code to a GitHub repository.**
2.  On the Render Dashboard, click **New +** > **Web Service**.
3.  Connect your GitHub repository.
4.  Configure the service:
    -   **Name:** A unique name (e.g., `ttkt-chatbot`).
    -   **Environment:** `Node`.
    -   **Build Command:** `npm install`.
    -   **Start Command:** `node server.js`.
5.  Go to the **Environment** tab and add your `GEMINI_API_KEY` as a secret environment variable.
6.  Click **Create Web Service**. Render will build and deploy your application. Once complete, it will be live at `your-app-name.onrender.com`.

## Integration with Blogger

1.  Go to your **Blogger Dashboard** > **Theme** > **Customize** > **Edit HTML**.
2.  Scroll to the bottom and paste the following code snippet right before the closing `</body>` tag.
3.  **Important**: Replace `https://your-app-name.onrender.com` with your actual Render application URL.

```html
<!-- TTKT-Chatbot Integration -->
<style>
  .ai-chat-button { position: fixed; bottom: 20px; right: 20px; background-color: #007bff; color: white; width: 60px; height: 60px; border-radius: 50%; border: none; cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.2); font-size: 24px; font-weight: bold; z-index: 999; display: flex; align-items: center; justify-content: center; }
  .ai-chat-iframe-container { position: fixed; bottom: 90px; right: 20px; width: 90%; max-width: 400px; height: 80%; max-height: 600px; border: none; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); display: none; z-index: 1000; }
</style>

<button class='ai-chat-button' onclick='toggleAIChat()'>AI</button>
<div id='ai-chat-container'></div>

<script>
//<![CDATA[
  function toggleAIChat() {
    var container = document.getElementById('ai-chat-container');
    if (container.innerHTML === '') {
      var iframe = document.createElement('iframe');
      iframe.className = 'ai-chat-iframe-container';
      iframe.src = 'https://your-app-name.onrender.com/chat?url=' + window.location.href;
      iframe.style.display = 'block';
      container.appendChild(iframe);
    } else {
      var iframe = container.querySelector('iframe');
      iframe.style.display = (iframe.style.display === 'none' ? 'block' : 'none');
    }
  }
//]]>
</script>
```

## API Endpoints

-   `GET /chat?url=<post_url>`
    -   Serves the main chat UI inside the iframe.
    -   The `url` parameter is validated by middleware.
-   `POST /api/ask`
    -   The primary endpoint for handling user questions.
    -   Expects a JSON body: `{ "url": "<post_url>", "question": "<user_question>" }`.
    -   Performs crawling and AI interaction.
    -   This endpoint is rate-limited.
-   `GET /healthz`
    -   A simple health check endpoint used by Render for monitoring. Returns `200 OK` with `{ "status": "ok" }`.

## Security

-   **URL Validation**: A dedicated middleware (`src/middleware/validator.js`) ensures that only URLs from whitelisted domains in `config.js` can be processed.
-   **CORS**: The `cors` package is configured to only allow requests from whitelisted domains, preventing other websites from making client-side calls to your API.
-   **Rate Limiting**: `express-rate-limit` is applied to the `/api/ask` endpoint to prevent brute-force attacks and resource exhaustion.

## Roadmap


-   [ ] **Conversation History**: Implement session-based chat history to allow for follow-up questions without re-stating context, and sync the chat with our back-end server for multi-devices integration.
-   [ ] **Admin Dashboard**: A simple UI to view usage statistics and manage blocked IPs.
-   [ ] **Markdown support**: Add support for rendering AI-generated responses in Markdown format. This will enhance the readability and formatting of the output, especially for code snippets, lists, links, and styled text.
-   [ ] **Mobile API**: Develop a dedicated API to serve the mobile application. This API will be decoupled from the existing web UI to ensure optimized performance, tailored data structures, and mobile-specific workflows.


## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

## License

This project is distributed under the GNU General Public License v3.0. See the `LICENSE` file for more information.
