// Simple cache to store enhanced tweets
const tweetCache = new Map();

// Mock function to enhance tweets
function mockEnhanceTweet(tweetContent) {
  // Simple enhancement: Add hashtags and emojis
  const hashtags = ['#viral', '#trending', '#mustshare'];
  const emojis = ['🔥', '💯', '🚀', '😮'];
  
  const randomHashtag = hashtags[Math.floor(Math.random() * hashtags.length)];
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
  
  return `${tweetContent} ${randomHashtag} ${randomEmoji}`;
}

async function enhanceTweetWithClaude(tweetContent) {
  if (tweetCache.has(tweetContent)) {
    console.log('Returning cached enhanced tweet');
    return tweetCache.get(tweetContent);
  }

  if (tweetContent.length > 280) {
    return 'Tweet is too long to enhance. Please try with a shorter tweet.';
  }

  // Use mock function instead of API call
  console.log('Using mock enhancement function');
  const enhancedTweet = mockEnhanceTweet(tweetContent);
  
  tweetCache.set(tweetContent, enhancedTweet);
  return enhancedTweet;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'enhanceTweet') {
    console.log('Received enhanceTweet request');
    chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
      const activeTab = tabs[0];
      console.log('Active tab URL:', activeTab.url);
      
      // Inject the content script
      try {
        await chrome.scripting.executeScript({
          target: {tabId: activeTab.id},
          files: ['content/content.js']
        });
        console.log('Content script injected successfully');
      } catch (error) {
        console.error('Error injecting content script:', error);
        sendResponse({error: "Unable to inject content script. Please refresh and try again."});
        return;
      }
      
      // Now try to get the tweet content
      try {
        chrome.tabs.sendMessage(activeTab.id, {action: "getTweetContent"}, async (response) => {
          if (chrome.runtime.lastError) {
            console.error('Error sending message to content script:', chrome.runtime.lastError);
            sendResponse({error: "Unable to communicate with the page. Please refresh and try again."});
            return;
          }
          
          console.log('Received response from content script:', response);
          if (response && response.tweetContent) {
            const enhancedTweet = await enhanceTweetWithClaude(response.tweetContent);
            sendResponse({enhancedTweet: enhancedTweet});
          } else {
            console.error('Error getting tweet content:', response?.error || 'Unknown error');
            sendResponse({error: "Unable to get tweet content. Please make sure you are on a Twitter/X page with an open tweet."});
          }
        });
      } catch (error) {
        console.error('Error in background script:', error);
        sendResponse({error: "An unexpected error occurred. Please try again."});
      }
    });
    return true; // Indicates we will respond asynchronously
  }
});

console.log('Tweet Enhancer background script loaded');