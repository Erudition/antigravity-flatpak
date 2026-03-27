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
*   **Guix Native Support:** Automatically detects a Guix host and configures the environment (LSP paths, DBus, and graphics drivers) for a seamless experience without manual overrides.
*   **Agent Optimized:** Pre-configured with `--no-sandbox` to ensure AI agents can correctly spawn and manage processes.

## Host Shell Integration

Shell command inside the Flatpak container work well, and it's a great layer of security for Antigravity's use cases.

However, you can't really install things in it, and if you did, it would be duplicative. It's better to say, reuse your docker daemon for docker projects, or your Guix build daemon and store for Guix environments. 

To let the agent run bash on the host, you have to set up a (VSCode) terminal profile called "Internal" -- the agent ignores any other profiles or defaults, and doesn't use the "automation profile" like VSCode/Codium does.

It's recommended that you can set your terminal profile to use the provided `/app/bin/host-bash` wrapper. This script provides a distro-agnostic PID-bridge that ensures host-side processes (like Vite/pnpm) are correctly terminated when the IDE task stops. Using just `host-spawn` et. al. interferes with the ability to send termination signals, so your agent will leave tons of dev processes running while your system slows to a crawl...

Add the following to your `settings.json`:

```json
"terminal.integrated.profiles.linux": {
  "Internal": {
    "path": "/app/bin/host-bash",
    "env": {
      "TERM": "xterm-256color"
    },
    "icon": "terminal-bash"
  }
}
```

## Contributing
New releases are detected automatically every 6 hours. If you wish to propose changes to the Flatpak manifest, please open a Pull Request against the `latest` branch.