export function generateMacPhotosImportScript(destinationAlbum = 'Imported from Google Photos'): string {
  return `#!/bin/zsh
# ==============================================================================
# Google Photos -> Apple Photos & iCloud Background Sync Daemon for MacBook
# Automatically ingests photos into Apple Photos and syncs with iCloud Photos
# ==============================================================================

set -e

SOURCE_DIR="$HOME/Downloads/GooglePhotosSync"
ALBUM_NAME="${destinationAlbum}"

echo "🍏 Starting Google Photos to Apple Photos / iCloud sync..."
echo "📂 Source directory: $SOURCE_DIR"
echo "📁 Destination iCloud Album: $ALBUM_NAME"

if [ ! -d "$SOURCE_DIR" ]; then
    echo "Creating source sync staging directory at $SOURCE_DIR..."
    mkdir -p "$SOURCE_DIR"
fi

# Use macOS osascript to automate Apple Photos native import
osascript <<EOF
tell application "Photos"
    activate
    -- Check if album exists, if not create it
    if not (exists album "$ALBUM_NAME") then
        make new album named "$ALBUM_NAME"
    end if
    set targetAlbum to album "$ALBUM_NAME"
    
    set sourceFolder to POSIX file "$SOURCE_DIR" as alias
    tell application "Finder"
        set fileList to every file of folder sourceFolder
    end tell
    
    repeat with aFile in fileList
        set posixPath to POSIX path of (aFile as alias)
        try
            import POSIX file posixPath into targetAlbum skip check duplicates yes
        on error errMsg
            log "Failed importing: " & posixPath & " (" & errMsg & ")"
        end try
    end repeat
end tell
EOF

echo "✅ Import completed! macOS Photos will now quietly sync to iCloud in the background."
`;
}

export function generateICloudDriveSyncScript(folderName = 'Google_Photos_Archive'): string {
  return `#!/bin/zsh
# ==============================================================================
# Google Photos -> Apple iCloud Drive Sync Automation for MacBook
# Moves or stages exported Google Photos into native iCloud Drive folder
# and keeps the Mac awake with 'caffeinate' while the cloud daemon syncs.
# ==============================================================================

set -e

# Target iCloud Drive folder in native macOS container
ICLOUD_DRIVE_TARGET="$HOME/Library/Mobile Documents/com~apple~CloudDocs/${folderName}"
DOWNLOADS_SOURCE="$HOME/Downloads/GooglePhotosExport"

echo "🍏 Initializing Google Photos to iCloud Drive Transfer..."
echo "📂 Target iCloud Drive directory: $ICLOUD_DRIVE_TARGET"

# 1. Create directory in iCloud Drive if it doesn't exist
if [ ! -d "$ICLOUD_DRIVE_TARGET" ]; then
    echo "Creating destination in iCloud Drive..."
    mkdir -p "$ICLOUD_DRIVE_TARGET"
fi

# 2. Check for extracted photos in Downloads
if [ -d "$DOWNLOADS_SOURCE" ]; then
    echo "📦 Syncing photos from $DOWNLOADS_SOURCE to iCloud Drive..."
    # rsync with archive mode, progress, and metadata preservation
    rsync -avh --progress "$DOWNLOADS_SOURCE/" "$ICLOUD_DRIVE_TARGET/"
    echo "✅ Files copied to iCloud Drive."
else
    echo "ℹ️ Note: Place your extracted Google Takeout photos into $DOWNLOADS_SOURCE"
    echo "   or drag them directly into: $ICLOUD_DRIVE_TARGET"
fi

# 3. Prevent MacBook from sleeping while macOS bird daemon syncs to Apple servers
echo "⚡ Engaging MacBook caffeinate daemon to maintain continuous background upload..."
echo "   (Press Ctrl+C when you want to stop keeping the Mac awake)"
caffeinate -d -i -m -u
`;
}

export function generateLaunchdPlist(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.googlephotos.icloud.sync</string>
    <key>ProgramArguments</key>
    <array>
        <string>/bin/zsh</string>
        <string>/Users/Shared/GooglePhotosToICloud/sync-daemon.sh</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <dict>
        <key>SuccessfulExit</key>
        <false/>
    </dict>
    <key>LowPriorityIO</key>
    <true/>
    <key>Nice</key>
    <integer>10</integer>
    <key>StandardOutPath</key>
    <string>/tmp/gphotos_icloud_sync.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/gphotos_icloud_sync.err</string>
</dict>
</plist>`;
}
