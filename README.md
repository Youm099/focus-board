# React + Vite
# Focus Board — Personal Task & Study Tracker

A clean, responsive full-stack dashboard layout built with React.js designed to help students track study goals, organize daily tasks by category, and manage time using an integrated Pomodoro timer.


##  Run Instructions

Follow these steps to install and run the application locally on your machine:

1. Clone or download the project files into your local directory.
2. Open your terminal inside the root project directory (`reactAppTracker`).
3. Install the dependencies by running:
   ```bash
   npm install
   npm start
4. Open http://localhost:3000 in your browser to view the dashboard, or the port specified.

## Project Structure & State Approach

Component Architecture
The dashboard is split logically into two main visual columns under a full-width global header to optimize screen real estate:

Header Line: Houses the Focus Board primary title and uppercase branding subtitle.

Left Column: Dedicated to productivity metrics and time tracking. It groups the dynamic SVG circular completion chart, category progress bars, and the full Pomodoro countdown block.

Right Column: Contains the core task management layout, including a quick-add form interface, status toolbar filters (All, Active, Completed), sorting selectors, and the main task items list.

State & Persistent Data Management
The app utilizes standard React hooks linked with browser web storage APIs:

useState: Reads from the browser's localStorage right when the component mounts. If previous user data exists, it handles the JSON parsing and populates the dashboard layout. If the notebook cache is empty, it seamlessly populates 5 default academic items.

useEffect: Any operation—including task creation, toggle completions, title revisions, or deletions—instantly pushes an updated text string into long-term browser storage.

 Walkthrough, Reflections & Next Steps
Development Choices
To maintain a tight, predictable development window, the app layout relies heavily on clean Flexbox alignment strategies. This allowed for building custom inline editing UI views directly within the individual task rows and kept the styling easy to manage.

Successes & Challenges
Proud of: Integrating fluid inline edit modes where clicking a task's edit button replaces the label text with an inline input form dynamically without disturbing neighboring task items.

Tricky Elements: Managing async countdown mechanics inside React's execution context. Building a stable Pomodoro interval loop required writing clean cleanups within useEffect to prevent browser resource leaks.

Future Horizons
With additional development iterations, the project would benefit from:

Supabase Integration: Transitioning local storage snapshots over to a true persistent backend DB tier, secured via Row Level Security (RLS) policies.

Adding a background noise effect to accompany the pomodoro timer.

Effort & Tools Disclosure
Total Time Invested: 6~7 hours of active styling, engineering, and debugging.

AI Tooling Note: Gemini was utilized as an AI coding collaborator to assist with architectural layout design advice, parsing state hook concepts clearly, and laying out the blueprint to implement clean local storage code synchronization blocks.

