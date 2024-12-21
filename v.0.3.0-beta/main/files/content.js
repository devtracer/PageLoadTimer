const pageUrl = window.location.href; // Get the current page URL
const loadTime = performance.now(); // Get the load time

// Validate URL and load time before sending or saving
if (pageUrl && loadTime > 0) {
  // Send both the URL and load time to the background script
  chrome.runtime.sendMessage({
    action: "setLoadTime",
    url: pageUrl,
    loadTime: loadTime
  });
} else {
  console.log("Invalid data - URL or load time is not valid:", { pageUrl, loadTime });
}

// Record the start time when the script is executed
const startTime = performance.now();

// Measure when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const domContentLoadedTime = performance.now();
  const domLoadTime = domContentLoadedTime - startTime;

  // Send the DOM content loaded time if it's valid
  if (domLoadTime > 0) {
    chrome.runtime.sendMessage({ action: "setDomLoadTime", domLoadTime });
  } else {
    console.log("Invalid DOM load time:", domLoadTime);
  }
});

// Measure when the window has fully loaded
window.addEventListener('load', () => {
  const endTime = performance.now();
  let loadTime = ((endTime - startTime) / 1000).toFixed(2);

  // Send the complete load time if it's valid
  if (loadTime > 0) {
    chrome.runtime.sendMessage({ action: "setLoadTime", loadTime });

    // Access settings from storage
    chrome.storage.local.get("settings", function (result) {
      if (result.settings && result.settings.website) {
        const pageUrl = window.location.href;

        if (pageUrl.includes(result.settings.website)) {
          // Save the load time for this page if URL and load time are valid
          if (pageUrl && loadTime > 0) {
            chrome.storage.local.get("data", function (dataResult) {
              const data = dataResult.data || [];
              data.push({ pageUrl, loadTime });

              chrome.storage.local.set({ data }, function () {
                console.log("Load time saved successfully.");
              });
            });
          }
        }
      }
    });
  } else {
    console.log("Invalid page load time:", loadTime);
  }

  // Optional: Log performance entries for more insights
  const performanceEntries = performance.getEntriesByType("navigation");
  if (performanceEntries.length > 0) {
    console.log(performanceEntries[0]);
  }
});
