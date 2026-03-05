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

## Local Overrides (e.g. for Guix / NVIDIA)
Standard Linux users do not need these. However, if you are running on a **Guix system** or have specialized **NVIDIA** driver paths, apply these overrides to fix DBus and graphics errors:

```bash
# 1. Allow access to host drivers and profiles
flatpak override --user --device=all com.google.Antigravity
flatpak override --user --filesystem=/gnu/store:ro com.google.Antigravity
flatpak override --user --filesystem=/var/guix:ro com.google.Antigravity
flatpak override --user --filesystem=/run/current-system:ro com.google.Antigravity
flatpak override --user --filesystem=~/.guix-profile:ro com.google.Antigravity

# 2. Point to the host session bus (Fixes "not a symlink" errors)
flatpak override --user --env=DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus com.google.Antigravity

# 3. Optional: Fix Mesa/GBM pathing if drivers aren't found
flatpak override --user --env=GBM_BACKENDS_PATH=/run/current-system/profile/lib/gbm com.google.Antigravity
flatpak override --user --env=__EGL_VENDOR_LIBRARY_DIRS=/run/current-system/profile/share/glvnd/egl_vendor.d com.google.Antigravity
```

## Contributing
New releases are detected automatically every 6 hours. If you wish to propose changes to the Flatpak manifest, please open a Pull Request against the `latest` branch.
