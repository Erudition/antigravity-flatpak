# Antigravity Quirks & Observed Behaviors

This document tracks specialized behaviors discovered during the development and use of the Antigravity Flatpak.

## 1. Agent Shell Profile Inheritance
- **Observation**: The Antigravity agent shell command tool is **hardcoded to use the terminal profile named `Internal`**.
- **Context**: Even when a different profile (e.g., `TestProfile`) is set as the global `terminal.integrated.defaultProfile.linux`, the agent will continue to spawn its command shell using the configuration specified in the `Internal` profile.
- **Benefit**: This allows a developer to set an interactive default profile (such as a `guix shell` wrapper) while maintaining a dedicated, robust host-bash integration for the agent.

## 2. Host Integration & Process Termination (Distro-Agnostic)
- **Problem**: When running inside a Flatpak, the agent's shell command tool crosses the sandbox boundary via `flatpak-spawn --host` to access host binaries (git, node, ssh). 
- **The "Portal Wall"**: Termination signals (SIGTERM) to the sandbox process often fail to propagate to the host system through the Flatpak Portal. This originally resulted in orphaned background processes (like Vite/pnpm) surviving even after an agent task was stopped.

- **The Solution: PID-Bridge Strategy**: A distro-agnostic hybrid wrapper (e.g., `~/Scripts/antigravity-host-bash.sh`) handles this by:
    1. **PID Management**: It uses a shared token in `~/.cache/antigravity/pids` to track the actual host PID.
    2. **Explicit Termination**: A signal `trap` in the sandbox script explicitly calls `flatpak-spawn --host kill <PID>` via the portal whenever the sandbox task is interrupted.
    3. **Path Injection**: On Guix systems, it automatically detects `/gnu/store` and restores host profile paths to ensure host-installed tools remain discoverable.

- **Benefits**:
    - **Reliable Lifecycle**: No orphaned processes remain on host after task termination.
    - **Fully Distro-Agnostic**: Works across Guix, Fedora, Ubuntu, and generic Linux hosts.
- **Requirements**:
    - Must handle the `-c` flag injected by the IDE's process manager.
    - Profiles should explicitly set `TERM=xterm-256color` to avoid terminal functionality warnings.
