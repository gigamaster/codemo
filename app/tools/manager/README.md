# Codemo Config Manager

A UI management tool for Codemo launcher and search configurations.

## Features

- **Launcher Management**: Create, read, update, and delete web app launcher entries
- **Search Management**: Manage searchable pages configuration
- **Backup**: Download timestamped backup files of your configurations
- **GitHub Integration**: Save changes directly to GitHub using the existing authentication workflow

## Usage

1. Open the tool in your browser at `/tools/manager/`
2. Switch between Launcher and Search modes using the tabs
3. Use the toolbar buttons to:
   - Create new entries
   - Edit existing entries
   - Delete entries
   - Backup configurations
   - Save changes to GitHub

## How It Works

### Editing
- The tool loads the current [launcher.json](file://d:\codemo\app\asset\launcher.json) and [search.json](file://d:\codemo\app\asset\search.json) files
- You can modify entries through the intuitive UI
- Changes are kept in memory until saved

### Saving
- Click "Save to GitHub" to open GitHub's editor with the current configuration
- Paste the updated JSON content into the editor
- Commit the changes through GitHub's interface

### Backup
- Click "Backup" to download a timestamped copy of the current configuration
- Backups are saved as JSON files to your local machine

## Technical Details

- Built with Alpine.js and Tailwind CSS
- No server-side dependencies
- Works entirely client-side
- Integrates with existing Codemo workflow