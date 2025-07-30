(function() {
    // Array of counter types to track
    var counterTypes = ["site_pv", "site_uv", "page_pv", "page_uv"];
    
    // Get the current script element
    var currentScript = document.currentScript;
    
    // Check if PJAX mode is enabled (single-page application support)
    var isPjaxEnabled = currentScript.hasAttribute("pjax");
    
    // Get API endpoint URL or use default
    // var apiUrl = currentScript.getAttribute("data-api") || "https://bsz.dusays.com:9001/api";
    var apiUrl = currentScript.getAttribute("data-api") || "https://count.sjtuxhw.top/api";
    
    // Local storage key for user identity
    var identityKey = "busuanzi-identity";
    
    // Function to send analytics request
    var sendAnalyticsRequest = function() {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", apiUrl, true);
        
        // Get stored user identity token from localStorage
        var userIdentity = localStorage.getItem(identityKey);
        if (userIdentity != null) {
            xhr.setRequestHeader("Authorization", "Bearer " + userIdentity);
        }
        
        // Prepare the current page URL (remove www. prefix if present)
        var currentUrl = window.location.href;
        if (window.location.host.indexOf("www.") == 0) {
            currentUrl = currentUrl.replace("www.", "");
        }
        xhr.setRequestHeader("x-bsz-referer", currentUrl);
        
        // Handle the response
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                
                if (response.success === true) {
                    // Update counter values on the page
                    counterTypes.map(function(counterType) {
                        var element = document.getElementById("busuanzi_value_" + counterType);
                        if (element) {
                            const data = parseInt(response.data[counterType]);
                            switch (counterType) {
                            case "site_pv":
                                element.innerHTML = data + 2244;    // data migrated (2025/07/29)
                                break;
                            case "site_uv":
                                element.innerHTML = data + 1292;    // data migrated (2025/07/29)
                                break;
                            case "page_pv":
                                element.innerHTML = data + 12;
                                break;
                            case "page_uv":
                                element.innerHTML = data + 2;
                                break;
                            }
                        }
                    });
                    
                    // Update user identity token if provided
                    var newIdentity = xhr.getResponseHeader("Set-Bsz-Identity");
                    if (newIdentity != null && newIdentity != "") {
                        localStorage.setItem(identityKey, newIdentity);
                    }
                }
            }
        };
        
        xhr.send();
    };
    
    // Send initial request
    sendAnalyticsRequest();
    
    // If PJAX is enabled, hook into navigation events
    if (isPjaxEnabled) {
        // Override pushState to track navigation
        var originalPushState = window.history.pushState;
        window.history.pushState = function() {
            originalPushState.apply(this, arguments);
            sendAnalyticsRequest();
        };
        
        // Listen for back/forward navigation
        window.addEventListener("popstate", function(event) {
            sendAnalyticsRequest();
        }, false);
    }
})();