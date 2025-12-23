# antigravity-flatpak
Google's Antigravity IDE as a Flatpak.

Fetch the latest source URL/checksum from [Google's official Antigravity Linux Download](https://antigravity.google/download/linux).

### Build 
```
flatpak-builder --force-clean --user --install-deps-from=flathub --repo=repo --install builddir com.google.Antigravity.yml
```

### Grant filesystem access
```
flatpak override --user --filesystem=/home/user/Workspace com.google.Antigravity
```

### Run
```
flatpak run com.google.Antigravity
```
