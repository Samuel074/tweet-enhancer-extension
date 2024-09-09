document.addEventListener('DOMContentLoaded', function() {
    const enhanceTweetButton = document.getElementById('enhanceTweet');
    const resultDiv = document.getElementById('result');
    const enhancedTweetParagraph = document.getElementById('enhancedTweet');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const moonIcon = '<i class="fas fa-moon"></i>';
    const sunIcon = '<i class="fas fa-sun"></i>';

    // Load saved dark mode preference
    chrome.storage.sync.get('darkMode', function(data) {
        if (data.darkMode) {
            body.classList.add('dark-mode');
            darkModeToggle.innerHTML = sunIcon;
        }
    });

    darkModeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        const isDarkMode = body.classList.contains('dark-mode');
        darkModeToggle.innerHTML = isDarkMode ? sunIcon : moonIcon;
        
        // Save dark mode preference
        chrome.storage.sync.set({darkMode: isDarkMode});
    });

    enhanceTweetButton.addEventListener('click', async function() {
        // Send a message to the background script to enhance the tweet
        chrome.runtime.sendMessage({ action: 'enhanceTweet' }, function(response) {
            if (response && response.enhancedTweet) {
                enhancedTweetParagraph.textContent = response.enhancedTweet;
                resultDiv.classList.remove('hidden');
            } else {
                enhancedTweetParagraph.textContent = response.error || 'Error: Unable to enhance tweet. Please try again.';
                resultDiv.classList.remove('hidden');
            }
        });
    });
});

console.log('Popup script loaded');