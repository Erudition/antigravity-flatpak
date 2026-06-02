# Antigravity Flatpak: Development Guidelines & Constraints

This document outlines the architecture and requirements for the Google Antigravity Flatpak project to ensure future Gemini CLI sessions do not introduce breaking changes.

## 1. Project Architecture (GitOps)
The project uses a 3-workflow GitOps pipeline targeting the `latest` branch:
- **`checker.yml`**: Polls the Google update APIs for BOTH the Agent Manager and the IDE every 6 hours. If a new version is found, it creates a new branch and opens a Pull Request using `BOT_TOKEN`.
- **`ci.yml`**: Triggers on PRs to build and verify the Flatpak. Successful bot PRs are automatically approved and merged.
- **`cd.yml`**: Triggers on pushes to `latest` (merges). It builds the app, scrapes official release notes, creates a GitHub Release, and deploys the OSTree repository to GitHub Pages.

## 2. Manifest Constraints (`com.google.Antigravity.yml`)
- **Distro-Agnosticism**: The YAML manifest MUST remain generic. Do not hardcode specific usernames or mandatory Guix-only paths in `finish-args`.
- **Dual App Architecture (2.0+)**: Antigravity 2.x decouples the "Agent Manager" and the "IDE" into separate downloads. The manifest MUST bundle both natively rather than relying on the post-install setup wizard (which fails in the sandbox). The `/app/bin/antigravity` wrapper handles routing (launching the IDE if `--ide` is passed, else the Agent Manager).
- **Guix Auto-Detection**: Guix-specific environment setup (DBus, PATH, Guile Load Paths, Graphics drivers) MUST be handled dynamically in the `/app/bin/antigravity` startup script by checking for the existence of `/gnu/store`.
- **Host Integration**: Tools like `git`, `node`, `pnpm`, etc., MUST be wrapped using `flatpak-spawn --host bash -l -c '[ -f ~/.bashrc ] && . ~/.bashrc; exec <cmd> "$@"'`. The `exec` prefix is mandatory for correct process management by the IDE. For the agent's shell, use the `/home/adroit/Scripts/antigravity-host-bash.sh` wrapper which handles `-c` injection correctly.
- **Sandbox Stability**: 
    - Use `--nosocket=session-bus` to bypass the broken symlink logic on non-systemd hosts.
    - Use `--no-sandbox` for the Electron binary to support unpatched sandbox helpers.
    - Mount `/var/guix` as read-write to allow `guix shell` to function inside the terminal.

## 3. Build & Distribution
- **CI Builder**: Always use `--disable-rofiles-fuse` in GitHub Actions to avoid Portal/FUSE errors.
- **OSTree Repo**: The project hosts a self-updating repository on GitHub Pages. `flatpak build-update-repo --generate-static-deltas --prune repo` must be run after every build to maintain the index and summary files.
- **Landing Page**: The `index.html` on GitHub Pages should maintain a Flathub-style aesthetic and support the `flatpak+https://` protocol for one-click installs.
- **AppStream**: Metadata in `com.google.Antigravity.metainfo.xml` must be kept in sync with the manifest to ensure graphical software centers display the app correctly.

## 4. Release Automation
- **Changelog Scraper**: The `.github/scripts/extract_changelog.js` script is a robust regex-based scraper for Google's obfuscated JS bundles. Do not rely on minified variable names (like `u7`); use anchor strings like `"Google Antigravity Changelog"` instead.
- **Idempotency**: Pushes to `latest` should update existing Releases if the version number hasn't changed (allowing for recipe-only fixes).

## 5. Local Overrides (Host-side)
For the developer's Guix/NVIDIA system, the following local overrides are required (documented in README.md):
```bash
flatpak override --user --device=all com.google.Antigravity
flatpak override --user --filesystem=/gnu/store:ro com.google.Antigravity
flatpak override --user --filesystem=/var/guix com.google.Antigravity
flatpak override --user --filesystem=/run/current-system:ro com.google.Antigravity
flatpak override --user --filesystem=~/.guix-profile:ro com.google.Antigravity
flatpak override --user --filesystem=~/.config/guix:ro com.google.Antigravity
flatpak override --user --filesystem=xdg-run/shepherd:ro com.google.Antigravity
```

## 7. Agent Shell Integration (Flatpak/Guix)
- **Constraint**: The Antigravity agent MUST use the `Internal` terminal profile.
- **Signal Integrity**: To ensure the IDE can terminate host processes (like Vite/pnpm), the `Internal` profile MUST NOT use `flatpak-spawn --host` for the shell itself if it remains in the same process group. Instead, use a **robust, distro-agnostic wrapper** (e.g. `~/Scripts/antigravity-host-bash.sh`) that manages process lifecycle via a **PID-file bridge** if it crosses the portal boundary.
- **Environment**: Explicitly set `TERM=xterm-256color` in terminal profiles to avoid functionality warnings.

## 8. Debugging & Missing Information
- **Constraint**: Do not work around missing information. If you require critical data (e.g., CI logs, system status) and cannot access it due to permissions or technical errors, you MUST stop and report the failure immediately rather than attempting speculative fixes or workarounds.

