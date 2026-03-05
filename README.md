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
Standard Linux users do not need these. However, if you are running on a **Guix system** or have specialized **NVIDIA** driver paths, apply these overrides to fix DBus, graphics, and Guix module access:

```bash
# 1. Allow access to host drivers, profiles, and configuration
flatpak override --user --device=all com.google.Antigravity
flatpak override --user --filesystem=/gnu/store:ro com.google.Antigravity
flatpak override --user --filesystem=/var/guix com.google.Antigravity
flatpak override --user --filesystem=/run/current-system:ro com.google.Antigravity
flatpak override --user --filesystem=~/.guix-profile:ro com.google.Antigravity
flatpak override --user --filesystem=~/.config/guix:ro com.google.Antigravity
flatpak override --user --filesystem=xdg-run/shepherd:ro com.google.Antigravity

# 2. Add Guix and your profile to the PATH
flatpak override --user --env=PATH="/app/bin:/usr/bin:/usr/local/bin:$HOME/.config/guix/current/bin:$HOME/.guix-profile/bin" com.google.Antigravity

# 3. Setup Guile Load Paths (for Scheme LSP support)
flatpak override --user \
  --env=GUILE_LOAD_PATH="$HOME/.config/guix/current/share/guile/site/3.0:$HOME/.guix-profile/share/guile/site/3.0:/run/current-system/profile/share/guile/site/3.0" \
  --env=GUILE_LOAD_COMPILED_PATH="$HOME/.config/guix/current/lib/guile/3.0/site-ccache:$HOME/.guix-profile/lib/guile/3.0/site-ccache:/run/current-system/profile/lib/guile/3.0/site-ccache" \
  com.google.Antigravity

# 4. Point to the host session bus (Fixes "not a symlink" errors)
# Replace '1000' with your actual UID if different (check via 'id -u')
flatpak override --user --env=DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus com.google.Antigravity

# 5. Optional: Fix Mesa/GBM pathing if drivers aren't found
flatpak override --user --env=GBM_BACKENDS_PATH=/run/current-system/profile/lib/gbm com.google.Antigravity
flatpak override --user --env=__EGL_VENDOR_LIBRARY_DIRS=/run/current-system/profile/share/glvnd/egl_vendor.d com.google.Antigravity
```

## Contributing
New releases are detected automatically every 6 hours. If you wish to propose changes to the Flatpak manifest, please open a Pull Request against the `latest` branch.
