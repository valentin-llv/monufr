// Analitics
if(window.location.hostname != "localhost" && !window.location.hostname.includes('192.168')) {
    let analiticsScript = document.createElement('script');
    analiticsScript.setAttribute('src', 'https://analitics.valentinllv.cloud/script.js');
    analiticsScript.dataset.websiteId = "2f909f4d-6b7b-40b1-998c-6f19802c9161";
    
    document.head.appendChild(analiticsScript);
}

// Disable long press
document.body.addEventListener("contextmenu", (e) => {
    e.preventDefault();
});