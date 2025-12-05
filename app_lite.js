document.addEventListener('DOMContentLoaded', () => {
    
    const goHome = (e) => {
        e.preventDefault();

        const t = document.createElement('div');
        t.innerText = "Launching App... 🚀";
        // Simple, clean pill toast
        t.style.cssText = `
            position: fixed; bottom: 30px; left: 50%; 
            transform: translateX(-50%); 
            background: #2dd4bf; color: #050505; 
            padding: 10px 24px; border-radius: 50px; 
            font-weight: 700; font-family: sans-serif;
            box-shadow: 0 10px 20px rgba(0,0,0,0.5);
            z-index: 999; animation: popUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        `;
        document.body.appendChild(t);

        // Add CSS animation for the toast
        const style = document.createElement('style');
        style.innerHTML = `@keyframes popUp { from { transform: translateX(-50%) scale(0.8); opacity: 0; } to { transform: translateX(-50%) scale(1); opacity: 1; } }`;
        document.head.appendChild(style);
        
        // Fade out
        document.querySelector('.premium-card').style.transition = "opacity 0.5s, transform 0.5s";
        document.querySelector('.premium-card').style.opacity = "0";
        document.querySelector('.premium-card').style.transform = "scale(0.95)";

        setTimeout(() => {
            window.location.href = "https://civilskash.in";
        }, 600);
    };

    const triggers = document.querySelectorAll('.js-go-home');
    triggers.forEach(btn => btn.addEventListener('click', goHome));
});