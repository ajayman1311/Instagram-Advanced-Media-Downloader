setInterval(scanForMedia, 1000);

function scanForMedia() {
  // 1. Select ALL videos and images on the page (not just in articles)
  const mediaItems = document.querySelectorAll('video, img');

  mediaItems.forEach((media) => {
    // Skip if already processed
    if (media.dataset.hasDownloadPopup === "true") return;

    // 2. FILTER: Ignore small images (icons, profile pics, etc.)
    // We only want things bigger than 150x150 pixels
    const rect = media.getBoundingClientRect();
    if (rect.width < 150 || rect.height < 150) return;

    // 3. SPECIAL HANDLING FOR STORIES
    // Stories are often full-screen. We need to attach the button to a reliable parent.
    const wrapper = media.parentElement;
    
    // Create the Overlay
    const overlay = document.createElement('div');
    overlay.className = 'my-overlay-container';

    // Create the Button
    const btn = document.createElement('button');
    btn.className = 'my-download-popup';
    btn.innerHTML = `Download`;

    // 4. CLICK HANDLER
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation(); // Stop the story from skipping to the next one

      let url = media.src;

      // Handle images with multiple sizes (srcset)
      if (media.tagName === 'IMG' && media.srcset) {
        const sources = media.srcset.split(',');
        url = sources[sources.length - 1].trim().split(' ')[0];
      }

      // Check if it's a video (Stories often don't have a direct src)
      if (media.tagName === 'VIDEO') {
        // If the video tag has no src, the background 'Sniffer' we made earlier
        // will handle it. We just send the request.
        if (!url) url = "blob:https://instagram.com/sniffer-needed";
      }

      // Send to Background Script
      chrome.runtime.sendMessage({
        action: "download_media",
        url: url
      });

      // Feedback
      btn.innerText = "Saving...";
      setTimeout(() => btn.innerText = "Download", 2000);
    });

    overlay.appendChild(btn);

    // 5. INJECT (Make sure parent is relative so overlay sits on top)
    // We use 'style.position' directly to force it, as classes sometimes get overridden in Stories
    wrapper.style.position = 'relative';
    wrapper.appendChild(overlay);

    // Mark as done
    media.dataset.hasDownloadPopup = "true";
  });
}