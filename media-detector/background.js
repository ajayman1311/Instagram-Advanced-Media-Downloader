let validVideoUrls = [];

// 1. THE SNIFFER
chrome.webRequest.onHeadersReceived.addListener(
  (details) => {
    // Only look for video files
    const typeHeader = details.responseHeaders.find(h => h.name.toLowerCase() === 'content-type');
    if (!typeHeader || !typeHeader.value.includes('video/mp4')) return;

    // Filter out tiny files (smaller than 100KB)
    const lengthHeader = details.responseHeaders.find(h => h.name.toLowerCase() === 'content-length');
    if (lengthHeader && parseInt(lengthHeader.value, 10) < 100000) return;

    // Save the URL
    validVideoUrls.push(details.url);
    if (validVideoUrls.length > 5) validVideoUrls.shift(); // Keep last 5
    
    // Debug log
    console.log("Captured Potential Video:", details.url);
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);

// Helper function to remove "Range" limits from the URL
function cleanVideoUrl(url) {
  try {
    const urlObj = new URL(url);
    // Remove parameters that limit the file size
    urlObj.searchParams.delete('bytestart');
    urlObj.searchParams.delete('byteend');
    urlObj.searchParams.delete('range'); 
    return urlObj.toString();
  } catch (e) {
    return url;
  }
}

// 2. THE DOWNLOADER
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "download_media") {
    
    let finalUrl = request.url;

    // If it's a blob, swap it for the last sniffed URL
    if (finalUrl.startsWith('blob:')) {
      if (validVideoUrls.length > 0) {
        finalUrl = validVideoUrls[validVideoUrls.length - 1];
      } else {
        console.log("No valid video captured yet.");
        return; 
      }
    }

    // --- THE FIX IS HERE ---
    // We "Clean" the URL to ask for the FULL file, not just a chunk
    finalUrl = cleanVideoUrl(finalUrl);

    // Create filename
    const timestamp = new Date().getTime();
    const filename = `insta_video_fixed_${timestamp}.mp4`;

    console.log("Downloading Cleaned URL:", finalUrl);

    chrome.downloads.download({
      url: finalUrl,
      filename: filename,
      conflictAction: 'uniquify'
    });
  }
});