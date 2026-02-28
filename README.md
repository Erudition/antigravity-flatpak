# Google Antigravity Flatpak

An unofficial Flatpak distribution of Google's Antigravity IDE - an agentic development platform for the agent-first era.

## Installation

### Method 1: Graphical (Recommended)
You can install the app directly from your browser by clicking the **Install** button on the project's landing page:

**[🚀 Install Google Antigravity](https://Erudition.github.io/antigravity-flatpak/)**

### Method 2: Command Line
Add the remote repository and install:

```bash
# 1. Add the repository
flatpak remote-add --user --if-not-exists antigravity https://Erudition.github.io/antigravity-flatpak/antigravity.flatpakrepo

# 2. Install the app
flatpak install antigravity com.google.Antigravity
```

## Features
*   **Self-Updating:** Automatically tracks and builds the latest stable releases from Google.
*   **Host Integration:** Includes wrappers for `git`, `node`, `docker`, and `chromium` to seamlessly interact with your host system.
*   **Agent Optimized:** Pre-configured with `--no-sandbox` to ensure AI agents can correctly spawn and manage processes in specialized environments like Guix.

## Local Overrides (e.g. for Guix)
If you are running on a Guix system or need specialized filesystem access, you can apply overrides via Flatseal or the command line:

```bash
flatpak override --user --filesystem=/gnu/store:ro com.google.Antigravity
flatpak override --user --env=DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus com.google.Antigravity
```

## Contributing
New releases are detected automatically every 6 hours. If you wish to propose changes to the Flatpak manifest, please open a Pull Request against the `latest` branch.
