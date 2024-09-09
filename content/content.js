console.log("Tweet Enhancer content script loaded");

function getTweetContent() {
  const selectors = [
    '[data-testid="tweetText"]',
    '[data-testid="tweet"]',
    '.css-901oao.r-18jsvk2.r-37j5jr.r-a023e6.r-16dba41.r-rjixqe.r-bcqeeo.r-bnwqim.r-qvutc0',
    'article[data-testid="tweet"] div[lang]'
  ];

  for (let selector of selectors) {
    const element = document.querySelector(selector);
    if (element) {
      return element.textContent.trim();
    }
  }

  const tweetArea = document.querySelector('article[data-testid="tweet"]');
  if (tweetArea) {
    return tweetArea.textContent.trim();
  }

  return null;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received in content script:", request);
  if (request.action === "getTweetContent") {
    const tweetContent = getTweetContent();
    console.log("Tweet content found:", tweetContent);
    if (tweetContent) {
      sendResponse({tweetContent: tweetContent});
    } else {
      sendResponse({error: "Unable to find tweet content"});
    }
  }
  return true; // Indicates that the response is sent asynchronously
});