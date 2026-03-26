# Instagram Follower Tracker

A React application that helps you analyze your Instagram network by comparing your followers and following lists to identify accounts that don't follow you back.

## Features

- Upload Instagram data export files (followers_1.json and following.json)
- Compare lists to find non-followers
- Interactive queue management
- Mark accounts as unfollowed with undo functionality
- Responsive design with Tailwind CSS
- Local storage persistence

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone or download this repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

### Running the Application

Start the development server:

```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

### Building for Production

```bash
npm run build
```

This will create a `build` folder with the production-ready files.

## How to Use

1. Export your Instagram data from the Instagram app/website
2. Upload the `followers_1.json` file
3. Upload the `following.json` file
4. Click "Extract & Compare" to analyze your network
5. Review the queue of accounts that don't follow you back
6. Click on profiles to mark them as unfollowed
7. Use the "Undo" button in the sidebar to restore accounts to the queue

## Data Privacy

This application runs entirely in your browser. Your Instagram data files are processed locally and are not sent to any server. Data is stored in your browser's local storage for persistence.