# Instagram-Advanced-Media-Downloader
A powerful Chrome Extension (Manifest V3) that enables one-click downloading for Instagram Videos, Reels, Stories, Highlights, and Images.
Unlike basic downloaders, this extension features a Hybrid Engine that intelligently switches between Instagram's internal API, Network Sniffing, and Page Scraping to ensure you always get the highest quality video with audio included.

🚀 Key Features
Universal Support: Works on the Main Feed, Reels Tab, Story Viewer, Highlights, and Single Post pages.

🕵️‍♂️ Smart Story Sniffer: Detects the active Story/Highlight playing on your screen and captures the direct video link from the network traffic.

Anti-Blob Technology: Bypasses encrypted blob: URLs that usually result in corrupted or empty downloads.

One-Click Overlay: Adds a non-intrusive "Download" button directly over the media.

Background Processing: Fetches data silently in the background—no annoying "New Tabs" opening up.

🛠️ How It Works (Technical)
This extension uses a Triple-Fallback Strategy to guarantee a download:

Strategy A (Internal API): It quietly queries Instagram's __a=1 endpoint to get the raw mp4 source file.

Strategy B (Page Scraping): If the API is blocked, it scans the page source code using Regex to find hidden video URLs.

Strategy C (Network Sniffer): For Stories and Encrypted streams, it listens to web headers (webRequest API) to capture the video file as it buffers in the browser.

📥 Installation Guide
Since this is a developer tool, you can install it manually:

Clone or Download this repository to your computer.

Open Chrome and navigate to chrome://extensions/.

Toggle Developer mode (top right corner).

Click Load unpacked.

Select the folder containing the manifest file.

Go to Instagram, refresh the page, and start downloading!

📋 Usage
For Posts/Reels: Just click the Download button appearing over the video.

For Stories: Play the story for at least 1 second (so the sniffer can catch it), then click Download.

⚠️ Disclaimer
This project is for educational purposes only. It was created to demonstrate how to manipulate DOM elements, handle Chrome's webRequest API, and interact with REST APIs within a browser extension. Please respect copyright laws and Instagram's Terms of Service. Do not use this tool to infringe on content ownership.
