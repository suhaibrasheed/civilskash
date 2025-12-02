<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    
    <title>CivilsKash - for Daily Current Affairs, UPSC GK & Flashcards </title>
    
    <meta name="description" content="Free UPSC/IAS/PSC & Other Exams preparation tool with daily current affairs, flashcards, spaced repetition system (SRS), Quiz and general knowledge notes.">
    
    <meta name="keywords" content="UPSC, IAS, Civil Services, PSC, Current Affairs, Flashcards, GK, Quiz, Spaced Repetition, CivilKash">
    
    <link rel="canonical" href="https://civilskash.in/" />

    <meta property="og:title" content="CivilKash - Master Current Affairs">
    <meta property="og:description" content="Read short, crisp daily current affairs and practice with AI-generated quizzes.">
    <meta property="og:image" content="https://civilskash.in/icon-192.png"> 
    <meta property="og:url" content="https://civilskash.in">
    <meta property="og:type" content="website">
    
    <meta name="theme-color" content="#18181b">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="google-site-verification" content="wUiOliD-vDlRhZkti0uiNPnZ4sNJ8Yn4Y_NEHicHjNY" />

    <link rel="icon" href="/favicon-96x96.png" sizes="96x96" type="image/png">
    <link rel="shortcut icon" href="/favicon.ico">
    <link rel="apple-touch-icon" href="/icon-192.png">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="manifest" href="manifest.json">
    <link rel="apple-touch-icon" href="icon-192.png">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9975373090727883"
     crossorigin="anonymous"></script>
     

    <style>
        /* =========================================
           1. DESIGN TOKENS & THEME ENGINE
           ========================================= */
        :root {
        
            --accent-gold: #fbbf24;   
            --red: #f43f5e;           
            --green: #10b981;         
            --orange: #f97316;
            --blue: #3b82f6;
            --font-ui: 'Outfit', sans-serif;
            --font-read: 'Merriweather', serif;
            --header-h: 64px;
            --card-radius: 24px;
            --max-width: 1200px;
            --transition-smooth: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            --transition-spring: 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        /* DARK THEME */
        :root[data-theme="dark"] {
            --bg-body: #09090b;       
            --bg-card: #18181b;       
            --bg-modal: #18181b;
            --bg-overlay: #09090b;
            --text-main: #f4f4f5;     
            --text-muted: #c5c5d1; 
            --primary: #fbbf24;       
            --primary-dim: rgba(251, 191, 36, 0.15);
            --highlight-bg: rgba(251, 191, 36, 0.15);
            --chip-active: #fbbf24;   
            --border-glass: rgba(255, 255, 255, 0.08);
            --bg-glass: rgba(9, 9, 11, 0.85);
            --shadow-soft: 0 4px 20px rgba(0,0,0,0.5);
            --shadow-hover: 0 10px 30px rgba(0,0,0,0.6);
            --highlight-bg: rgba(45, 212, 191, 0.15);
            --cloze-bg: rgba(255, 255, 255, 0.1);
            --cloze-border: #52525b;
            --quiz-bg: #121214;
            --quiz-mask: #27272a;
            --gradient-text-card: radial-gradient(circle at 0% 100%, #1e1b4b 0%, #18181b 50%), 
                                  radial-gradient(circle at 100% 0%, #0f766e 0%, #18181b 50%);
            --scroll-track: #27272a;
            --scroll-thumb: #52525b;
            --chip-bg: #27272a;
            --chip-active-text: #000;
            --toolbar-bg: rgba(24, 24, 27, 0.75);
            --toolbar-border: rgba(255, 255, 255, 0.1);
            --toolbar-text: rgba(255, 255, 255, 0.8);
            --toolbar-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        /* LIGHT THEME */
        :root[data-theme="light"] {
            --bg-body: #f0fdfa;       
            --bg-card: #ffffff;
            --bg-modal: #ffffff;
            --bg-overlay: #f0fdfa;
            --text-main: #1e293b;     
            --text-muted: #64748b; 
            
            --primary: #1bc4b6;       
            --primary-dim: rgba(13, 148, 136, 0.15);
            --highlight-bg: rgba(13, 148, 136, 0.15);

            --border-glass: rgba(0, 0, 0, 0.06);
            --bg-glass: rgba(255, 255, 255, 0.9);
            --shadow-soft: 0 10px 30px rgba(0,0,0,0.05);
            --shadow-hover: 0 15px 40px rgba(0,0,0,0.1);
            --highlight-bg: rgba(45, 212, 191, 0.25);
            --cloze-bg: rgba(0, 0, 0, 0.05);
            --cloze-border: #cbd5e1;
            --quiz-bg: #f8fafc;
            --quiz-mask: #e2e8f0;
            --gradient-text-card: radial-gradient(circle at 0% 100%, #e0f2fe 0%, #ffffff 60%), 
                                  radial-gradient(circle at 100% 0%, #f0fdfa 0%, #ffffff 60%);
            --scroll-track: #e2e8f0;
            --scroll-thumb: #94a3b8;
            --chip-bg: #e2e8f0;
            --chip-active: #24e3ca;
            --chip-active-text: #000;
            --toolbar-bg: rgba(255, 255, 255, 0.75); /* Frosted White */
            --toolbar-border: rgba(0, 0, 0, 0.1);
            --toolbar-text: #334155; /* Dark Grey Icons */
            --toolbar-shadow: 0 10px 30px rgba(0,0,0,0.1);

        }
        :root[data-theme="sepia"] {
            --bg-body: #f2e9d0;       
            --bg-card: #fbf6e6;
            --bg-modal: #fbf6e6;
            --bg-overlay: #f2e9d0;
            --text-main: #433422;     /* Dark Coffee */
            --text-muted: #857258;    /* Light Leather */
            --primary: #d97706;       /* Amber */
            --primary-dim: rgba(217, 119, 6, 0.15);
            --border-glass: rgba(67, 52, 34, 0.1);
            --bg-glass: rgba(251, 246, 230, 0.9);
            --shadow-soft: 0 4px 20px rgba(67, 52, 34, 0.05);
            --highlight-bg: rgba(217, 119, 6, 0.15);
            --cloze-bg: rgba(67, 52, 34, 0.05);
            --cloze-border: #d4c5a9;
            --gradient-text-card: linear-gradient(to bottom, #fbf6e6, #f2e9d0);
            --chip-bg: #e6dac0;
            --chip-active: #d97706;
            --chip-active-text: #fff;
            --scroll-thumb: #d4c5a9;
            
            --toolbar-bg: rgba(251, 246, 230, 0.85); /* Warm Paper */
            --toolbar-border: rgba(67, 52, 34, 0.15);
            --toolbar-text: #433422; /* Coffee color */
            --toolbar-shadow: 0 10px 20px rgba(67, 52, 34, 0.1);
        }


        /* =========================================
           2. BASE & UTILITY
           ========================================= */
        * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; outline: none; }
        
        body { 
            font-family: var(--font-ui); 
            background: var(--bg-body); 
            color: var(--text-main); 
            height: 100vh; 
            overflow: hidden; 
            transition: background var(--transition-smooth), color var(--transition-smooth); 
        }

        /* Smooth Scrollbar */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { 
            background: var(--scroll-thumb); 
            border-radius: 10px; border: 2px solid transparent; background-clip: content-box; 
        }
        ::-webkit-scrollbar-thumb:hover { background: var(--primary); }
        
        /* Noise Texture for that "Premium" feel */
        body::before {
            content: ""; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E");
            pointer-events: none; z-index: 9999; opacity: 0.5; mix-blend-mode: overlay;
        }

        /* =========================================
           3. LOADER & ERROR SCREEN (The Safety Net)
           ========================================= */
        #startup-loader {
            position: fixed; inset: 0; background: var(--bg-body); z-index: 10000;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            transition: opacity 0.5s ease;
        }
        .loader-spinner {
            width: 50px; height: 50px; border: 4px solid var(--border-glass);
            border-top: 4px solid var(--primary); border-radius: 50%;
            animation: spin 1s linear infinite; margin-bottom: 20px;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        
        #debug-console {
            display: none; width: 90%; max-width: 600px; max-height: 300px; overflow-y: auto;
            background: rgba(255, 0, 0, 0.1); border: 1px solid var(--red); color: var(--red);
            padding: 15px; border-radius: 12px; font-family: monospace; font-size: 0.8rem;
            margin-top: 20px; text-align: left;
        }

        /* =========================================
           4. HEADER
           ========================================= */
        header {
            position: fixed; top: 0; left: 0; width: 100%; height: 55px; z-index: 100;
            background: var(--bg-glass); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
            border-bottom: 1px solid var(--border-glass); 
            display: flex; justify-content: space-between; align-items: center; padding: 0 24px;
        }

        .brand { 
            font-weight: 800; 
            font-size: 1.8rem; /* Increased size */
            letter-spacing: -0.5px; cursor: pointer;
            background: linear-gradient(135deg, var(--text-main) 0%, var(--text-muted) 100%);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            display: flex; align-items: center; 
        }

        .brand span { color: var(--primary); -webkit-text-fill-color: var(--primary); }

        .header-actions { display: flex; gap: 4px; align-items: center; }

        .icon-btn {
            background: transparent; border: none; cursor: pointer; padding: 10px; border-radius: 50%;
            display: flex; align-items: center; justify-content: center; 
            color: var(--text-muted); transition: var(--transition-smooth); position: relative;
        }
        .icon-btn:hover { background: var(--border-glass); color: var(--text-main); transform: scale(1.05); }
        .icon-btn:active { transform: scale(0.95); }
        .icon-btn.active-state { color: var(--primary); background: var(--highlight-bg); }
        .icon-btn.liked svg { fill: var(--red); stroke: var(--red); }
        .icon-btn svg { width: 22px; height: 22px; stroke: currentColor; stroke-width: 2; fill: none; }
        
        .badge-dot {
            position: absolute; top: 6px; right: 6px; width: 8px; height: 8px; 
            background: var(--primary); border-radius: 50%; display: none;
        }
        /* Info about note export */
        .info-icon-btn {
            color: var(--primary); 
            opacity: 0.8; 
            transition: all 0.2s ease;
        }
        .info-icon-btn:hover {
            opacity: 1;
            transform: scale(1.1);
        }
        .tutorial-list li {
            margin-bottom: 8px;
            line-height: 1.5;
            color: var(--text-muted);
        }
        .tutorial-highlight {
            color: var(--primary);
            font-weight: 700;
        }
        #modal-notekash-tutorial {
            z-index: 300 !important; /* Higher than settings (200) */
        }

        /* =========================================
        5. MAIN FEED & CARDS
        ========================================= */
        #app-container { height: 100%; width: 100%; overflow-y: auto; scroll-behavior: smooth; padding-top: var(--header-h); overscroll-behavior-y: contain; will-change: scroll-position; }

        @media (min-width: 769px) {
            #feed-list { 
                display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); 
                gap: 40px; padding: 40px; max-width: var(--max-width); margin: 0 auto; 
            }
            .news-card { 
                height: 650px; 
                border-radius: var(--card-radius); border: 1px solid var(--border-glass); 
                box-shadow: var(--shadow-soft); overflow: hidden;
            }
        }

        .action-toolbar-container {
            padding: 15px 20px 30px 20px; 
            display: flex; justify-content: center; width: 100%;
        }

        .action-toolbar {
            display: flex; align-items: center; justify-content: space-evenly; gap: 15px;
            background: var(--toolbar-bg); 
            backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
            border: 1px solid var(--toolbar-border);
            box-shadow: 0 8px 32px -4px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255, 255, 255, 0.5);
            padding: 4px 20px; border-radius: 50px; min-width: 180px;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .action-toolbar .icon-btn svg {
            width: 28px; height: 28px; stroke-width: 1.8;
            transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .action-toolbar .icon-btn:hover svg { transform: scale(1.2); }
        .action-toolbar .icon-btn { padding: 8px; color: var(--toolbar-text); }
        .action-toolbar .icon-btn:hover { color: var(--primary); transform: scale(1.15); background: transparent; }
        .action-toolbar .icon-btn.liked { color: var(--red) !important; }

        @media (max-width: 768px) {
            #app-container { scroll-snap-type: y mandatory; padding-top: 0; height: 100dvh; }
            header { 
                background: linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%);
                backdrop-filter: none; border: none; pointer-events: none;
                height: 50px; padding: 0 10px; align-items: center; display: flex;
            }
            header > * { pointer-events: auto; }
            .header-actions { gap: 2px; }
            .brand { -webkit-text-fill-color: #fff; text-shadow: 0 2px 8px rgba(0,0,0,0.5); font-size: 1.5rem; }
            .icon-btn { color: rgba(255,255,255,0.95); }
            .news-card { 
                height: 100dvh; width: 100%; scroll-snap-align: start; scroll-snap-stop: normal; 
                border-radius: 0; border: none; display: flex; flex-direction: column; 
            }
            .scroll-content { flex: 1; overflow-y: auto; -webkit-overflow-scrolling: touch; display: block; padding-bottom: 20px; }
            .card-footer { display: none !important; } 
            .card-img { height: 40vh; background-position: center top !important; }
        }

        .news-card { background: var(--bg-card); position: relative; display: flex; flex-direction: column; transition: transform 0.3s ease; }
        .scroll-content { flex: 1; overflow-y: auto; display: flex; flex-direction: column; position: relative; }
        .card-img { height: 45vh; min-height: 250px; flex-shrink: 0; background-size: cover; background-position: center; position: relative; }
        .spin-active { animation: spin 1s linear infinite; color: var(--primary) !important; }
        .card-body { padding: 24px 24px 4px 24px; position: relative; z-index: 2; }

        /* --- TEXT ONLY CARD (LIVE APP) --- */
        .news-card.text-only .scroll-content { 
            background: var(--bg-card);
            background-image: linear-gradient(to bottom right, var(--bg-card), var(--bg-body));
        }
        .news-card.text-only .card-body { 
            padding: 80px 30px 40px 30px; min-height: 100%; 
            display: block; position: relative; overflow: hidden;
        }
        .news-card.text-only .card-body::before {
            content: '“'; position: absolute; top: -20px; left: 20px;
            font-family: var(--font-read); font-size: 10rem; line-height: 1;
            color: var(--primary); opacity: 0.1; pointer-events: none; z-index: -1;
        }
        .news-card.text-only h2 { 
            font-size: 2rem; margin-bottom: 24px; text-align: center; position: relative; z-index: 2;
        }
        .news-card.text-only .summary-box { text-align: left; font-size: 1.25rem; line-height: 1.8; position: relative; z-index: 2; }
        /* Uncluttered Header for Text Cards */
        .news-card.text-only .meta-row {
            justify-content: center !important; gap: 25px !important; 
            margin-bottom: 30px !important; position: relative; z-index: 5;
        }
        .news-card.text-only .date::before {
            content: ''; position: absolute; left: -14px; top: 50%; transform: translateY(-50%);
            width: 1px; height: 12px; background: var(--text-muted); opacity: 0.4;
        }

        /* --- EXPORT CARD (MAGAZINE STYLE) --- */
        .news-card.export-mode {
            height: auto !important; min-height: auto !important; width: 600px !important;
            background: var(--bg-card) !important; color: var(--text-main) !important;
            border: none !important; border-radius: 0 !important;
            display: flex !important; flex-direction: column !important; position: relative !important;
            z-index: -9999; padding: 0 !important; overflow: hidden !important;
        }
        /* Hide UI in Export */
        .news-card.export-mode .card-img,
        .news-card.export-mode .action-toolbar-container, 
        .news-card.export-mode .card-footer,
        .news-card.export-mode .watermark-overlay,
        .news-card.export-mode .ad-label-corner,
        .news-card.export-mode .export-logo-top { display: none !important; }

        /* 16:11 Aspect Ratio Image */
        .export-image-16x11 {
            width: 100% !important; aspect-ratio: 16 / 11 !important; 
            background-size: cover !important; background-position: center center !important;
            background-repeat: no-repeat !important; border-bottom: 1px solid var(--border-glass);
            z-index: 1; background-color: var(--bg-body); margin: 0 !important;
        }

        /* Export Typography (Tight & Optimized) */
        .news-card.export-mode .card-body {
            padding: 15px 20px 40px 20px !important; /* Optimized Padding */
            background: var(--bg-card) !important; flex: 1;
        }
        /* Quote Mark for Text-Only Export */
        .news-card.export-mode .card-body::before {
            content: '“'; position: absolute; top: -15px; left: 20px;
            font-family: var(--font-read); font-size: 8rem; line-height: 1;
            color: var(--primary); opacity: 0.07; pointer-events: none; z-index: 0;
        }
        .news-card.export-mode h2 {
            font-size: 2.4rem !important; line-height: 1.2 !important;
            margin-bottom: 12px !important; color: var(--text-main) !important;
            letter-spacing: -0.03em !important; position: relative; z-index: 2;
        }
        .news-card.export-mode .summary-box {
            font-family: var(--font-read) !important; font-size: 1.35rem !important;
            line-height: 1.6 !important; color: var(--text-muted) !important;
            opacity: 0.95 !important; position: relative; z-index: 2;
        }

        /* Export Header Fix (Uncluttered) */
        .news-card.export-mode .meta-row {
            margin-bottom: 25px !important; 
            justify-content: space-between !important; /* Left/Right Split */
            align-items: center !important; 
            gap: 0 !important;
            position: relative; z-index: 5;
        }

        .news-card.export-mode .badge {
            font-size: 0.95rem !important; /* Larger */
            padding: 6px 14px !important;   /* Beefier pill */
            letter-spacing: 1px !important;
        }

        .news-card.export-mode .date {
            font-size: 1.1rem !important; /* Larger */
            font-weight: 700 !important;
            opacity: 0.9 !important;
        }
        .news-card.export-mode .date::before { display: none !important; }


        /* --- 1. EXPORT MODE: CLOZE, FOOTER & CLEAN BADGES --- */
        .news-card.export-mode .keyword {
            background: transparent !important; border: none !important; box-shadow: none !important;
            padding: 0 4px !important; margin: 0 !important; color: var(--primary) !important;
            font-family: var(--font-ui) !important; font-size: 1.25rem !important; font-weight: 900 !important;
            letter-spacing: 1.5px !important; opacity: 1 !important; display: inline-block !important; vertical-align: baseline !important;
        }
        .news-card.export-mode .keyword::after { content: none !important; }
        .export-footer { display: none !important; }
        .news-card.export-mode .badge {
            box-shadow: none !important;
            border: none !important;
        }

        /* --- 2. WATERMARK ENGINE (3D & THEME AWARE) --- */
        .export-watermark-top {
            position: absolute !important; top: 20px !important; right: 20px !important; z-index: 100 !important;
            display: flex !important; align-items: center !important; gap: 8px !important;
            filter: drop-shadow(0 8px 15px rgba(0,0,0,0.3)) !important; /* 3D Pop */
            padding: 8px 16px !important; border-radius: 50px !important;
            backdrop-filter: blur(8px) !important; border: 1px solid rgba(255, 255, 255, 0.2) !important;
        }
        .watermark-text {
            font-family: var(--font-ui) !important; font-weight: 900 !important; font-size: 1.25rem !important;
            line-height: 1 !important; letter-spacing: -0.5px !important; 
            text-shadow: 0 -1px 0 rgba(0,0,0,0.2) !important; /* Carved Depth */
        }
        .watermark-badge {
            font-size: 0.75rem !important; font-weight: 800 !important; letter-spacing: 0.5px !important;
            padding: 3px 8px !important; border-radius: 6px !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2) !important;
        }

        /* Watermark Themes */
        [data-theme="dark"] .export-watermark-top { background: rgba(0, 0, 0, 0.6) !important; }
        [data-theme="dark"] .watermark-text { color: #ffffff !important; }
        [data-theme="dark"] .watermark-text span { color: var(--primary) !important; }
        [data-theme="dark"] .watermark-badge { background: var(--primary) !important; color: #000000 !important; }

        [data-theme="sepia"] .export-watermark-top { background: rgba(67, 52, 34, 0.85) !important; border: 1px solid rgba(255, 255, 255, 0.1) !important; }
        [data-theme="sepia"] .watermark-text { color: #fbf6e6 !important; } 
        [data-theme="sepia"] .watermark-text span { color: #f3dba5 !important; } 
        [data-theme="sepia"] .watermark-badge { background: #f3dba5 !important; color: #433422 !important; }

        [data-theme="light"] .export-watermark-top { background: rgba(255, 255, 255, 0.9) !important; border: 1px solid rgba(0, 0, 0, 0.05) !important; }
        [data-theme="light"] .watermark-text { color: #1e293b !important; } 
        [data-theme="light"] .watermark-text span { color: #14b8a6 !important; } 
        [data-theme="light"] .watermark-badge { background: #14b8a6 !important; color: #ffffff !important; }


        /* --- 3. METADATA & CARVED EFFECTS (Main App) --- */
        .meta-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; opacity: 0.9; }

        .badge { 
            padding: 5px 12px; border-radius: 8px; font-weight: 800; font-size: 0.75rem; 
            text-transform: uppercase; letter-spacing: 0.5px; cursor: pointer; border: 1px solid transparent; 
            transition: transform 0.2s ease;
            background: var(--badge-bg, var(--primary)); color: var(--badge-text, #000);
            box-shadow: var(--badge-shadow, none); border-color: var(--badge-border, transparent);
        }
        .badge:active { transform: scale(0.95); }

        .date { 
            font-size: 0.85rem; font-weight: 600; color: var(--date-text, var(--text-muted)); 
            text-shadow: var(--text-carve, none); /* Carved Effect */
        }

        /* Metadata Theme Variables */
        :root[data-theme="dark"] {
            --badge-bg: var(--primary); --badge-text: #000000;
            --badge-shadow: 0 2px 10px rgba(251, 191, 36, 0.2);
            --date-text: var(--text-muted); --text-carve: 0 1px 2px rgba(0,0,0,0.8);
        }
        :root[data-theme="sepia"] {
            --badge-bg: rgba(67, 52, 34, 0.08); --badge-text: #856404; --badge-border: rgba(133, 100, 4, 0.2);
            --badge-shadow: inset 0 1px 2px rgba(0,0,0,0.05), 0 1px 0 rgba(255,255,255,0.8);
            --date-text: #857258; --text-carve: 1px 1px 0 rgba(255,255,255,1); /* Letterpress Look */
        }
        :root[data-theme="light"] {
            --badge-bg: #f1f5f9; --badge-text: #0f766e; --badge-border: #e2e8f0;
            --badge-shadow: 0 1px 2px rgba(0,0,0,0.05);
            --date-text: #64748b; --text-carve: 0 1px 0 rgba(255,255,255,1);
        }

        /* --- 4. TYPOGRAPHY & FOOTER --- */
        h2 { font-size: 1.6rem; font-weight: 800; line-height: 1.3; margin-bottom: 16px; font-family: var(--font-ui); letter-spacing: -0.02em; }
        .summary-box { font-family: var(--font-read); font-size: 1.15rem; line-height: 1.75; color: var(--text-muted); margin-bottom: 4px; }

        .keyword {
            background: var(--highlight-bg); color: var(--primary); padding: 2px 5px; border-radius: 4px;
            font-weight: 600; cursor: pointer; border-bottom: 1px dashed var(--primary);
            transition: all 0.3s ease; user-select: none;
        }
        .keyword.is-hidden { background: var(--cloze-bg); color: transparent; border-bottom: 2px solid var(--cloze-border); }
        .keyword.is-hidden:hover { border-color: var(--primary); }

        .card-footer { 
            padding: 16px 24px; display: flex; justify-content: flex-end; gap: 12px; align-items: center; 
            border-top: 1px solid var(--border-glass); background: var(--bg-card); z-index: 10;
        }

        /* =========================================
           6. 3D QUIZ SYSTEM (PREMIUM & FLIP RESTORED)
           ========================================= */
        #quiz-fullscreen-layer {
            position: fixed; inset: 0; z-index: 2000;
            background: var(--bg-overlay);
            display: flex; flex-direction: column;
            opacity: 0; pointer-events: none;
            transition: opacity 0.4s ease;
            padding-top: 10px;
        }
        #quiz-fullscreen-layer.active { opacity: 1; pointer-events: auto; }

        .quiz-navbar {
            padding: 10px 24px;
            display: flex; justify-content: space-between; align-items: center;
            max-width: 800px; width: 100%; margin: 0 auto;
            flex-shrink: 0;
        }

        .quiz-progress-track {
            flex: 1; height: 6px; background: var(--border-glass);
            border-radius: 10px; margin: 0 20px; overflow: hidden;
        }
        .quiz-progress-fill {
            height: 100%; background: var(--primary); width: 0%;
            transition: width 0.5s ease;
        }

        /* THE STAGE: Sets the 3D environment */
        .quiz-stage {
            flex: 1; display: flex; align-items: center; justify-content: center;
            padding: 20px; 
            perspective: 2000px; /* Deep perspective for premium 3D feel */
            overflow: hidden; 
        }

        /* THE CARD OBJECT */
        .quiz-card-wrapper {
            width: 100%; max-width: 600px; 
            height: 100%; max-height: 75vh; min-height: 400px;
            position: relative;
            transform-style: preserve-3d; /* Crucial for Flip */
            transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1); 
            transform: translateX(0) rotateY(0deg) scale(1);
            margin-bottom: 20px;
        }
        
        /* STATE: FLIPPED (The rotation) */
        .quiz-card-wrapper.is-flipped {
            transform: translateX(0) rotateY(180deg);
        }

        /* ANIMATION: SWIPE LEFT (Exit to Next) */
        .card-exit-left {
            animation: swipeOut 0.4s forwards cubic-bezier(0.55, 0.085, 0.68, 0.53);
        }
        @keyframes swipeOut {
            0% { transform: translateX(0) rotateY(0deg) scale(1); opacity: 1; }
            100% { transform: translateX(-120%) rotateY(-20deg) scale(0.9); opacity: 0; }
        }

        /* ANIMATION: STACK REVEAL (Enter from bottom/back) */
        .card-enter-stack {
            animation: stackIn 0.5s forwards cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes stackIn {
            0% { transform: translateY(40px) scale(0.9); opacity: 0; }
            100% { transform: translateY(0) scale(1); opacity: 1; }
        }

        /* DEFAULT STATE (Reset) */
        .card-center-active {
            transform: translateX(0) rotateY(0deg);
            opacity: 1;
        }

        /* THE VISUAL FACES (Front & Back) */
        .quiz-face {
            position: absolute; inset: 0;
            -webkit-backface-visibility: hidden; backface-visibility: hidden;
            background: linear-gradient(145deg, var(--bg-card), var(--bg-body));
            border-radius: 32px;
            border-top: 1px solid rgba(255,255,255,0.1);
            border-left: 1px solid rgba(255,255,255,0.05);
            border-right: 1px solid rgba(0,0,0,0.1);
            border-bottom: 1px solid rgba(0,0,0,0.1);
            box-shadow: 
                0 20px 50px -10px rgba(0,0,0,0.5),
                0 10px 20px -10px rgba(0,0,0,0.3);
                
            display: flex; flex-direction: column;
            overflow: hidden;
        }

        .quiz-back { transform: rotateY(180deg); }

        .quiz-scroll-area {
            flex: 1; overflow-y: auto; padding: 40px;
            display: flex; flex-direction: column;
            scrollbar-width: none; 
        }
        .quiz-scroll-area::-webkit-scrollbar { display: none; }
        
        .quiz-question-text {
            font-family: var(--font-read); font-size: 1.6rem; line-height: 1.6;
            color: var(--text-main); text-align: left;
            margin-top: auto; margin-bottom: auto; padding-top: 10px;
            text-shadow: 0 2px 10px rgba(0,0,0,0.2); /* Slight text pop */
        }

        .quiz-actions-area {
            padding: 24px; 
            border-top: 1px solid var(--border-glass);
            background: var(--bg-card); 
            flex-shrink: 0;
            border-bottom-left-radius: 32px;
            border-bottom-right-radius: 32px;
        }

        /* CLOZE STYLING */
        .quiz-mask {
            background: var(--quiz-mask); color: transparent;
            border-radius: 6px; padding: 2px 12px; margin: 0 4px;
            display: inline-block; border: 1px dashed var(--text-muted);
            vertical-align: middle; min-width: 60px; position: relative;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
        }
        .quiz-mask::after {
            content: '?'; color: var(--text-muted);
            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
            font-weight: 700;
        }
        .quiz-revealed {
            color: var(--primary); font-weight: 800;
            background: var(--highlight-bg); padding: 4px 10px; border-radius: 6px;
            animation: highlightPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            display: inline-block;
        }
        @keyframes highlightPop { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }

        /* BUTTONS */
        .srs-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        .srs-btn {
            padding: 14px 10px; border-radius: 16px; border: none; cursor: pointer;
            display: flex; flex-direction: column; align-items: center; gap: 6px;
            transition: all 0.2s; 
            background: var(--bg-body); 
            border: 1px solid var(--border-glass);
            color: var(--text-main);
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .srs-btn:hover { 
            transform: translateY(-4px); 
            background: var(--bg-card); 
            box-shadow: 0 10px 20px rgba(0,0,0,0.2); 
        }
        .srs-btn:active { transform: scale(0.95); }
        .srs-btn span:first-child { font-weight: 800; font-size: 0.95rem; letter-spacing: 0.5px; }
        .srs-btn span:last-child { font-size: 0.6rem; color: var(--text-muted); text-transform: uppercase; }
        
        .srs-again { border-bottom: 4px solid var(--red); }
        .srs-hard { border-bottom: 4px solid var(--orange); }
        .srs-good { border-bottom: 4px solid var(--blue); }
        .srs-easy { border-bottom: 4px solid var(--green); }

        #quiz-summary {
            position: absolute; inset: 0; background: var(--bg-overlay); z-index: 5;
            display: none; flex-direction: column; align-items: center; justify-content: center;
            animation: fadeIn 0.5s;
        }
        #quiz-summary.visible { display: flex; }

        /* 1. STREAK FIRE ENGINE */
        .streak-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 25px;
            position: relative;
        }

        .fire-wrapper {
            position: relative;
            width: 60px;
            height: 60px;
            margin-bottom: 5px;
        }

        .fire-icon {
            font-size: 3.5rem;
            filter: drop-shadow(0 0 10px rgba(255, 100, 0, 0.5));
            animation: breatheFire 2s infinite ease-in-out;
            transform-origin: center bottom;
            display: block;
        }

        .streak-count {
            position: absolute;
            bottom: -5px;
            right: -5px;
            background: var(--bg-card);
            border: 2px solid var(--border-glass);
            color: var(--text-main);
            font-weight: 800;
            font-size: 0.9rem;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }

        .streak-label {
            font-size: 1.2rem;
            font-weight: 800;
            background: linear-gradient(45deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 2px;
        }

        .streak-sub {
            font-size: 0.8rem;
            color: var(--text-muted);
        }

        @keyframes breatheFire {
            0% { transform: scale(1); filter: drop-shadow(0 0 5px rgba(255, 69, 0, 0.4)); }
            50% { transform: scale(1.1); filter: drop-shadow(0 0 15px rgba(255, 69, 0, 0.8)); }
            100% { transform: scale(1); filter: drop-shadow(0 0 5px rgba(255, 69, 0, 0.4)); }
        }
        /* DAILY MASTERY BUTTON (Gold Theme) */
        .btn-mastery {
            background: linear-gradient(135deg, #f59e0b 0%, #b45309 100%); /* Amber to Dark Gold */
            color: white;
            border: none;
            box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4); /* Golden Glow */
            transition: transform 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .btn-mastery:hover {
            box-shadow: 0 8px 25px rgba(245, 158, 11, 0.6);
            transform: translateY(-2px);
            filter: brightness(1.1);
        }
        /* 2. CRAM MODE BUTTON STYLING */
        .btn-cram {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            color: white;
            box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
            border: none;
        }
        .btn-cram:hover {
            box-shadow: 0 8px 25px rgba(124, 58, 237, 0.5);
            transform: translateY(-2px);
        }

        /* 3. STATUS CAPSULE (On Flashcards) */
        .status-header {
            display: flex;
            align-items: center;
            gap: 10px;         
            margin-bottom: 25px; 
            width: 100%;
            position: relative;
        }
        .clean-capsule { padding: 5px 14px; border-radius: 50px; font-size: 0.7rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid transparent; display: inline-block; backdrop-filter: blur(6px); transition: transform 0.2s ease; }
        .clean-capsule:hover { transform: scale(1.05); }
        .status-new { background: rgba(59, 130, 246, 0.15); color: #3b82f6; border-color: rgba(59, 130, 246, 0.3); box-shadow: 0 0 15px rgba(59, 130, 246, 0.35); }
        .status-again { background: rgba(244, 63, 94, 0.15); color: #f43f5e; border-color: rgba(244, 63, 94, 0.3); box-shadow: 0 0 15px rgba(244, 63, 94, 0.35); }
        .status-hard { background: rgba(249, 115, 22, 0.15); color: #f97316; border-color: rgba(249, 115, 22, 0.3); box-shadow: 0 0 15px rgba(249, 115, 22, 0.35); }
        .status-good { background: rgba(16, 185, 129, 0.15); color: #10b981; border-color: rgba(16, 185, 129, 0.3); box-shadow: 0 0 15px rgba(16, 185, 129, 0.35); }
        .status-easy { background: rgba(20, 184, 166, 0.15); color: #14b8a6; border-color: rgba(20, 184, 166, 0.3); box-shadow: 0 0 15px rgba(20, 184, 166, 0.35); }
        
        /* The Reset Button (FIX B: Outside & Aesthetic) */
        .capsule-reset-btn {
            background: transparent;
            border: none;
            color: var(--text-muted);
            font-size: 1.2rem;
            cursor: pointer;
            padding: 4px;
            border-radius: 50%;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0.5;
        }

        .capsule-reset-btn:hover {
            background: rgba(255,255,255,0.05);
            color: var(--primary);
            transform: rotate(-180deg); /* Playful interaction */
            opacity: 1;
        }

        .card-status-capsule { display: none !important; }

        /* =========================================
           7. MODALS, CHIPS & SETTINGS
           ========================================= */
        .modal-backdrop { 
            position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 200; 
            display: none; align-items: center; justify-content: center; backdrop-filter: blur(8px);
            opacity: 0; transition: opacity 0.3s ease;
        }
        .modal-backdrop.visible { opacity: 1; }
        
        .modal-card { 
            background: var(--bg-modal); width: 90%; max-width: 450px; border-radius: 24px; 
            padding: 30px; border: 1px solid var(--border-glass); box-shadow: var(--shadow-hover); 
            transform: translateY(20px); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            max-height: 85vh; overflow-y: auto;
        }
        .modal-backdrop.visible .modal-card { transform: translateY(0); }

        .setting-row {
            display: flex; justify-content: space-between; align-items: center;
            padding: 16px 0; border-bottom: 1px solid var(--border-glass);
        }
        .setting-row:last-child { border-bottom: none; }
        .setting-label { font-weight: 600; font-size: 1rem; }
        .setting-sub { font-size: 0.8rem; color: var(--text-muted); display: block; margin-top: 4px; }
        
        select {
            background: var(--bg-body); color: var(--text-main); border: 1px solid var(--border-glass);
            padding: 8px 12px; border-radius: 8px; font-family: var(--font-ui); outline: none;
        }

        /* Chips / Categories */
        .chip-container {
            display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px;
        }
        .chip {
            padding: 8px 16px; border-radius: 20px; background: var(--chip-bg);
            color: var(--text-muted); font-size: 0.9rem; font-weight: 600; cursor: pointer;
            border: 1px solid transparent; transition: var(--transition-smooth);
        }
        .chip:hover { background: var(--border-glass); color: var(--text-main); }
        .chip.active {
            background: var(--chip-active); color: var(--chip-active-text);
            box-shadow: 0 4px 12px rgba(45, 212, 191, 0.3);
        }

        /* Buttons */
        .btn-large {
            width: 100%; padding: 16px; border-radius: 16px; border: none;
            font-weight: 700; cursor: pointer; font-size: 1rem;
            transition: var(--transition-spring);
            display: flex; justify-content: center; align-items: center; gap: 8px;
        }
        .btn-primary { background: var(--primary); color: #000; box-shadow: 0 4px 15px rgba(45, 212, 191, 0.3); }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(45, 212, 191, 0.4); }
        .btn-outline { background: transparent; border: 1px solid var(--border-glass); color: var(--text-main); }
        .btn-outline:hover { background: var(--bg-glass); border-color: var(--primary); }
        .btn-small { padding: 6px 12px; font-size: 0.8rem; border-radius: 8px; cursor: pointer; }

        /* Toast */
        #toast { 
            position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%) translateY(20px); 
            background: var(--text-main); color: var(--bg-body); padding: 12px 24px; 
            border-radius: 50px; font-weight: 700; opacity: 0; pointer-events: none; 
            transition: var(--transition-spring); z-index: 20000 !important; 
            box-shadow: var(--shadow-soft); white-space: nowrap;
        }
        #toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

        /* Micro-Interactions */
        .loading-spinner {
            width: 20px; height: 20px; border: 3px solid var(--border-glass);
            border-top: 3px solid var(--primary); border-radius: 50%;
            animation: spin 1s linear infinite; display: none;
        }
        /* HEART POP ANIMATION */
        .heart-pop {
            position: absolute; top: 50%; left: 50%;
            transform: translate(-50%, -50%) scale(0);
            font-size: 6rem; color: var(--red);
            pointer-events: none; z-index: 50;
            opacity: 0;
        }
        .heart-pop.animate {
            animation: popFade 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes popFade {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
            50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
        }

        /* SNAPSHOT STYLES */
        .watermark-overlay {
            position: absolute; top: 20px; right: 20px;
            font-family: var(--font-ui); font-weight: 800; font-size: 1.5rem;
            color: rgba(255,255,255,0.8); text-shadow: 0 2px 4px rgba(0,0,0,0.5);
            z-index: 999; display: none; /* Hidden normally */
        }
        
        /* When capturing, hide the toolbar and show watermark */
        .news-card.capturing .action-toolbar-container { display: none !important; }
        .news-card.capturing .watermark-overlay {
            top: 20px;
            right: 20px;
            display: block !important;
            text-shadow: 0 2px 8px rgba(0,0,0,0.8); /* Stronger shadow for readability */
        }
        .news-card.capturing .card-img {
            margin-top: 0 !important;
            border-radius: 0 !important;
        }
        .news-card.capturing {
            border-radius: 0 !important;
            box-shadow: none !important;
            margin: 0 !important;       
            padding-top: 0 !important;  
            padding-bottom: 40px !important; /* Breathing room at bottom */
            transform: none !important;
            border: none !important; /* Remove any border that might look weird */
        }
        .news-card.capturing .scroll-content {
            overflow: visible !important;
            height: auto !important;
        }

        /* DESKTOP LAYOUT ENGINE (NEW)*/
        @media (min-width: 1024px) {
            /* 1. Main Container */
            #feed-list.layout-paper {
                display: block;
                max-width: 100%;
                margin: 0;
                padding: 40px;
                background: var(--bg-body);
            }

            /* 2. The Card (Viewport Window) */
            #feed-list.layout-paper .news-card {
                width: 100%;
                max-width: 1150px;
                height: 80vh; /* Fixed height relative to screen */
                margin: 0 auto 80px auto;
                
                background: var(--bg-card);
                border: 1px solid var(--border-glass);
                border-radius: 20px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                
                /* Reset any transforms */
                transform: none !important;
                /* Do NOT hide overflow here, let the child handle it */
                overflow: hidden; 
            }

            /* 3. The Layout Engine (Grid) */
            #feed-list.layout-paper .scroll-content {
                display: grid;
                width: 100%;
                height: 100%;
                
                /* 40% Image | 60% Content (Requested Split) */
                grid-template-columns: 40% 60%;
                
                /* Allow rows to form naturally */
                grid-auto-rows: min-content;
                
                /* THIS IS THE SCROLLER */
                overflow-y: auto; 
                scroll-behavior: smooth;
            }

            /* 4. LEFT PANE: Sticky Image */
            #feed-list.layout-paper .card-img {
                /* Place in Column 1, Span ALL Rows to cover full height */
                grid-column: 1;
                grid-row: 1 / span 10; 
                
                /* STICKY MAGIC: Pinned to the visual top of the scroller */
                position: sticky;
                top: 0;
                left: 0;
                
                /* Force dimensions */
                width: 100%;
                height: 80vh; /* Match the card height exactly */
                
                /* Visuals */
                object-fit: cover;
                border-radius: 0;
                border-right: 1px solid var(--border-glass);
                margin: 0;
                z-index: 2;
            }

            /* 5. RIGHT PANE: Content Flow */
            #feed-list.layout-paper .card-body {
                grid-column: 2;
                /* Natural flow: Text comes first */
                
                padding: 60px 60px 20px 60px;
                width: 100%;
                
                display: flex;
                flex-direction: column;
                justify-content: flex-start; /* Ensure top align */
            }

            /* 6. RIGHT PANE: Toolbar (Flows naturally after text) */
            #feed-list.layout-paper .action-toolbar-container {
                grid-column: 2;
                padding: 20px 60px 60px 60px; 
                width: 100%;
                display: flex; 
                justify-content: flex-end; 
                background: transparent;
                border: none;
            }

            /* --- Styling Polish --- */
            #feed-list.layout-paper .action-toolbar {
                margin: 0; /* Align Left */
                width: fit-content;
                background: var(--bg-body);
                border: 1px solid var(--border-glass);
            }

            #feed-list.layout-paper h2 {
                font-family: var(--font-read);
                font-size: 2.6rem;
                line-height: 1.2;
                margin-bottom: 25px;
                color: var(--text-main);
            }

            #feed-list.layout-paper .summary-box {
                font-family: var(--font-read);
                font-size: 1.15rem;
                line-height: 1.8;
                color: var(--text-muted);
                -webkit-line-clamp: unset; /* Show Full Text */
                display: block;
            }

            #feed-list.layout-paper .meta-row {
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                gap: 15px;
            }

            /* Scrollbar Polish */
            #feed-list.layout-paper .scroll-content::-webkit-scrollbar { width: 8px; }
            #feed-list.layout-paper .scroll-content::-webkit-scrollbar-track { background: var(--bg-card); }
            #feed-list.layout-paper .scroll-content::-webkit-scrollbar-thumb {
                background: var(--border-glass);
                border-radius: 4px;
            }

            /* --- Text Only Card Fix --- */
            #feed-list.layout-paper .news-card.text-only .scroll-content {
                grid-template-columns: 100%; /* Full width */
            }
            #feed-list.layout-paper .news-card.text-only .card-img { display: none; }
            #feed-list.layout-paper .news-card.text-only .card-body,
            #feed-list.layout-paper .news-card.text-only .action-toolbar-container {
                grid-column: 1;
                max-width: 800px; /* Constrain reading width */
                margin: 0 auto;
            }
        }

        /* Search Input Styling inside Modal */
        .search-input-container {
            position: relative;
            margin-bottom: 20px;
        }
        .search-input {
            width: 100%;
            padding: 14px 16px 14px 45px; /* Space for icon */
            background: var(--bg-body);
            border: 1px solid var(--border-glass);
            border-radius: 12px;
            color: var(--text-main);
            font-size: 1rem;
            font-family: var(--font-ui);
            transition: all 0.3s ease;
        }
        .search-input:focus {
            border-color: var(--primary);
            box-shadow: 0 0 0 3px var(--primary-dim);
        }
        .search-icon-overlay {
            position: absolute;
            left: 14px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-muted);
            pointer-events: none;
        }

        /* Highlight Styling for Search Matches */
        .search-highlight {
            background-color: rgba(244, 63, 94, 0.25); /* Transparent Red */
            color: var(--red);
            font-weight: 800;
            border-radius: 2px;
            padding: 0 2px;
        }
        .search-clear-btn {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            background: transparent;
            border: none;
            color: var(--text-muted);
            font-weight: bold;
            font-size: 1rem;
            cursor: pointer;
            padding: 5px; /* Larger clickable area */
            display: none; /* Hidden by default */
            transition: color 0.2s;
        }
        .search-clear-btn:hover {
            color: var(--primary);
        }

        /* --- NATIVE AD STYLING --- */
        .news-card.ad-unit {
            border: 1px solid var(--primary-dim); /* Subtle border to distinguish */
        }

        .news-card.ad-unit .badge {
            background: transparent;
            border: 1px solid var(--text-muted);
            color: var(--text-muted);
            font-size: 0.65rem;
            letter-spacing: 1px;
        }

        .ad-cta-container {
            padding: 15px 24px 30px 24px;
            display: flex;
            justify-content: center;
            width: 100%;
        }

        .ad-cta-btn {
            width: 100%;
            background: var(--text-main);
            color: var(--bg-card);
            padding: 14px;
            border-radius: 50px;
            font-weight: 800;
            text-transform: uppercase;
            font-size: 0.9rem;
            letter-spacing: 1px;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .ad-cta-btn:hover {
            transform: scale(1.02);
            opacity: 0.95;
        }

        .ad-cta-btn svg {
            width: 18px; 
            height: 18px; 
            stroke-width: 2.5;
        }
        /* --- ADVERTISING CONTAINERS --- */
        .news-card.google-ad-unit {
            justify-content: center;
            align-items: center;
            background: var(--bg-card);
            position: relative;
            overflow: hidden;
        }

        .google-ad-wrapper {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            background: rgba(0,0,0,0.02); /* Slight contrast */
        }

        .ad-label-corner {
            position: absolute;
            top: 10px;
            right: 10px;
            font-size: 0.6rem;
            color: var(--text-muted);
            border: 1px solid var(--border-glass);
            padding: 2px 6px;
            border-radius: 4px;
            z-index: 10;
            pointer-events: none;
        }
        .google-ad-unit {
            min-height: 280px; /* Force height so it doesn't collapse */
            background: radial-gradient(circle, var(--bg-card) 0%, var(--bg-body) 100%);
            border: 1px dashed var(--border-glass);
        }

        .google-ad-unit:empty::before {
            content: 'Advertisement Loading...';
            color: var(--text-muted);
            font-size: 0.8rem;
        }
        /* PULL TO REFRESH (PTR) - NEW */
        #ptr-zone {
            height: 0;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            background: transparent;
            transition: height 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* Spring feel */
            will-change: height;
        }

        .ptr-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            opacity: 0;
            transform: translateY(-10px);
            transition: opacity 0.2s, transform 0.2s;
        }

        #ptr-zone.visible .ptr-content {
            opacity: 1;
            transform: translateY(0);
        }

        .ptr-icon-arrow {
            width: 24px;
            height: 24px;
            stroke: var(--primary);
            stroke-width: 2.5;
            fill: none;
            transition: transform 0.3s ease;
        }

        .ptr-icon-arrow.rotate {
            transform: rotate(180deg); /* Visual cue to release */
        }

        .ptr-spinner {
            width: 24px;
            height: 24px;
            border: 3px solid var(--border-glass);
            border-top: 3px solid var(--primary);
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            display: none;
        }

        /* Prevent browser native refresh on Android to avoid conflict */
        body {
            overscroll-behavior-y: contain; 
        }


    </style>
</head>
<body class="theme-dark">

    <div id="startup-loader">
        <div class="loader-spinner"></div>
        <div style="font-weight: 800; letter-spacing: 1px; margin-bottom: 10px;">CIVILSKASH</div>
        <div style="font-size: 0.8rem; color: var(--text-muted);">Initializing Engine...</div>
        <div id="debug-console"></div>
    </div>

    <header>
        <h1 class="brand" onclick="App.Actions.goHome()">Civils<span>Kash</span></h1>
        <div class="header-actions">
            <button class="icon-btn" id="sync-btn" onclick="App.Actions.triggerSync()" title="Check for Latest Feed">
                <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
            <button class="icon-btn" id="category-btn" onclick="App.UI.openModal('modal-categories')" title="Filter Categories">
                <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                <span class="badge-dot" id="category-active-badge"></span>
            </button>
            
            <button class="icon-btn" id="bookmarks-btn" onclick="App.Actions.toggleBookmarksFilter()" title="Show Bookmarks Only">
                <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </button>
            
            <button class="icon-btn" id="global-hide-btn" onclick="App.Actions.toggleGlobalHide()" title="Toggle Keywords">
                 <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>
            
            <button class="icon-btn" onclick="App.UI.openModal('modal-quiz-menu')" title="Practice & Quiz">
                <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            </button>
            
            <button class="icon-btn" onclick="App.UI.openModal('modal-settings')" title="Settings">
                <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>
        </div>
    </header>

    <div id="app-container">
        <div id="ptr-zone">
            <div class="ptr-content">
                <svg id="ptr-arrow" class="ptr-icon-arrow" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
                <div id="ptr-spinner" class="ptr-spinner"></div>
            </div>
        </div>
        <div id="feed-list"></div>
    </div>

    <div id="modal-categories" class="modal-backdrop">
        <div class="modal-card">
            
            <div class="search-input-container">
                <svg class="search-icon-overlay" width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                
                <input type="text" id="global-search-input" class="search-input" 
                    placeholder="Search topics..." 
                    oninput="App.Actions.handleSearch(this.value)"
                    onkeydown="if(event.key === 'Enter') { this.blur(); App.UI.closeModals(); }">
                <button id="search-clear-btn" class="search-clear-btn" onclick="App.Actions.clearSearch()">✕</button>
            </div>

            <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom: 10px;">Or Filter by Category:</p>
            <div class="chip-container" id="category-chips-container"></div>
            
            <button class="btn-large btn-outline" onclick="App.UI.closeModals()" style="margin-top:20px;">Done</button>
        </div>
    </div>

    <div id="modal-quiz-menu" class="modal-backdrop">
        <div class="modal-card">
        
            <div class="streak-container">
                <div class="fire-wrapper">
                    <span class="fire-icon" id="streak-fire-icon">🔥</span>
                    <div class="streak-count" id="streak-badge">0</div>
                </div>
                <div class="streak-label" id="streak-title">Ignite the Fire!</div>
                <div class="streak-sub" id="streak-sub">Complete a session to build streak</div>
            </div>

            <button class="btn-large btn-outline" onclick="App.Quiz.startPractice()" style="margin-bottom:12px;">
                <div style="text-align:left; flex:1;">
                    <div>Practice Mode</div>
                    <div style="font-size:0.75rem; color:var(--text-muted); font-weight:400;">Newest & Unseen Cards</div>
                </div>
                <span>📖</span>
            </button>
            
            <button class="btn-large btn-mastery" onclick="App.Quiz.startTest()" style="margin-bottom:12px;">
                <div style="text-align:left; flex:1;">
                    <div>Daily Mastery</div>
                    <div style="font-size:0.75rem; opacity:0.9; font-weight:400;">Spaced Repetition (SRS)</div>
                </div>
                <span style="font-size: 1.5rem; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">🏆</span>
            </button>

            <button class="btn-large btn-cram" onclick="App.Quiz.startCram()">
                <div style="text-align:left; flex:1;">
                    <div>Cram Mode</div>
                    <div style="font-size:0.75rem; opacity:0.9; font-weight:400;">Focus on SRS Revision</div>
                </div>
                <span>⚡</span>
            </button>

            <button class="icon-btn" onclick="App.UI.closeModals()" style="position:absolute; top:20px; right:20px;">✕</button>
        </div>
    </div>

    <div id="quiz-fullscreen-layer">
        <div class="quiz-navbar">
            <div style="font-weight:800; font-size:0.9rem; letter-spacing:1px;" id="quiz-header-label">DAILY TEST</div>
            <div class="quiz-progress-track">
                <div class="quiz-progress-fill" id="quiz-progress-bar"></div>
            </div>
            <button class="icon-btn" onclick="App.Quiz.exit()" title="Exit Quiz">✕</button>
        </div>

        <div class="quiz-stage">
            <div class="quiz-card-wrapper" id="quiz-card-wrapper">
                <div class="quiz-face quiz-front">
                    <div class="quiz-scroll-area">
                        <div class="quiz-question-text" id="fc-front-text">Loading...</div>
                    </div>
                    <div class="quiz-actions-area">
                        <button class="btn-large btn-primary" onclick="App.Quiz.flip()">Show Answer</button>
                    </div>
                </div>
                <div class="quiz-face quiz-back">
                    <div class="quiz-scroll-area">
                        <div class="quiz-question-text" id="fc-back-text">Answer...</div>
                    </div>
                    <div class="quiz-actions-area" id="quiz-back-controls">
                        </div>
                </div>
            </div>
            
            <div id="quiz-summary">
                <h1 style="font-size:3rem; margin-bottom:10px;">🎉</h1>
                <h2 style="font-size:2rem; font-weight:800; margin-bottom:10px;">Test Complete!</h2>
                <h3 style="font-size:2.5rem; color:var(--primary); margin-bottom:10px;" id="quiz-final-score">0 / 10</h3>
                <p style="color:var(--text-muted); margin-bottom:30px;" id="quiz-summary-text">Good effort!</p>
                <button class="btn-large btn-primary" style="max-width:200px;" onclick="App.Quiz.exit()">Back to Feed</button>
            </div>
        </div>
    </div>
    <div id="modal-share-menu" class="modal-backdrop">
        <div class="modal-card" style="text-align:center;">
            <div style="font-size:3rem; margin-bottom:10px;">📤</div>
            <h2 style="margin-bottom:5px;">Share Content</h2>
            <p style="color:var(--text-muted); margin-bottom:25px; font-size:0.9rem;">Choose how you want to share this card.</p>
            
            <button class="btn-large btn-primary" onclick="App.Actions.executeShare('link')">
                <div style="text-align:left; flex:1;">
                    <div>Share as Locator</div>
                    <div style="font-size:0.75rem; opacity:0.8; font-weight:400;">Smart Test Summary</div>
                </div>
                <span>🔗</span>
            </button>
            
            <div style="height:12px;"></div>

            <button class="btn-large btn-outline" onclick="App.Actions.executeShare('image')">
                <div style="text-align:left; flex:1;">
                    <div>Share as Image</div>
                    <div style="font-size:0.75rem; color:var(--text-muted); font-weight:400;">Screenshot for Instagram/Status</div>
                </div>
                <span>📸</span>
            </button>

            <button class="btn-large btn-outline" style="border:none; color:var(--text-muted); margin-top:15px;" onclick="App.UI.closeModals()">
                Cancel
            </button>
        </div>
    </div>
    <div id="modal-notekash-tutorial" class="modal-backdrop">
        <div class="modal-card">
            <h2 style="margin-bottom:15px; display:flex; align-items:center; gap:10px;">
                <span>🚀</span> Power Up with NoteKash
            </h2>
            
            <p style="margin-bottom:20px; font-size:0.95rem; line-height:1.6;">
                Transfer your current feeds, flashcards, and bookmarks directly into the main <b>NoteKash App</b> to enable advanced study features.
            </p>

            <div style="background:var(--bg-body); padding:15px; border-radius:12px; border:1px solid var(--border-glass); margin-bottom:20px;">
                <ul class="tutorial-list" style="padding-left:20px; margin:0;">
                    <li><b>1. Export:</b> Click the "Export" button in Settings to save a <span class="tutorial-highlight">.notekash</span> file.</li>
                    <li><b>2. Open NoteKash:</b> Go to Settings > Storage & Sync.</li>
                    <li><b>3. Import:</b> Select "Import Backup" and choose this file.</li>
                </ul>
            </div>

            <div style="margin-bottom:20px; padding:12px; background:rgba(45, 212, 191, 0.1); border-radius:12px; border-left:4px solid var(--primary);">
                <strong style="color:var(--primary);">🔥 Why do this?</strong><br>
                <span style="font-size:0.9rem; opacity:0.9;">Your extracted flashcards are automatically injected into NoteKash's <b style="color:var(--text-main)">Advanced SRS Algorithm</b> (Spaced Repetition) ensuring you never forget a concept.</span>
            </div>

            <button class="btn-large btn-primary" onclick="window.open('https://notekash.com', '_blank')">Go to NoteKash</button>
            <button class="btn-large btn-outline" onclick="document.getElementById('modal-notekash-tutorial').classList.remove('visible'); setTimeout(() => document.getElementById('modal-notekash-tutorial').style.display = 'none', 300);" style="margin-top:10px;">Close</button>
        </div>
</div>
    <div id="modal-settings" class="modal-backdrop">
        <div class="modal-card">
            <h2 style="margin-bottom:20px;">Settings</h2>
            <div class="setting-row">
                <div>
                    <span class="setting-label">Make your Note</span>
                    <span class="setting-sub">Add a personal note/flashcard manually</span>
                </div>
                <button class="btn-small btn-primary" 
                        onclick="document.getElementById('input-card-title').value=''; document.getElementById('input-card-body').value=''; App.UI.openModal('modal-create-card')">
                    Create
                </button>
            </div>
            <div class="setting-row">
                <div>
                    <span class="setting-label">App Theme</span>
                    <span class="setting-sub">Choose your visual style</span>
                </div>
                <select id="theme-select" onchange="App.Actions.setTheme(this.value)" style="min-width: 120px;">
                    <option value="dark">Dark (Default)</option>
                    <option value="light">Light (Day)</option>
                    <option value="sepia">Sepia (Reader)</option>
                </select>
            </div>

            <div class="setting-row">
                <div>
                    <span class="setting-label">Desktop Layout</span>
                    <span class="setting-sub">Customize the feed view (PC Only)</span>
                </div>
                <select id="layout-select" onchange="App.Actions.setLayout(this.value)" style="min-width: 120px;">
                    <option value="grid">Grid (Cards)</option>
                    <option value="paper">Paper (List)</option>
                </select>
            </div>

            <div class="setting-row">
                <div>
                    <span class="setting-label">Update Content</span>
                    <span class="setting-sub">Fetch latest flashcards and notes</span>
                </div>
                <button class="btn-small btn-outline" onclick="App.Data.forceUpdate()">
                    <span id="update-btn-text">Check Updates</span>
                    <div class="loading-spinner" id="update-spinner"></div>
                </button>
            </div>
            <div class="setting-row">
                <div>
                    <span class="setting-label">CivilKash Update</span>
                    <span class="setting-sub">Move to latest version of App</span>
                </div>
                <button class="btn-small btn-outline" 
                        style="border-color:var(--red); color:var(--red);" 
                        onclick="App.UI.openModal('modal-force-update')">
                    Install Version
                </button>
            </div>

            <div class="setting-row">
                <div style="display:flex; flex-direction:column; width:100%;">
                    <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                        <span class="setting-label">Export to NoteKash App</span>
                        <button class="icon-btn info-icon-btn" onclick="App.UI.openModal('modal-notekash-tutorial')" style="width:20px; height:20px; padding:0;" title="How to use this?">
                            <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </button>
                    </div>
                    <span class="setting-sub">Save your notes & flashcards to NoteKash App</span>
                </div>
            </div>
            <div style="display:flex; gap:10px; margin-top:10px;">
                <select id="export-category-select" style="flex:1;">
                    <option value="all">All Categories</option>
                    <option value="bookmarks">Bookmarked Only</option>
                </select>
                <button class="btn-primary" style="padding:8px 16px; border-radius:8px; border:none; font-weight:700; cursor:pointer;" onclick="App.Export.download()">Export</button>
            </div>

            <button class="btn-large btn-outline" onclick="App.UI.closeModals()" style="margin-top:20px;">Close</button>
        </div>
    </div>
    <div id="modal-force-update" class="modal-backdrop">
        <div class="modal-card" style="text-align:center; border: 1px solid var(--red);">
            <div style="font-size:3rem; margin-bottom:10px; animation: bounce 2s infinite;">⚠️</div>
            <h2 style="margin-bottom:10px; color: var(--red);">Force Update?</h2>
            <p style="color:var(--text-muted); margin-bottom:25px; line-height: 1.5;">
                Export your bookmarks to NoteKash App before continuing to Force Update App to Latest Version.
            </p>
            <div style="display:flex; gap:15px;">
                <button class="btn-large btn-outline" onclick="App.UI.closeModals()">Cancel</button>
                <button class="btn-large btn-primary" 
                        style="background:var(--red); color:white; border:none; box-shadow: 0 4px 15px rgba(244, 63, 94, 0.4);" 
                        onclick="App.System.executeHardRefresh()">
                    Yes, Update
                </button>
            </div>
        </div>
    </div>
    <div id="modal-create-card" class="modal-backdrop">
        <div class="modal-card">
            <h2 style="margin-bottom:15px;">New Note 📝</h2>
            
            <div style="margin-bottom:15px;">
                <label style="display:block; color:var(--text-muted); font-size:0.8rem; margin-bottom:5px;">Title of Note</label>
                <input type="text" id="input-card-title" class="search-input" placeholder="Topic..." style="padding-left:12px;">
            </div>

            <div style="margin-bottom:20px;">
                <label style="display:block; color:var(--text-muted); font-size:0.8rem; margin-bottom:5px;">Content of Note - (Use {{c1::cloze}} for creating flashcards e.g {{c1::keyword}})</label>
                <textarea id="input-card-body" class="search-input" rows="6" placeholder="Paste text here..." style="padding:12px; height:auto; resize:vertical;"></textarea>
            </div>

            <div style="display:flex; gap:10px;">
                <button class="btn-large btn-outline" onclick="App.UI.closeModals()">Cancel</button>
                <button class="btn-large btn-primary" onclick="App.Actions.saveSharedNote()">Save to Feed</button>
            </div>
        </div>
    </div>
    <div id="toast">Notification</div>

    <script>
        /**
         * CivilsKash v0.12 - Ultimate Edition
         * "No Shortcuts" Architecture:
         * 1. Global Error Handling (Safety)
         * 2. IndexedDB with Memory Fallback (Reliability)
         * 3. Full 3D Quiz Engine (Mastery)
         * 4. External Data Sync (Connectivity)
         */

        // 1. GLOBAL SAFETY NET
        window.onerror = function(msg, url, line) {
            const el = document.getElementById('debug-console');
            el.style.display = 'block';
            el.innerText += `[Error] ${msg} (Line ${line})\n`;
            // Keep loader visible so user sees error
            return false;
        };

        const App = {
            // --- DATABASE LAYER (Robust) ---
            DB: {
                dbName: 'CivilsKashDB',
                version: 3,
                db: null,
                isWorking: true, // Flag if DB is active
                async init() {
                    return new Promise((resolve) => {
                        // Check if IDB exists
                        if (!window.indexedDB) { 
                            console.warn("IDB not supported"); 
                            this.isWorking = false; 
                            return resolve(); 
                        }
                        
                        try {
                            const request = indexedDB.open(this.dbName, this.version);
                            request.onupgradeneeded = (e) => {
                            const db = e.target.result;
                            if (!db.objectStoreNames.contains('settings')) db.createObjectStore('settings');
                            if (!db.objectStoreNames.contains('bookmarks')) db.createObjectStore('bookmarks');
                            if (!db.objectStoreNames.contains('srs_data')) db.createObjectStore('srs_data', { keyPath: 'id' });
                            if (!db.objectStoreNames.contains('feed_cache')) db.createObjectStore('feed_cache', { keyPath: 'id' });
                        };
                            request.onsuccess = (e) => { 
                                this.db = e.target.result; 
                                resolve(); 
                            };
                            request.onerror = (e) => {
                                console.warn("IDB Blocked/Error", e);
                                this.isWorking = false; // Fallback to memory
                                resolve();
                            };
                        } catch (err) {
                            console.warn("IDB Try-Catch Error", err);
                            this.isWorking = false;
                            resolve();
                        }
                    });
                },
                async get(store, key) {
                    if (!this.isWorking || !this.db) return null; // Fallback
                    return new Promise(resolve => {
                        try {
                            const tx = this.db.transaction(store, 'readonly');
                            const req = tx.objectStore(store).get(key);
                            req.onsuccess = () => resolve(req.result);
                            req.onerror = () => resolve(null);
                        } catch(e) { resolve(null); }
                    });
                },
                async put(store, key, value) {
                    if (!this.isWorking || !this.db) return;
                    try {
                        const tx = this.db.transaction(store, 'readwrite');
                        if (key) tx.objectStore(store).put(value, key);
                        else tx.objectStore(store).put(value);
                    } catch(e) { console.error("Put Failed", e); }
                },
                async getAll(store) {
                    if (!this.isWorking || !this.db) return [];
                    return new Promise(resolve => {
                        try {
                            const tx = this.db.transaction(store, 'readonly');
                            const req = tx.objectStore(store).getAll();
                            req.onsuccess = () => resolve(req.result);
                            req.onerror = () => resolve([]);
                        } catch(e) { resolve([]); }
                    });
                }
            },

            // --- STATE MANAGEMENT ---
            State: { 
                feed: [], 
                bookmarks: new Set(), 
                filterBookmarks: false,
                activeCategory: 'all',
                desktopLayout: 'grid',
                searchTerm: '',
                srsData: {}, 
                isDark: true, 
                isGlobalHide: false,
                quiz: { mode: null, deck: [], index: 0, currentScore: 0 },
                contentUrl: 'https://script.google.com/macros/s/AKfycbxK7nCpv9ERmwbxQeoMKqyADLxgOLimbNMQG5hddgOO-yHx_o5Izt3ZUDDq31ahWAJp/exec',
                activeDeepLink: null
            },

            Icons: {
                eyeOpen: `<svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>`,
                eyeClosed: `<svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>`
            },

            // --- SMART ADVERTISING ENGINE ---
           Ads: {
                globalAdCounter: 0,
                
                // CONFIGURATION - CONTROL CENTER
                config: {
                    adsEnabled: true, 
                    useGoogleAds: false, 
                    ratio: 8, 
                    googleClientId: 'ca-pub-9975373090727883', 
                    googleSlotId: '4503514490' 
                },

                // SELF PROMOTION INVENTORY
                inventory: [
                    {
                        id: 'self_1',
                        image: 'https://miro.medium.com/v2/resize:fit:1200/1*Ysj2J2neckgBRC4VBw7Idw.jpeg',
                        title: 'Master Your Focus',
                        summary: 'Struggling to remember GK facts? Try NoteKash Flashcard App, creating flashcards through SRS Algorithm will help you memorize facts in timely Interval',
                        cta: 'Learn Method',
                        link: 'https://notekash.com'
                    },
                    {
                        id: 'self_2',
                        image: 'https://img.freepik.com/premium-photo/concept-time-clock-timer-generate-ai_272168-1923.jpg?w=2000',
                        title: 'Go through Quiz',
                        summary: 'Remember Current Affairs as you Read them, go through the Quiz mode of App to Recall important Highlights of Article Cards',
                        cta: 'Start Memorizing Now',
                        link: '#tests'
                    },
                    {
                        id: 'self_3',
                        image: 'https://static.vecteezy.com/system/resources/previews/029/290/771/large_2x/ai-generative-of-a-man-practicing-mindfulness-and-meditation-in-a-peaceful-natural-environment-sony-a7s-realistic-image-ultra-hd-high-design-very-detailed-free-photo.jpg',
                        title: 'Join NoteKash',
                        summary: 'Sync your study notes or convert your notes into Presentation. The ultimate note taking companion app for serious aspirants.',
                        cta: 'Start your Journey',
                        link: 'https://notekash.com'
                    },
                    {
                        id: 'self_4',
                        image: 'https://tse2.mm.bing.net/th/id/OIP.DxEmmErx4eHANwcN4D8PFwHaE8?rs=1&pid=ImgDetMain&o=7&rm=3',
                        title: 'Feedback is Essential?',
                        summary: 'Your insights drive our roadmap. Share your thoughts and help us build your ultimate study companion. You can also contact us for Monthly Current Affairs Packages',
                        cta: 'Contact Directly',
                        link: 'mailto:learningmarvel@gmail.com?subject=CivilKash%20Feedback'
                    },
                    {
                        id: 'self_5',
                        image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80',
                        title: 'Fuel the Mission 🚀',
                        summary: 'CivilsKash is a passion project built to keep quality education accessible. If this tool aids your preparation, a small contribution helps keep our servers alive and updates coming.',
                        cta: 'Support the Dev ☕',
                        link: 'upi://pay?pa=7006405127@ikwik&pn=SuhaibRashid&am=0&cu=INR' 
                    }

                ],

                // DECISION ENGINE
                getNextType() {
                    // 1. Safety Check: If master switch is off, return nothing
                    if (!this.config.adsEnabled) return 'none';

                    this.globalAdCounter++;
                    
                    // 2. "No Blank Space" Logic:
                    if (!this.config.useGoogleAds) return 'self';

                    // 3. Standard Logic (only runs if Google is enabled)
                    const isPlaceholder = this.config.googleClientId.includes('XXXXXXXXXXXXXXXX');
                    if (isPlaceholder) return 'self';
                    
                    if (typeof window.adsbygoogle === 'undefined' && !document.querySelector('script[src*="adsbygoogle"]')) return 'self';
                
                    if (this.globalAdCounter % this.config.ratio === 0) return 'self';

                    return 'google';
                },
                
                getRotatedSelfAd() {
                    let lastIndex = parseInt(localStorage.getItem('civilsKash_last_ad_idx') || '-1');
                    let nextIndex = (lastIndex + 1) % this.inventory.length;
                    localStorage.setItem('civilsKash_last_ad_idx', nextIndex);
                    return this.inventory[nextIndex];
                },

                triggerGoogleAds() {
                    // Safety: Don't trigger if disabled
                    if (!this.config.adsEnabled || !this.config.useGoogleAds) return;

                    try {
                        if(this.getNextType() === 'self') return; 
                        const ads = document.querySelectorAll('.adsbygoogle');
                        ads.forEach(ad => {
                            if (ad.innerHTML.trim() === '') (window.adsbygoogle = window.adsbygoogle || []).push({});
                        });
                    } catch (e) { console.log("AdSense Trigger Error:", e); }
                }
            },

            // --- PULL TO REFRESH ENGINE (Fixed: Intent Gating) ---
            PTR: {
                dom: {
                    container: null,
                    zone: null,
                    arrow: null,
                    spinner: null
                },
                state: {
                    startY: 0,
                    dist: 0,
                    threshold: 80, 
                    isRefreshing: false,
                    canPull: false 
                },

                init() {
                    this.dom.container = document.getElementById('app-container');
                    this.dom.zone = document.getElementById('ptr-zone');
                    this.dom.arrow = document.getElementById('ptr-arrow');
                    this.dom.spinner = document.getElementById('ptr-spinner');

                    this.dom.container.addEventListener('touchstart', (e) => this.touchStart(e), { passive: false });
                    this.dom.container.addEventListener('touchmove', (e) => this.touchMove(e), { passive: false });
                    this.dom.container.addEventListener('touchend', () => this.touchEnd());
                },

                touchStart(e) {
                    this.state.startY = e.touches[0].clientY;
                    this.state.dist = 0;

                    if (this.dom.container.scrollTop <= 1 && !this.state.isRefreshing) {
                        this.state.canPull = true;
                        this.dom.zone.style.transition = 'none'; 
                    } else {
                        this.state.canPull = false;
                    }
                },

                touchMove(e) {
                    if (!this.state.canPull || this.state.isRefreshing) return;

                    const y = e.touches[0].clientY;
                    const diff = y - this.state.startY;
                    if (diff > 0) {
                        if (e.cancelable) e.preventDefault();

                        this.state.dist = Math.pow(diff, 0.85); 
         
                        if(this.state.dist > 150) this.state.dist = 150;

                        this.dom.zone.style.height = `${this.state.dist}px`;
                        this.dom.zone.classList.add('visible');

                        if (this.state.dist > this.state.threshold) {
                            this.dom.arrow.classList.add('rotate');
                            if(navigator.vibrate && !this.dom.arrow.dataset.vibrated) { 
                                navigator.vibrate(5); 
                                this.dom.arrow.dataset.vibrated = "true"; // Debounce vibration
                            }
                        } else {
                            this.dom.arrow.classList.remove('rotate');
                            this.dom.arrow.dataset.vibrated = "";
                        }
                    } else {
                        this.dom.zone.style.height = '0px';
                    }
                },

                async touchEnd() {
                    this.state.canPull = false; 
                    this.dom.arrow.dataset.vibrated = "";

                    this.dom.zone.style.transition = 'height 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

                    if (this.state.dist > this.state.threshold) {
                        // A. Trigger Refresh
                        this.state.isRefreshing = true;
                        this.dom.zone.style.height = '60px'; // Snap to loading height
                        this.dom.arrow.style.display = 'none';
                        this.dom.spinner.style.display = 'block';

                        try {
                            await App.Data.forceUpdate(); 
                        } catch (err) {
                            console.warn("PTR Update failed", err);
                        } finally {
                            setTimeout(() => this.reset(), 800);
                        }

                    } else {
                        this.dom.zone.style.height = '0px';
                        this.dom.zone.classList.remove('visible');
                        this.state.dist = 0;
                    }
                },

                reset() {
                    this.dom.zone.style.height = '0px';
                    this.dom.zone.classList.remove('visible');
                    this.state.isRefreshing = false; 
                    this.state.dist = 0;
                
                    setTimeout(() => {
                        this.dom.arrow.style.display = 'block';
                        this.dom.arrow.classList.remove('rotate');
                        this.dom.spinner.style.display = 'none';
                    }, 300);
                }
            },

            // --- DATA ENGINE (Fetch + Hardcoded) ---
            Data: {
                async loadLocal() {
                    const hardcoded = this.getHardcodedData();
                    const cached = await App.DB.getAll('feed_cache');
                    
                    const feedMap = new Map();
                    
                    hardcoded.forEach(item => feedMap.set(item.id, item));
                    
                    cached.forEach(item => feedMap.set(item.id, item));
                    
                    return Array.from(feedMap.values()).reverse(); 
                },

                // 2. Network Sync: Fetch -> Save to DB -> Return
                async syncNetwork() {
                    if (!App.State.contentUrl) return null;

                    try {
                      
                        const separator = App.State.contentUrl.includes('?') ? '&' : '?';
                        const freshUrl = `${App.State.contentUrl}${separator}t=${Date.now()}`;

                        const res = await fetch(freshUrl, {
                            method: 'GET',
                            redirect: 'follow' 
                        });

                        if (res.ok) {
                            const cloudData = await res.json();
                            const normalizedCloud = this.normalize(cloudData);
                        
                            const tx = App.DB.db.transaction('feed_cache', 'readwrite');
                            const store = tx.objectStore('feed_cache');
                            normalizedCloud.forEach(item => store.put(item));
                            
                            return normalizedCloud;
                        }
                    } catch (e) {
                        console.warn("Background Sync failed (Offline)", e);
                        return null;
                    }
                },

                getHardcodedData() {
                    const rawData = [
                        { 
                            category: "Current Affairs", 
                            date: "Daily Update", 
                            image: "https://tse3.mm.bing.net/th/id/OIP.WvbBV909fzI7zuLUadLrgQHaE6?rs=1&pid=ImgDetMain&o=7&rm=3", 
                            title: "Daily Current Affairs Quiz UPSC JKPSC", 
                            summary: "Boost your preparation with high-yield MCQs for UPSC and JKPSC Prelims. Do you know 'Panchamrit' strategy from COP26, which relates to India's {{c1::Climate Action}} goals. What about Article {{c2::35A}} which was abolished recently with Article 370. Do you know difference between ICJ and ICC. What about recent Environmental regulation considered Black law?. Regular practice of these static and dynamic topics on CivilsKash will boost your ability to crack competitive exams."
                        },
                        { 
                            category: "Polity", 
                            date: "Cheat Sheet", 
                            image: "https://media.istockphoto.com/id/1007178836/photo/indian-supreme-court.jpg?s=612x612&w=0&k=20&c=sVUxnP1WCkC62og2fjbzgdUMleD3WoeOzbBgNiJ9y_Y=",
                            title: "Schedules of Indian Constitution Mnemonic", 
                            summary: "Memorizing the 12 Schedules of the Indian Constitution is crucial for matching questions in Prelims. Use the famous trick: '{{c1::TEARS OF OLD PM}}'. T stands for Territories (1st Schedule), E for Emoluments (2nd), A for Affirmations (3rd), and R for Rajya Sabha seats (4th). The 10th Schedule, added by the {{c2::52nd}} Amendment Act of 1985, deals with the Anti-Defection Law, often referred to as the 'Dal Badal' law."
                        },
                        { 
                            category: "History", 
                            date: "Modern India",
                            image: "https://i0.wp.com/glimpsesofhistory.com/wp-content/uploads/2020/08/Captain_William_Bentinck_1764-1813_by_George_Romney.jpg?fit=1067%2C1280&ssl=1", 
                            title: "Governor General vs Viceroy Modern History", 
                            summary: "Aspirants often confuse these colonial titles. The Regulating Act of {{c1::1773}} created the post of Governor General of Bengal (Warren Hastings). Later, the Charter Act of {{c2::1833}} elevated this to Governor General of India (William Bentinck). Finally, after the Revolt of 1857, the Government of India Act 1858 transferred power to the British Crown, creating the title of {{c1::Viceroy}}, with Lord Canning becoming the first Viceroy of India."
                        },
                        { 
                            category: "Environment", 
                            date: "Updated List",
                            image: "https://cdn.downtoearth.org.in/library/large/2022-11-08/0.94591600_1667918565_33.jpg",
                            title: "List of New Ramsar Sites in India 2026", 
                            summary: "India has significantly expanded its conservation network, with the total number of Ramsar sites crossing {{c1::94}}. The {{c2::Sundarbans}} in West Bengal remains the largest site by area. Important wetland sites in Jammu & Kashmir like Wular Lake, Hokera, and Surinsar-Mansar are critical for migratory birds. Under the Montreux Record, only two Indian sites are currently listed: {{c1::Keoladeo}} National Park (Rajasthan) and {{c1::Loktak Lake }}(Manipur)."
                        },
                        {
                            category: "Polity", 
                            date: "Act 2019",
                            title: "Key Provisions J&K Reorganization Act 2019",
                            summary: "This historic Act bifurcated the state of Jammu & Kashmir into two Union Territories: J&K (with legislature) and Ladakh (without legislature). Section {{c1::57}} of the Act effectively abolishes the Legislative Council. The total number of seats in the J&K Legislative Assembly was increased from 107 to {{c2::114}} after the delimitation commission's report. The High Court remains the common judicial authority for both UTs."
                        },
                        {
                            category: "Geography", 
                            date: "Landforms",
                            image: "https://cdn.thewire.in/wp-content/uploads/2022/11/25164308/image-603.png",
                            title: "Karewa Formation and Saffron Cultivation",
                            summary: "Karewas are unique lacustrine (lake-based) deposits found in the Valley of Kashmir, formed during the Pleistocene period. These flat-topped tablelands are world-famous for the cultivation of {{c1::Zafran}} (Saffron), a GI-tagged product. The Pampore region is known as the 'Saffron Town of Kashmir'. Apart from saffron, this distinct soil structure is also highly suitable for growing {{c2::Almonds}} and walnuts."
                        },
                        {
                            category: "Geography", 
                            date: "Mapping",
                            image:"https://th.bing.com/th/id/R.8aff93c4229fe168ed0d9e28ea6f9c0d?rik=wgO6yKzD2Dlt4A&riu=http%3a%2f%2fwww.freeworldmaps.net%2fasia%2findia%2fjammuandkashmir%2fjammuandkashmir-map.jpg&ehk=N1%2fj%2bigXP8Pc22xSdqyytcDFWf111pBlHlbsh1ia8Gw%3d&risl=&pid=ImgRaw&r=0",
                            title: "Important Mountain Passes of Jammu Kashmir",
                            summary: "Map-based questions often ask to arrange passes from North to South. The {{c1::Banihal Pass}} connects Jammu to Srinagar and houses the Jawahar Tunnel. The {{c2::Zoji La}} pass connects Srinagar to Leh and is vital for Ladakh's connectivity. The {{c1::Burzil Pass}} historically connects the Kashmir Valley to the Deosai Plains of Gilgit. The {{c1:: Khardung La }} in Ladakh is one of the highest motorable roads in the world."
                        },
                        {
                            category: "History", 
                            date: "Regional",
                            image: "https://images.squarespace-cdn.com/content/v1/5ab61c67ec4eb7ab7a2f40f2/1570767012756-3RB9F64GC745URU1GNA5/ke17ZwdGBToddI8pDm48kMEscrJZt_tmaeDMTaC3Grd7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QPOohDIaIeljMHgDF5CVlOqpeNLcJ80NK65_fV7S1USasn69Hr34dwVEWwP0LjT7TmWk4ozqjQRTjqwHqVncSD8iN_TR6rJlKCdD_scFx3Q/71087629_10216837803031064_7165896983389929472_o.jpg",
                            title: "Timeline of Dogra Rule in Kashmir",
                            summary: "The Dogra dynasty was established by {{c1::Gulab Singh}} following the Treaty of Amritsar in 1846, often called the {{c1::'Sale Deed of Kashmir'}} in which whole region of JK was sold by British Raj for just ₨ 75 lakh. Dogra Rule unified whole region of J&K but is known for {{c1::Begari Sytem }} where peasents worked as forced unpaid slaves for Zamindars, they later revolted under Sheikh Abdullah leading to integration of J&K into the Dominion of India in 1947. J&K became one of only 2 states in India which freed tenants from Begari, and granted them land ownership under Sheikh"
                        },
                        {
                            category: "Economy", 
                            date: "Concepts", 
                            image: "https://iol-prod.appspot.com/image/52f0e1045b489d817cb85bef800ea88482c44804=w700",
                            title: "Repo Rate vs Reverse Repo Rate Explained",
                            summary: "Monetary Policy tools are used by the central bank to manage liquidity. Repo Rate is the rate at which the {{c1::RBI}} lends money to commercial banks for short-term needs. An increase in Repo Rate helps control {{c2::Inflation}} by making borrowing expensive. Conversely, Reverse Repo Rate is the rate at which the RBI borrows money from banks to absorb excess liquidity from the market."
                        },
                        {
                            category: "Polity", 
                            date: "Constitution",
                            image: "https://www.nextias.com/blog/wp-content/uploads/2024/02/indian-constitution-1024x1024.jpg",
                            title: "Fundamental Rights Articles 12-35",
                            summary: "Part III of the Constitution is called the Magna Carta of India. It guarantees civil liberties such as the Right to Equality (Articles 14-18). Article {{c1::17}} specifically abolishes Untouchability in all forms. Article {{c2::21}} provides the Right to Life and Personal Liberty, which has the widest interpretation by the Supreme Court. Dr. Ambedkar called Article 32 the 'Heart and Soul' of the Constitution."
                        },
                        {
                            category: "International Relations", 
                            date: "Treaties",
                            image: "https://www.deccanchronicle.com/h-upload/2025/04/24/1911090-induswaterstreaty.jpg",
                            title: "Indus Water Treaty 1960 India Pakistan",
                            summary: "Brokered by the {{c1::World Bank}}, this treaty divides the Indus river system. India has full control over the three Eastern Rivers: Ravi, Beas, and Sutlej. Pakistan controls the three Western Rivers: Indus, Jhelum, and Chenab. However, India is allowed to use western river waters for non-consumptive uses, including {{c2::Run-of-the-River}} hydroelectric projects like Kishanganga and Ratle."
                        },
                        {
                            category: "Geography",
                            date: "Climatology",
                            image: "https://www.pngitem.com/pimgs/m/505-5057181_india-map-of-kppen-climate-classification-koppen-climate.png",
                            title: "Shortest Koppen’s Climatic Classification for Exam",
                            summary: "Koppen’s Climatic Classification links climate to natural vegetation using temperature and rainfall. It has five major groups {{c1::A – Tropical}}, {{c2::B – Dry}}, {{c3::C – Temperate}}, {{c4::D – Continental}}, {{c5::E – Polar}}. <br> Important subtypes include {{c6::Af (Tropical Rainforest)}}, {{c7::Aw (Tropical Savanna)}}, {{c8::BWh (Hot Desert)}}, {{c9::Cfa (Humid Subtropical)}}, and {{c10::ET (Tundra)}}. <br> India mainly has: {{c11::Am in Western Coast}}, {{c12::Aw in Peninsular India}}, {{c13::Cwa/Cfa in North India}}, and {{c14::BWh/BSh in Rajasthan}}."}
                    ];
                    return this.normalize(rawData);
                },

                normalize(data) {
                    return data.map((item, idx) => {

                        const slug = (item.title || 'note')
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
                            .replace(/^-+|-+$/g, '');   // Remove leading/trailing hyphens

                        const uniqueId = `art_${idx}_${slug}`;

                        return {
                            ...item,
                            id: item.id || uniqueId,
                            tags: [item.category] 
                        };
                    });
                },

                async forceUpdate() {
                    const btn = document.getElementById('update-btn-text');
                    const spinner = document.getElementById('update-spinner');
                    
                    btn.style.display = 'none';
                    spinner.style.display = 'block';

                    try {
                        // 1. Fetch & Store to DB
                        const freshData = await this.syncNetwork();
                        
                        if (freshData) {
                            // 2. Reload everything from DB + Hardcoded to get clean state
                            App.State.feed = await this.loadLocal();
                            App.UI.renderFeed();
                            App.UI.toast("Feed Updated ⚡️");
                        } else {
                            App.UI.toast("No changes or Offline");
                        }
                    } catch(e) {
                        App.UI.toast("Update Failed");
                    } finally {
                        btn.style.display = 'block';
                        spinner.style.display = 'none';
                    }
                }
            },

            // --- USER ACTIONS ---
            Actions: {
                lastTapTime: 0,
                handleTouchHeart(e, id) {
                    const currentTime = new Date().getTime();
                    const tapLength = currentTime - this.lastTapTime;
                    if (tapLength < 300 && tapLength > 0) {
                        e.preventDefault(); // Prevent zoom
                        this.triggerHeartAnimation(id);
                    }
                    this.lastTapTime = currentTime;
                },


                triggerHeartAnimation(id) {
                    const heart = document.getElementById(`heart-anim-${id}`);
                    if(heart) {
                        heart.classList.remove('animate');
                        void heart.offsetWidth; // Trigger reflow
                        heart.classList.add('animate');
                    }
                    this.toggleBookmark(id);
                },

                openShareMenu(id) {
                    App.State.activeShareId = id; 
                    App.UI.openModal('modal-share-menu');
                },

                // 2. EXECUTE CHOICE
                executeShare(type) {
                    const id = App.State.activeShareId;
                    if(!id) return;

                    App.UI.closeModals(); // Close menu first

                    if(type === 'image') {
                        setTimeout(() => this.shareAsImage(id), 300);
                    } 
                    else if (type === 'link') {
                        this.shareSmart(id);
                    }
                },

                // 3. SHARE AS LOCATOR (LINK + TEXT)
                async shareSmart(id) {
                    const item = App.State.feed.find(i => i.id === id);
                    if (!item) return;

                    let cleanSummary = item.summary.replace(/<br\s*\/?>/gi, '\n');
                    cleanSummary = cleanSummary.replace(/\{\{c\d+::(.*?)\}\}/g, '[...?...]');

                    cleanSummary = cleanSummary.replace(/<\/?[^>]+(>|$)/g, "");

                    const url = `https://civilskash.in/?id=${item.id}`;
                    
                    const fullMessage = `📢 *${item.title}*\n\n${cleanSummary}\n\nCheck out answer 👇\n${url}`;

                    const shareData = {
                        title: item.title,
                        text: fullMessage
                    };

                    try {
                        if (navigator.share) {
                            await navigator.share(shareData);
                        } else {
                            await navigator.clipboard.writeText(fullMessage);
                            App.UI.toast("Quiz link copied! 📋");
                        }
                    } catch (err) {
                        console.log("Share cancelled");
                    }
                },

                
           
                async shareAsImage(cardId) {
                    const originalCard = document.getElementById(cardId);
                    const cardData = App.State.feed.find(c => c.id === cardId); // Data Backup

                    if (!originalCard) return;

                    App.UI.toast("Designing Card... 🎨");

                    try {
                        const canvas = await html2canvas(originalCard, {
                            useCORS: true,
                            allowTaint: true,
                            scale: 2, 
                            backgroundColor: null,
                            
                            onclone: (clonedDoc) => {
                                const clonedCard = clonedDoc.getElementById(cardId);
                                const scrollContent = clonedCard.querySelector('.scroll-content');
                                
                                // 1. Activate Export Mode
                                clonedCard.classList.add('export-mode');
                                
                                // 2. Unroll Content
                                if (scrollContent) {
                                    scrollContent.style.maxHeight = 'none';
                                    scrollContent.style.height = 'auto';
                                    scrollContent.style.overflow = 'visible';
                                    
                                    const keywords = clonedCard.querySelectorAll('.keyword');
                                    keywords.forEach(k => { k.innerText = '[ ...?... ]'; });

                                    let imgUrl = null;
                                    const originalBgDiv = originalCard.querySelector('.card-img');
                                    if (originalBgDiv) {
                                        const bgStyle = window.getComputedStyle(originalBgDiv).backgroundImage;
                                        const urlMatch = bgStyle.match(/url\(["']?([^"']*)["']?\)/);
                                        if (urlMatch && urlMatch[1] && urlMatch[1] !== 'none') imgUrl = urlMatch[1];
                                    }
                                    if (!imgUrl && cardData && cardData.image && cardData.image.trim() !== '') {
                                        imgUrl = cardData.image;
                                    }

                                    if (imgUrl) {
                                        const imgDiv = clonedDoc.createElement('div');
                                        imgDiv.className = 'export-image-16x11';
                                        imgDiv.style.backgroundImage = `url('${imgUrl}')`;
                                        scrollContent.insertBefore(imgDiv, scrollContent.firstChild);
                                    }
                                }
                                
                                // 3. INJECT TOP-RIGHT WATERMARK
                                const watermark = clonedDoc.createElement('div');
                                watermark.className = 'export-watermark-top';
                                watermark.innerHTML = `
                                    <div class="watermark-text">Civils<span>Kash</span></div>
                                    <div class="watermark-badge">.in</div>
                                `;
                                clonedCard.appendChild(watermark);
                            }
                        });

                        canvas.toBlob(async (blob) => {
                            if (!blob) throw new Error("Image generation failed");
                            
                            const titleEl = originalCard.querySelector('h2');
                            const titleSlug = titleEl ? titleEl.innerText.substring(0, 15).replace(/[^a-z0-9]/gi, '_') : 'Note';
                            const fileName = `CivilsKash_${titleSlug}.png`;
                            const file = new File([blob], fileName, { type: "image/png" });

                            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                                try { await navigator.share({ files: [file] }); } catch (e) {}
                            } else {
                                const link = document.createElement('a');
                                link.download = fileName;
                                link.href = canvas.toDataURL();
                                link.click();
                                App.UI.toast("Saved to Gallery 📸");
                            }
                        }, 'image/png');

                    } catch (err) {
                        console.error("Capture Error:", err);
                        App.UI.toast("Could not generate image.");
                    }
                },

                async setTheme(themeName) {
                    App.State.isDark = (themeName === 'dark');
                  
                    document.documentElement.setAttribute('data-theme', themeName);
    
                    await App.DB.put('settings', 'themeName', themeName); // New key 'themeName'
                 
                    const select = document.getElementById('theme-select');
                    if(select) select.value = themeName;
                },

                async toggleBookmark(id) {
                    App.UI.haptic([5, 30, 5]);
                    const isBookmarked = App.State.bookmarks.has(id);
                    const newSet = new Set(App.State.bookmarks);
                    if (isBookmarked) newSet.delete(id); else newSet.add(id);
                    
                    App.State.bookmarks = newSet;
                    await App.DB.put('bookmarks', 'ids', Array.from(newSet));
                    
                    const btn = document.getElementById(`like-btn-${id}`);
                    if(btn) btn.classList.toggle('liked', !isBookmarked);
                    App.UI.toast(isBookmarked ? "Removed Bookmark" : "Saved ❤️");
                },
                async setLayout(mode) {
                    App.State.desktopLayout = mode;

                    await App.DB.put('settings', 'desktopLayout', mode);

                    const feed = document.getElementById('feed-list');
                    if(mode === 'paper') {
                        feed.classList.add('layout-paper');
                    } else {
                        feed.classList.remove('layout-paper');
                    }

                    App.UI.toast(`Layout changed to ${mode.charAt(0).toUpperCase() + mode.slice(1)}`);
                },
                toggleBookmarksFilter() {
                    App.State.filterBookmarks = !App.State.filterBookmarks;
                    const btn = document.getElementById('bookmarks-btn');
                    if (App.State.filterBookmarks) {
                        btn.classList.add('active-state');
                        btn.querySelector('svg').style.fill = 'var(--red)'; 
                        btn.querySelector('svg').style.stroke = 'var(--red)';
                        App.UI.toast("Showing Favorites Only");
                    } else {
                        btn.classList.remove('active-state');
                        btn.querySelector('svg').style.fill = 'none';
                        btn.querySelector('svg').style.stroke = 'currentColor';
                        App.UI.toast("Showing All");
                    }
                    App.UI.renderFeed(); 
                },
                async triggerSync() {
                    const btn = document.getElementById('sync-btn');
                    btn.classList.add('spin-active'); // Start Animation
                    App.UI.toast("Checking for latest Feed...");
                    
                    await App.Data.forceUpdate();
                    
                    setTimeout(() => btn.classList.remove('spin-active'), 2000);
                },
                setCategory(cat) {
                    App.State.activeCategory = cat;
                    const badge = document.getElementById('category-active-badge');
                    const btn = document.getElementById('category-btn');
                    
                    if (cat !== 'all') {
                        badge.style.display = 'block';
                        btn.classList.add('active-state');
                        App.UI.toast(`Filter: ${cat}`);
                    } else {
                        badge.style.display = 'none';
                        btn.classList.remove('active-state');
                    }
                    
                    App.UI.closeModals();
                    App.UI.renderFeed();
                },

                toggleKeyword(el) { el.classList.toggle('is-hidden'); },
                
                toggleGlobalHide() {
                    App.UI.haptic(10);
                    App.State.isGlobalHide = !App.State.isGlobalHide;
                    const btn = document.getElementById('global-hide-btn');
                    btn.innerHTML = App.State.isGlobalHide ? App.Icons.eyeClosed : App.Icons.eyeOpen;
                    btn.classList.toggle('active-state', App.State.isGlobalHide);
                    
                    document.querySelectorAll('.keyword').forEach(k => {
                        k.classList.toggle('is-hidden', App.State.isGlobalHide);
                    });
                    document.querySelectorAll('.local-eye-btn').forEach(b => {
                        b.innerHTML = App.State.isGlobalHide ? App.Icons.eyeClosed : App.Icons.eyeOpen;
                    });
                    App.UI.toast(App.State.isGlobalHide ? "Keywords Hidden" : "Keywords Visible");
                },

                toggleLocalHide(id) {
                    const card = document.getElementById(id);
                    const btn = document.getElementById(`hide-btn-${id}`);
                    const keywords = card.querySelectorAll('.keyword');
                    if(keywords.length === 0) return;
                    const isCurrentlyHidden = keywords[0].classList.contains('is-hidden');
                    keywords.forEach(k => k.classList.toggle('is-hidden', !isCurrentlyHidden));
                    btn.innerHTML = isCurrentlyHidden ? App.Icons.eyeOpen : App.Icons.eyeClosed;
                },
                
                handleSearch(query) {
                    App.State.searchTerm = query.trim().toLowerCase();
                    
                    const btn = document.getElementById('search-clear-btn');
                    if (btn) btn.style.display = (query.length > 0) ? 'block' : 'none';

                    App.UI.renderFeed(); 
                },

                clearSearch() {
                    App.State.searchTerm = '';
                    
                    const input = document.getElementById('global-search-input');
                    const btn = document.getElementById('search-clear-btn');
                    
                    // Clear UI
                    if(input) {
                        input.value = '';
                        input.focus(); // Keep focus so user can type something else
                    }
                    if(btn) btn.style.display = 'none';

                    App.UI.renderFeed();
                    App.UI.toast("Search Cleared");
                },
                
                checkDeepLinkMode() {
                    // 1. Standard Query Param check (?id=...)
                    const params = new URLSearchParams(window.location.search);
                    let cardId = params.get('id');

                    // 2. Folder Path check (SEO Friendly)
                    if (!cardId) {
                        const path = window.location.pathname; 
                        const potentialId = path.split('/').find(segment => segment.startsWith('art_'));
                        
                        if (potentialId) {
                            cardId = potentialId;
                        }
                    }
                    
                    if (cardId) {
                        App.State.activeDeepLink = cardId;
                        return true;
                    }
                    return false;
                },

                goHome() {
                    App.State.activeCategory = 'all';
                    App.State.filterBookmarks = false;
                    App.State.activeDeepLink = null; // Exit Single Card Mode

                    const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
                    window.history.pushState({path: cleanUrl}, '', cleanUrl);
                    document.title = "CivilsKash - for Daily Current Affairs"; // Reset Title

                    this.clearSearch(); 
                    document.getElementById('category-active-badge').style.display = 'none';
                    document.getElementById('category-btn').classList.remove('active-state');
                    const bookmarkBtn = document.getElementById('bookmarks-btn');
                    bookmarkBtn.classList.remove('active-state');
                    bookmarkBtn.querySelector('svg').style.fill = 'none';
                    
                    document.getElementById('app-container').scrollTo(0,0);
                    App.UI.renderFeed();
                }
            },

           // --- EXPORT ENGINE ---
            Export: {
                download() {
                    const filter = document.getElementById('export-category-select').value;
                    let notesToExport = App.State.feed;

                    if (filter === 'bookmarks') {
                        notesToExport = notesToExport.filter(n => App.State.bookmarks.has(n.id));
                    } else if (filter !== 'all') {
                        notesToExport = notesToExport.filter(n => n.category === filter);
                    }

                    if (notesToExport.length === 0) return App.UI.toast("No notes to export.");

                    const dateStr = new Date().toISOString().slice(0,10);
                    let mergedHtml = `<p style="color: #888; font-style: italic;">CivilsKash Export (${notesToExport.length} items)</p><hr style="margin-bottom: 2rem;">`;
                    
                    notesToExport.forEach(item => {
                        mergedHtml += `<blockquote style="margin-bottom: 0.5rem; border-left: 3px solid var(--primary-color);"><strong>${item.category}</strong></blockquote>`;
                        mergedHtml += `<h3 style="margin-top: 0;">${item.title}</h3>`;
                        if (item.image) mergedHtml += `<img src="${item.image}" alt="Img" style="max-width: 100%; border-radius: 8px; margin: 10px 0;">`;
                        mergedHtml += `<p>${item.summary}</p><br><hr style="opacity: 0.3;"><br>`;
                    });
                    
                    const singleNoteObj = {
                        id: 'art_' + crypto.randomUUID().replace(/-/g, '').substring(0, 12),
                        title: `CivilsKash Digest (${dateStr})`,
                        category: (filter === 'all' || filter === 'bookmarks') ? 'General' : filter,
                        tags: ['CivilsKash', 'Imported'],
                        content: mergedHtml,
                        readCount: 0, readHistory: [], flashcards: {}, 
                        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
                    };

                    const blob = new Blob([JSON.stringify([singleNoteObj], null, 2)], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url; a.download = `CivilsKash_Export_${dateStr}.notekash`;
                    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
                    App.UI.toast(`Exported ${notesToExport.length} items!`);
                }
            },

            // --- ADVANCED QUIZ & SRS ENGINE ---
            Quiz: {
                session: {
                    mode: null,      
                    deck: [],       
                    pointer: 0,      
                    stats: { score: 0 },
                    isAnimating: false,
                    viewedInSession: new Set()
                },

                // 1. STREAK LOGIC
                updateStreakInfo() {
                    const lastDate = localStorage.getItem('civils_last_streak_date');
                    let count = parseInt(localStorage.getItem('civils_streak_count') || '0');
                    const today = new Date().toISOString().split('T')[0];

                    // Check if streak is broken (last date was before yesterday)
                    if (lastDate) {
                        const d1 = new Date(lastDate);
                        const d2 = new Date(today);
                        const diffTime = Math.abs(d2 - d1);
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                        
                        if (diffDays > 1) count = 0;
                    }

                    // Update UI
                    document.getElementById('streak-badge').innerText = count;
                    const fireIcon = document.getElementById('streak-fire-icon');
                    const title = document.getElementById('streak-title');
                    
                    if (count > 0) {
                        title.innerText = `${count} Day Streak!`;
                        fireIcon.style.filter = count > 5 
                            ? "drop-shadow(0 0 15px rgba(255, 0, 0, 0.9)) hue-rotate(-20deg)" // Red Hot
                            : "drop-shadow(0 0 10px rgba(255, 100, 0, 0.5))"; // Orange
                    } else {
                        title.innerText = "Start Your Streak";
                        fireIcon.style.filter = "grayscale(100%) opacity(0.5)";
                        fireIcon.style.animation = "none";
                    }
                },

                commitStreak() {
                    const today = new Date().toISOString().split('T')[0];
                    const lastDate = localStorage.getItem('civils_last_streak_date');
                    let count = parseInt(localStorage.getItem('civils_streak_count') || '0');

                    if (lastDate !== today) {
                        // Either started new or continued from yesterday
                        // If it was broken, logic in updateStreakInfo sets visually to 0, 
                        // but here we just increment. 
                        // Realistically, we reset if broken logic above ran.
                        
                        // Simple check: Is it consecutive?
                        if(lastDate) {
                             const d1 = new Date(lastDate);
                             const d2 = new Date(today);
                             const diffDays = Math.ceil(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24));
                             if(diffDays > 1) count = 0; // Reset if broken
                        }
                        
                        count++;
                        localStorage.setItem('civils_streak_count', count);
                        localStorage.setItem('civils_last_streak_date', today);
                        
                        App.UI.toast(`Streak Extended! 🔥 ${count} Days`);
                        this.updateStreakInfo(); // Refresh UI
                    }
                },

                // 2. CARD PARSER
                _createAtomicCards(item, itemIndex) {
                    if (!item.summary) return [];
                    const chunks = item.summary.split(/<br\s*\/?>|\n\n/i);
                    const cards = [];
                    
                    chunks.forEach((chunk, index) => {
                        if (chunk.includes('{{c')) {
                            const subId = `${item.id}_part_${index}`;
                            const regex = /\{\{c\d+::(.*?)\}\}/g;
                            
                            cards.push({
                                id: subId,
                                parentId: item.id,
                                category: item.category,
                                front: chunk.replace(regex, '<span class="quiz-mask"></span>'),
                                back: chunk.replace(regex, '<span class="quiz-revealed">$1</span>'),
                                raw: chunk,
                                feedIndex: itemIndex
                            });
                        }
                    });
                    return cards;
                },

                // 3. DECK GENERATION (Practice, Test, Cram)
                generateDeck(mode) {
                    // Flatten all cards
                    let allCards = App.State.feed.flatMap((item, idx) => this._createAtomicCards(item, idx));

                    // Add Metadata
                    const cardsWithMeta = allCards.map(card => {
                        const dbEntry = App.State.srsData[card.id];
                        return { 
                            ...card, 
                            lastReview: dbEntry ? dbEntry.lastReview : 0,
                            status: dbEntry ? dbEntry.status : 'new'
                        };
                    });

                    // --- MODE A: CRAM MODE (Old & Hard Only) ---
                    if (mode === 'cram') {
                        let cramCandidates = cardsWithMeta.filter(c => c.status !== 'new');

                        if (cramCandidates.length === 0) return [];
                        
                        cramCandidates.sort((a, b) => {
                            const isAgainA = (a.status === 'again');
                            const isAgainB = (b.status === 'again');

                            if (isAgainA && !isAgainB) return -1; // A comes first
                            if (!isAgainA && isAgainB) return 1;  // B comes first
                            
                            return a.lastReview - b.lastReview;
                        });

                        return cramCandidates.slice(0, 10);
                    }

                    // --- MODE B: PRACTICE (Newest & Unseen) ---
                    if (mode === 'practice') {
                        if (App.State.activeCategory !== 'all') {
                            cardsWithMeta.filter(c => c.category === App.State.activeCategory); // Bug fix: filter returns new array
                        }
                        
                        // Sort: Unseen (0) > Newest Index
                        cardsWithMeta.sort((a, b) => {
                            if (a.lastReview !== b.lastReview) return a.lastReview - b.lastReview;
                            return a.feedIndex - b.feedIndex;
                        });

                        return cardsWithMeta.slice(0, 10);
                    }

                    // --- MODE C: DAILY MASTERY (SRS Weighted) ---
                    // Standard SRS Bucket Logic
                    const buckets = { new: [], learning: [], review: [] };
                    cardsWithMeta.forEach(card => {
                        if (card.status === 'new') buckets.new.push(card);
                        else if (card.status === 'again' || card.status === 'hard') buckets.learning.push(card);
                        else buckets.review.push(card);
                    });

                    // Sort buckets
                    buckets.new.sort(() => 0.5 - Math.random());
                    buckets.learning.sort((a,b) => a.lastReview - b.lastReview);
                    buckets.review.sort((a,b) => a.lastReview - b.lastReview);

                    let finalDeck = [];
                    const TARGET = 10;
                    
                    // Fill Logic
                    const take = (arr, n) => {
                        const chunk = arr.splice(0, n);
                        finalDeck.push(...chunk);
                        return n - chunk.length; // deficit
                    };

                    let deficit = 0;
                    deficit += take(buckets.new, 4);
                    deficit += take(buckets.learning, 4);
                    deficit += take(buckets.review, 2);

                    // Backfill
                    if (finalDeck.length < TARGET) {
                        take(buckets.learning, 10);
                        take(buckets.new, 10);
                        take(buckets.review, 10);
                    }
                    
                    return finalDeck.slice(0, TARGET);
                },

                // 4. SESSION CONTROLS
                startTest() { this._boot('test'); },
                startPractice() { this._boot('practice'); },
                startCram() { this._boot('cram'); },

                _boot(mode) {
                    const deck = this.generateDeck(mode);
                    
                    if (deck.length === 0) {
                        if(mode === 'cram') return App.UI.toast("No 'Hard' cards to cram yet! Keep studying.");
                        return App.UI.toast("No cards available for this mode.");
                    }

                    this.session = {
                        mode: mode, deck: deck, pointer: 0,
                        stats: { score: 0 },
                        isAnimating: false,
                        viewedInSession: new Set()
                    };

                    App.UI.closeModals();
                    document.getElementById('quiz-fullscreen-layer').classList.add('active');
                    
                    let title = "DAILY MASTERY";
                    if(mode === 'practice') title = "PRACTICE QUEUE";
                    if(mode === 'cram') title = "CRAM SESSION ⚡";

                    document.getElementById('quiz-header-label').innerHTML = `<span style="color:var(--primary)">●</span> ${title}`;
                    document.getElementById('quiz-summary').classList.remove('visible');
                    
                    this._renderCard(false);
                },

                // 5. RESET CARD FUNCTIONALITY (The new power feature)
                async resetCard(cardId) {
                    // Prevent bubbling if triggered from button
                    if(event) event.stopPropagation();

                    const currentCard = this.session.deck.find(c => c.id === cardId);
                    if(!currentCard) return;

                    // 1. Reset Data
                    currentCard.status = 'new';
                    currentCard.lastReview = 0;
                    
                    App.State.srsData[cardId] = { status: 'new', lastReview: 0, parentId: currentCard.parentId };
                    await App.DB.put('srs_data', null, App.State.srsData[cardId]);

                    // 2. Update UI Immediately
                    const cap = document.querySelector(`.card-status-capsule`);
                    if(cap) {
                        cap.className = `card-status-capsule status-new`;
                        cap.innerHTML = `<span>✨</span> NEW`;
                        // Flash effect
                        cap.style.transform = "scale(1.2)";
                        setTimeout(() => cap.style.transform = "scale(1)", 200);
                    }

                    App.UI.toast("Card reset to New");
                },

                // 6. RENDER ENGINE (With Capsules)
                _renderCard(animate = true) {
                    const s = this.session;
                    if (s.pointer >= s.deck.length) return this._finishSession();

                    const card = s.deck[s.pointer];
                    const wrapper = document.getElementById('quiz-card-wrapper');
                    const progressBar = document.getElementById('quiz-progress-bar');
                    
                    // -- SILENT UPDATE FOR PRACTICE (Queue Logic) --
                    if (s.mode === 'practice' && !s.viewedInSession.has(card.id)) {
                        s.viewedInSession.add(card.id);
                        const currentData = App.State.srsData[card.id] || { status: 'viewed', parentId: card.parentId };
                        const newData = { ...currentData, lastReview: Date.now() };
                        App.State.srsData[card.id] = newData;
                        App.DB.put('srs_data', null, { id: card.id, ...newData });
                    }

                    // -- NEW CAPSULE GENERATOR (Clean & Structure) --
                    const getCapsuleHTML = (status) => {
                        const map = {
                            'new': { cls: 'status-new', label: 'New' },
                            'again': { cls: 'status-again', label: 'Again' },
                            'hard': { cls: 'status-hard', label: 'Hard' },
                            'good': { cls: 'status-good', label: 'Good' },
                            'easy': { cls: 'status-easy', label: 'Easy' },
                            'viewed': { cls: 'status-new', label: 'Viewed' }
                        };
                        const info = map[status] || map['new'];
    
                        return `
                        <div class="status-header">
                            <span class="clean-capsule ${info.cls}">${info.label}</span>
                            <button class="capsule-reset-btn" onclick="event.stopPropagation(); App.Quiz.resetCard('${card.id}')" title="Reset Card">
                                ↺
                            </button>
                        </div>`;
                    };

                    const setupText = () => {
                        const headerHTML = getCapsuleHTML(card.status || 'new');
                        document.getElementById('fc-front-text').innerHTML = headerHTML + card.front;
                        document.getElementById('fc-back-text').innerHTML = headerHTML + card.back;
                        
                        wrapper.classList.remove('is-flipped'); 
                        
                        const footer = document.getElementById('quiz-back-controls');
                        if (s.mode === 'test' || s.mode === 'cram') {
                             footer.innerHTML = `
                                <div class="srs-grid">
                                    <button class="srs-btn srs-again" onclick="App.Quiz.rate('again', 0)"><span>Again</span><span>Fail</span></button>
                                    <button class="srs-btn srs-hard" onclick="App.Quiz.rate('hard', 0.5)"><span>Hard</span><span>Tough</span></button>
                                    <button class="srs-btn srs-good" onclick="App.Quiz.rate('good', 0.8)"><span>Good</span><span>Okay</span></button>
                                    <button class="srs-btn srs-easy" onclick="App.Quiz.rate('easy', 1.0)"><span>Easy</span><span>Perf</span></button>
                                </div>`;
                        } else {
                            footer.innerHTML = `
                                <div style="display:flex; gap:10px; width:100%;">
                                    <button class="btn-large btn-outline" style="flex:1" onclick="App.Quiz.nav(-1)">Prev</button>
                                    <button class="btn-large btn-primary" style="flex:1" onclick="App.Quiz.nav(1)">Next</button>
                                </div>`;
                        }
                    };

                    const progress = ((s.pointer) / s.deck.length) * 100;
                    progressBar.style.width = `${progress}%`;

                    if (animate) {
                        wrapper.classList.remove('card-center-active');
                        wrapper.classList.add('card-enter-stack');
                        setupText();
                        requestAnimationFrame(() => {
                            setTimeout(() => {
                                wrapper.classList.remove('card-enter-stack');
                                wrapper.classList.add('card-center-active');
                                s.isAnimating = false;
                            }, 350);
                        });
                    } else {
                        setupText();
                        wrapper.classList.add('card-center-active');
                        s.isAnimating = false;
                    }
                },

                // 7. INTERACTION
                flip() { 
                    App.UI.haptic(5);
                    document.getElementById('quiz-card-wrapper').classList.add('is-flipped'); 
                },

                async rate(status, points) {
                    if (this.session.isAnimating) return;
                    
                    if(status === 'again') App.UI.haptic(40);
                    else App.UI.haptic(10);

                    const s = this.session;
                    const card = s.deck[s.pointer];
                    
                    s.stats.score += points;
                    
                    // Save SRS Data
                    const newData = { status: status, lastReview: Date.now(), parentId: card.parentId };
                    App.State.srsData[card.id] = newData;
                    await App.DB.put('srs_data', null, { id: card.id, ...newData });

                    card.status = status; 
                    card.lastReview = newData.lastReview;

                    this.nav(1);
                },

                nav(dir) {
                    if (this.session.isAnimating) return;
                    const s = this.session;
                    const wrapper = document.getElementById('quiz-card-wrapper');

                    if (dir === 1) {
                        this.session.isAnimating = true;
                        wrapper.classList.remove('card-center-active');
                        wrapper.classList.add('card-exit-left');
                        setTimeout(() => {
                            wrapper.classList.remove('card-exit-left');
                            s.pointer++;
                            this._renderCard(true);
                        }, 300); 
                    } 
                    else if (dir === -1 && s.pointer > 0) {
                        s.pointer--;
                        this._renderCard(false);
                    }
                },

                // 8. SUMMARY & STREAK SAVE
                _finishSession() {
                    const s = this.session;
                    
                    // SAVE STREAK ON COMPLETION
                    this.commitStreak();

                    document.getElementById('quiz-progress-bar').style.width = '100%';
                    const summaryContainer = document.getElementById('quiz-summary');
                    const scorePct = s.deck.length > 0 ? Math.round((s.stats.score / s.deck.length) * 100) : 0;
                    
                    let contentHtml = '';
                    let title = "Session Complete";
                    let btnAction = "App.Quiz.startTest()";
                    let btnText = "New Session";

                    if(s.mode === 'practice') {
                        title = "Queue Updated";
                        btnAction = "App.Quiz.startPractice()";
                        btnText = "Next Batch";
                    }
                    if(s.mode === 'cram') {
                        title = "Cram Finished";
                        btnAction = "App.Quiz.startCram()";
                        btnText = "Cram More";
                    }

                    // Dynamic Fire for Summary
                    contentHtml = `
                    <div style="text-align:center; width:100%; max-width:350px; animation: fadeInUp 0.5s ease;">
                        <div style="font-size:4rem; margin-bottom:10px;">🔥</div>
                        <h2 style="font-size:2rem; font-weight:800; margin-bottom:5px;">${title}</h2>
                        <div style="font-size:1rem; color:var(--primary); margin-bottom:15px; font-weight:bold;">Streak Saved!</div>
                        
                        <p style="color:var(--text-muted); margin-bottom:30px; line-height:1.5;">You reviewed ${s.deck.length} cards.</p>
                        
                        <div style="display:flex; flex-direction:column; gap:12px;">
                            <button class="btn-large btn-primary" onclick="${btnAction}">
                                <span>${btnText}</span> <span>↻</span>
                            </button>
                            <button class="btn-large btn-outline" style="border:none; color:var(--text-muted);" onclick="App.Quiz.exit()">
                                Return to Feed
                            </button>
                        </div>
                    </div>`;

                    summaryContainer.innerHTML = contentHtml;
                    summaryContainer.classList.add('visible');
                },

                exit() {
                    document.getElementById('quiz-fullscreen-layer').classList.remove('active');
                    this.session.deck = [];
                    this.session.isAnimating = false;
                    const wrapper = document.getElementById('quiz-card-wrapper');
                    wrapper.classList.remove('card-exit-left', 'card-center-active', 'card-enter-stack', 'is-flipped');
                    
                    this.updateStreakInfo(); 
                }
            },

            // --- UI RENDERING ---
            UI: {

                haptic(pattern = 5) {
                    // Only works on Android/supported browsers
                    if (navigator.vibrate) {
                        navigator.vibrate(pattern);
                    }
                },
                openModal(id) {
                    this.haptic(10);
                    const el = document.getElementById(id);
                    
                    if(id === 'modal-quiz-menu') {
                        if(App.Quiz && App.Quiz.updateStreakInfo) {
                            App.Quiz.updateStreakInfo();
                        }
                    }
                    
                    if(id === 'modal-categories') {
                        this.renderCategoryChips();
                        
                        setTimeout(() => {
                            const input = document.getElementById('global-search-input');
                            if(input) {
                                input.focus();
                                // Optional: Select existing text if any, so typing replaces it
                                input.select(); 
                            }
                        }, 50);
                    }
                    
                    el.style.display = 'flex';
                    void el.offsetWidth; // Trigger reflow for animation
                    el.classList.add('visible');
                },
                closeModals() {
                    document.querySelectorAll('.modal-backdrop').forEach(el => {
                        el.classList.remove('visible');
                        setTimeout(() => el.style.display = 'none', 300);
                    });
                },
                toast(msg) {
                    const t = document.getElementById('toast');
                    t.innerText = msg; t.classList.add('show');
                    setTimeout(() => t.classList.remove('show'), 2500);
                },
                
                renderCategoryChips() {
                    const container = document.getElementById('category-chips-container');
                    const categories = new Set(App.State.feed.map(i => i.category));
                    const sorted = Array.from(categories).sort();
                    
                    let html = `<div class="chip ${App.State.activeCategory === 'all' ? 'active' : ''}" onclick="App.Actions.setCategory('all')">All</div>`;
                    sorted.forEach(c => {
                        const isActive = App.State.activeCategory === c;
                        html += `<div class="chip ${isActive ? 'active' : ''}" onclick="App.Actions.setCategory('${c}')">${c}</div>`;
                    });
                    container.innerHTML = html;
                },

                populateExportSelect() {
                    const select = document.getElementById('export-category-select');
                    const categories = new Set(App.State.feed.map(i => i.category));
                    let html = `<option value="bookmarks">Bookmarked Only</option>`;
                    
                    categories.forEach(c => html += `<option value="${c}">${c}</option>`);

                    html += `<option value="all">All Categories</option>`;
                    
                    select.innerHTML = html;
                },

               renderFeed() {
                    const container = document.getElementById('feed-list');
                    
                    // Get current state variables
                    const isHidden = App.State.isGlobalHide;
                    const term = App.State.searchTerm; 
                    const deepLinkId = App.State.activeDeepLink; // CHECK FOR SINGLE CARD MODE

                    // --- 1. FILTERING LOGIC ---
                    let itemsToShow = App.State.feed;

                    // A. DEEP LINK PRIORITY (If link exists, ignore everything else)
                    if (deepLinkId) {
                        itemsToShow = itemsToShow.filter(item => item.id === deepLinkId);
                        
                        // SAFETY: If ID in link is invalid (deleted card), fallback to normal feed
                        if (itemsToShow.length === 0) {
                            App.UI.toast("Note not found. Showing Feed.");
                            App.State.activeDeepLink = null;
                            itemsToShow = App.State.feed; // Reset
                            // Clean URL so user doesn't get stuck
                            window.history.replaceState({}, document.title, window.location.pathname);
                        } else {
                            // SUCCESS: Update Browser Tab Title (Regression Fix)
                            document.title = `${itemsToShow[0].title} - CivilsKash`;
                        }
                    } else {
                        // B. STANDARD FILTERS (Only run if NOT in deep link mode)
                        document.title = "CivilsKash - for Daily Current Affairs"; // Default Title

                        if (term.length > 0) {
                            itemsToShow = itemsToShow.filter(item => {
                                const content = (item.title + ' ' + item.summary).toLowerCase();
                                return content.includes(term);
                            });
                        }
                        if (App.State.activeCategory !== 'all') {
                            itemsToShow = itemsToShow.filter(item => item.category === App.State.activeCategory);
                        }
                        if (App.State.filterBookmarks) {
                            itemsToShow = itemsToShow.filter(item => App.State.bookmarks.has(item.id));
                        }
                    }

                    // --- 2. EMPTY STATE HANDLING ---
                    if (itemsToShow.length === 0) {
                        let msg = "No items found.";
                        let icon = "📭"; 
                        if (term.length > 0) { msg = `No results found for "${term}"`; icon = "🔍"; }
                        
                        container.innerHTML = `
                            <div style="grid-column: 1/-1; text-align: center; padding: 60px; color: var(--text-muted); display:flex; flex-direction:column; align-items:center;">
                                <div style="font-size: 3rem; margin-bottom: 20px;">${icon}</div>
                                <p>${msg}</p>
                                <button class="btn-primary" style="margin-top:20px; padding:8px 16px; border-radius:8px; border:none; cursor:pointer;" onclick="App.Actions.goHome()">Reset Filters</button>
                            </div>`;
                        return;
                    }

                    // --- 3. RENDER LOOP ---
                    let htmlBuffer = '';

                    // INJECT BACK BUTTON (Only if in Deep Link Mode)
                    if (deepLinkId) {
                        htmlBuffer += `
                            <div style="grid-column: 1/-1; width:100%; display:flex; justify-content:center; margin-bottom:30px; animation: fadeIn 0.5s ease;">
                                <button class="btn-large btn-outline" onclick="App.Actions.goHome()" 
                                    style="background:var(--bg-card); border:1px solid var(--border-glass); color:var(--text-main); max-width: 200px; gap:10px; box-shadow:var(--shadow-soft);">
                                    <span>←</span> <span>View All Notes</span>
                                </button>
                            </div>
                        `;
                    }

                    // HELPER: SMART HIGHLIGHTER (Kept exactly as before)
                    const processSmartContent = (rawText, query, isSummary) => {
                        let workingText = rawText;
                        const clozeStorage = [];
                        const hiddenClass = isHidden ? 'is-hidden' : '';

                        if (isSummary) {
                            workingText = workingText.replace(/\{\{c\d+::(.*?)\}\}/g, (match, content) => {
                                const clozeHtml = `<span class="keyword ${hiddenClass}" onclick="event.stopPropagation(); App.Actions.toggleKeyword(this)">${content}</span>`;
                                clozeStorage.push(clozeHtml);
                                return `__PROTECTED_CLOZE_${clozeStorage.length - 1}__`;
                            });
                        }
                        if (query && query.length > 0) {
                            const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                            const regex = new RegExp(`(${safeQuery})`, 'gi');
                            workingText = workingText.replace(regex, '<span class="search-highlight">$1</span>');
                        }
                        if (isSummary) {
                            clozeStorage.forEach((html, index) => {
                                workingText = workingText.replace(`__PROTECTED_CLOZE_${index}__`, html);
                            });
                        }
                        return workingText;
                    };

                    let cardCounter = 0;

                    itemsToShow.forEach((item, idx) => {
                        cardCounter++;
                        
                        const hasImg = item.image && item.image.trim() !== '';
                        const isLiked = App.State.bookmarks.has(item.id);
                        const eyeIcon = isHidden ? App.Icons.eyeClosed : App.Icons.eyeOpen;
                        const finalTitle = processSmartContent(item.title, term, false);
                        const finalSummary = processSmartContent(item.summary, term, true);

                        // A. Render Article
                        htmlBuffer += `
                        <article class="news-card ${hasImg ? '' : 'text-only'}" id="${item.id}" data-idx="${idx+1}" 
                                ondblclick="App.Actions.triggerHeartAnimation('${item.id}')"
                                ontouchend="App.Actions.handleTouchHeart(event, '${item.id}')">
                            
                            <div class="watermark-overlay">Civils<span style="color:var(--primary)">Kash</span></div>
                            <div id="heart-anim-${item.id}" class="heart-pop">❤️</div>

                            <div class="scroll-content">
                                ${hasImg ? `<div class="card-img" style="background-image: url('${item.image}')"></div>` : ''}
                                
                                <div class="card-body">
                                    <div class="meta-row">
                                        <span class="badge" onclick="event.stopPropagation(); App.Actions.setCategory('${item.category}')">${item.category}</span>
                                        <span class="date">${item.date}</span>
                                    </div>
                                    <h2>${finalTitle}</h2>
                                    <p class="summary-box">${finalSummary}</p>
                                </div>

                                <div class="action-toolbar-container" onclick="event.stopPropagation()">
                                    <div class="action-toolbar">
                                        <button class="icon-btn" onclick="event.stopPropagation(); App.Actions.openShareMenu('${item.id}')" title="Share Options">
                                            <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                                        </button>
                                        <div style="width: 1px; height: 16px; background: rgba(255,255,255,0.1);"></div>
                                        <button class="icon-btn local-eye-btn" id="hide-btn-${item.id}" onclick="App.Actions.toggleLocalHide('${item.id}')" title="Toggle Keywords">
                                            ${eyeIcon}
                                        </button>
                                        <div style="width: 1px; height: 16px; background: rgba(255,255,255,0.1);"></div>
                                        <button class="icon-btn ${isLiked?'liked':''}" id="like-btn-${item.id}" onclick="App.Actions.toggleBookmark('${item.id}')" title="Bookmark">
                                            <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </article>`;

                        // B. AD INJECTION LOGIC (Disabled if in Deep Link Mode to keep it clean)
                        if (!deepLinkId && cardCounter % App.Ads.config.ratio === 0 && idx !== itemsToShow.length - 1 && App.Ads && App.Ads.getNextType() !== 'none') {  
                            const adType = App.Ads.getNextType();
                            if (adType === 'google') {
                                htmlBuffer += `
                                <article class="news-card google-ad-unit">
                                    <div class="ad-label-corner">Ad</div>
                                    <div class="google-ad-wrapper">
                                        <ins class="adsbygoogle"
                                            style="display:block; width:100%;"
                                            data-ad-client="${App.Ads.config.googleClientId}"
                                            data-ad-slot="${App.Ads.config.googleSlotId}"
                                            data-ad-format="auto"
                                            data-full-width-responsive="true"></ins>
                                    </div>
                                </article>`;
                            } else {
                                const ad = App.Ads.getRotatedSelfAd();
                                htmlBuffer += `
                                <article class="news-card ad-unit" onclick="window.open('${ad.link}', '_blank')" style="cursor:pointer;">
                                    <div class="scroll-content">
                                        <div class="card-img" style="background-image: url('${ad.image}'); filter: grayscale(20%);"></div>
                                        <div class="card-body">
                                            <div class="meta-row">
                                                <span class="badge" style="border:1px solid var(--text-muted); background:transparent; color:var(--text-muted);">RECOMMENDED</span>
                                                <span class="date">Promoted</span>
                                            </div>
                                            <h2>${ad.title}</h2>
                                            <p class="summary-box" style="opacity: 0.8;">${ad.summary}</p>
                                        </div>
                                        <div class="ad-cta-container">
                                            <button class="ad-cta-btn">
                                                ${ad.cta} 
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                </article>`;
                            }
                        }
                    });

                    container.innerHTML = htmlBuffer;

                    // --- C. TRIGGER AD LOAD ---
                    setTimeout(() => {
                        if(App.Ads) App.Ads.triggerGoogleAds();
                    }, 100);
                }
            },
            
            System: {
                async executeHardRefresh() {
                    // 1. Close the modal and show loading
                    App.UI.closeModals();
                    App.UI.toast("Downloading latest App Version... 🚀");
                    
                    // 2. Set the "Success" flag for after reload
                    localStorage.setItem('app_was_updated', 'true');

                    // 3. Unregister Service Worker (Kill old version)
                    if ('serviceWorker' in navigator) {
                        const registrations = await navigator.serviceWorker.getRegistrations();
                        for (const registration of registrations) await registration.unregister();
                    }

                    // 4. Delete Cache (Delete old files)
                    if ('caches' in window) {
                        const keys = await caches.keys();
                        await Promise.all(keys.map(key => caches.delete(key)));
                    }

                    // 5. Force Reload
                    setTimeout(() => {
                        window.location.reload(true);
                    }, 1000);
                }
            },

            // --- INIT ENGINE (The "Race" Logic) ---
            async init() { 
                try {
                    await this.DB.init();
                    this.PTR.init();
                    let savedTheme = await this.DB.get('settings', 'themeName') || 'dark';
                    await App.Actions.setTheme(savedTheme); // Use Action to set consistent state
                    
                    let savedLayout = await this.DB.get('settings', 'desktopLayout') || 'grid';
                    App.State.desktopLayout = savedLayout;
                    if(savedLayout === 'paper') document.getElementById('feed-list').classList.add('layout-paper');
                    const layoutSelect = document.getElementById('layout-select');
                    if(layoutSelect) layoutSelect.value = savedLayout;

                    const url = await this.DB.get('settings', 'contentUrl');
                    if (url) App.State.contentUrl = url;
                    
                    const storedBookmarks = await this.DB.get('bookmarks', 'ids');
                    if (storedBookmarks) App.State.bookmarks = new Set(storedBookmarks);

                    let localFeed = await App.Data.loadLocal();
                    App.State.feed = localFeed;
                    App.UI.populateExportSelect(); 
                    const isDeepLink = App.Actions.checkDeepLinkMode();
                    
                    if (isDeepLink) {
                        const targetId = App.State.activeDeepLink;
                        const existsLocally = App.State.feed.some(item => item.id === targetId);

                        if (existsLocally) {
                            App.UI.renderFeed();
                            this.hideLoader();
                            console.log("Found Deep Link Locally");
                        } else {
                            console.log("Deep Link missing locally. Syncing...");
                            const loaderText = document.querySelector('#startup-loader div:nth-child(3)');
                            if(loaderText) loaderText.innerText = "Searching Archives...";
                          
                            const freshData = await App.Data.syncNetwork();
                            
                            if (freshData) {
                           
                                App.State.feed = await App.Data.loadLocal();
                            
                                const foundNow = App.State.feed.some(item => item.id === targetId);
                                if(foundNow) {
                                    App.UI.renderFeed();
                                } else {
                                    App.UI.toast("Note not found or deleted.");
                                    App.Actions.goHome(); // Fallback to feed
                                }
                            } else {
                                App.UI.toast("Note not available offline.");
                                App.Actions.goHome();
                            }
                            this.hideLoader();
                        }
                    } else {
                        App.UI.renderFeed();
                        this.hideLoader();
                        setTimeout(async () => {
                            const fresh = await App.Data.syncNetwork();
                            if(fresh) {
                                App.State.feed = await App.Data.loadLocal();
                                App.UI.renderFeed();
                                App.UI.toast("Feed Updated ⚡");
                            }
                        }, 1000);
                    }

                } catch (err) {
                    console.error("Critical Init Error", err);
                    App.State.feed = App.Data.getHardcodedData();
                    App.UI.renderFeed();
                    this.hideLoader(); 
                }
            },

            hideLoader() {
                const loader = document.getElementById('startup-loader');
                if(loader) {
                    loader.style.opacity = '0';
                    setTimeout(() => loader.style.display = 'none', 500);
                }
            }
        };
        
        // --- NEW: SHARE TARGET HANDLER ---
        // 1. Add the "Save" logic to your Actions module
        App.Actions.saveSharedNote = async function() {
            const title = document.getElementById('input-card-title').value;
            const body = document.getElementById('input-card-body').value;
            
            if(!title || !body) return App.UI.toast("Please add text first");

            const newCard = {
                id: 'shared_' + Date.now(),
                category: 'Curated',  // <--- CHANGED THIS from 'Shared'
                title: title,
                summary: body,
                date: 'Just Now',
                image: '', 
                tags: ['Curated']     // <--- CHANGED THIS to match
            };

            App.State.feed.unshift(newCard); // Add to top
            
            if(App.DB.isWorking) {
                await App.DB.put('feed_cache', null, newCard); 
            }

            App.UI.closeModals();
            App.UI.renderFeed();
            App.UI.toast("Note Saved to Feed! ✅");
            
            window.history.replaceState({}, document.title, window.location.pathname);
        };

        // 2. The function to check URL parameters on startup
        function checkShareTarget() {
            const params = new URLSearchParams(window.location.search);
            const sharedTitle = params.get('share_title');
            const sharedText = params.get('share_text');
            const sharedUrl = params.get('share_url');

            if (sharedTitle || sharedText || sharedUrl) {
                // Combine the text and URL cleanly
                let finalBody = sharedText || '';
                if (sharedUrl) finalBody += `\n\nSource: ${sharedUrl}`;

                // Open the new modal
                App.UI.openModal('modal-create-card');

                // Fill the inputs (small delay to ensure modal is rendered)
                setTimeout(() => {
                    const titleInput = document.getElementById('input-card-title');
                    const bodyInput = document.getElementById('input-card-body');
                    
                    if (titleInput) titleInput.value = sharedTitle || 'New Shared Note';
                    if (bodyInput) bodyInput.value = finalBody;
                }, 100);
            }
        }
        // Initialize App on DOM Ready
        document.addEventListener('DOMContentLoaded', () => {
            App.init();
            checkShareTarget();
        });
    </script>
    <script>
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then((reg) => console.log('Service Worker registered!', reg))
            .catch((err) => console.log('Service Worker failed:', err));
        });
    }
    </script>
</body>
</html>
