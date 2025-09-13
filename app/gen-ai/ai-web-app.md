# AI-Web-App

## AI Models and Prompt Manager


This web application serves as a unified hub for managing AI tools and local language models.  
Users can add and organize web-based AI applications by URL (note: applications must support  
CORS for proper iframe embedding).  
The app seamlessly connects to local LLM instances running on LM Studio, allowing you to chat  
with your own models nd open code blocks in Livecodes.

Features include a built-in prompt library for saving and reusing frequently used prompts,  
and comprehensive settings management for API endpoints and model configurations.  
All settings and data are stored locally in your browser's localStorage, ensuring privacy  
and persistence across sessions. You can export and import your settings and prompts.  


### Key Features

- <strong>Web AI Applications:</strong> Add and manage web-based AI application URLs with iframe integration
- <strong>Local LLM Support:</strong> Connect to local LM Studio instances for private AI conversations
- <strong>Prompt Management:</strong> Built-in library for saving and organizing frequently used prompts
- <strong>Settings Persistence:</strong> All configurations saved locally in browser localStorage
- <strong>Responsive Design:</strong> Mobile-friendly interface with collapsible sidebar navigation
- <strong>Multiple Endpoints:</strong> Support for various AI model APIs and services

### Important Notes

- <strong>CORS Requirement:</strong> Web applications must support Cross-Origin Resource Sharing (CORS) to load properly in iframes
- <strong>Local Storage:</strong> All data is stored locally - clearing browser data will remove your settings and prompts
- <strong>LM Studio Connection:</strong> Ensure LM Studio is running and accessible at the configured URL for local AI features
- <strong>Privacy:</strong> No data is sent to external servers - everything runs locally in your browser

### Getting Started

- Configure your LM Studio URL in Settings if using local AI models
- Add web AI applications through the Settings panel
- Create and organize prompts in the Prompts library
- Switch between different AI tools using the dropdown in the header
- Backup your settings and prompts (export and import json)
