
/**
 * CivilsKash v0.25 - Ultimate Edition
 * "No Shortcuts" Architecture:
 * 1. Global Error Handling (Safety)
 * 2. IndexedDB with Memory Fallback (Reliability)
 * 3. Full 3D Quiz Engine (Mastery)
 * 4. External Data Sync (Connectivity)
 */


if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then((reg) => console.log('Service Worker registered!', reg))
            .catch((err) => console.log('Service Worker failed:', err));
    });
}

// 1. GLOBAL SAFETY NET
window.onerror = function (msg, url, line) {
    const el = document.getElementById('debug-console');
    el.style.display = 'block';
    el.innerText += `[Error] ${msg} (Line ${line})\n`;
    return false;
};

const App = {
    // 1. ADD LITE MODE DETECTION
    isLiteMode: window.location.pathname.includes('/notes/'),

    // 2. NEW "LITE" MODULE (Handles SEO Pages)
    Lite: {
        init() {
            console.log("🚀 Lite Mode Active: SEO Optimized");

            const feed = document.getElementById('feed-list');
            if (feed) feed.classList.add('layout-paper');

            this.setupToast();
            this.bindRedirects();

            const loader = document.getElementById('startup-loader');
            if (loader) loader.style.display = 'none';
        },

        setupToast() {
            if (!document.getElementById('toast')) {
                const t = document.createElement('div');
                t.id = 'toast';
                document.body.appendChild(t);
            }
        },

        bindRedirects() {
            const headerBtns = document.querySelectorAll('header .icon-btn');

            headerBtns.forEach(btn => {
                if (btn.closest('.brand')) return;

                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);

                newBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    this.redirectWithMessage();
                });
            });
        },

        redirectWithMessage() {
            const t = document.getElementById('toast');
            if (t) {
                t.innerText = "✨ Launching Full App...";
                t.classList.add('show');
            }
            document.body.style.transition = "opacity 0.5s";
            document.body.style.opacity = '0.6';
            setTimeout(() => {
                window.location.href = 'https://civilskash.in';
            }, 800);
        }
    },
    // --- DATABASE LAYER (Robust) ---
    DB: {
        dbName: 'CivilsKashDB',
        version: 4,  // Incremented for curated_notes store
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
                        if (!db.objectStoreNames.contains('curated_notes')) db.createObjectStore('curated_notes', { keyPath: 'id' });
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
                } catch (e) { resolve(null); }
            });
        },
        async put(store, key, value) {
            if (!this.isWorking || !this.db) return;
            try {
                const tx = this.db.transaction(store, 'readwrite');
                if (key) tx.objectStore(store).put(value, key);
                else tx.objectStore(store).put(value);
            } catch (e) { console.error("Put Failed", e); }
        },
        async getAll(store) {
            if (!this.isWorking || !this.db) return [];
            return new Promise(resolve => {
                try {
                    const tx = this.db.transaction(store, 'readonly');
                    const req = tx.objectStore(store).getAll();
                    req.onsuccess = () => resolve(req.result);
                    req.onerror = () => resolve([]);
                } catch (e) { resolve([]); }
            });
        },
        // Curated Notes specific methods
        async getCuratedNotes() {
            return this.getAll('curated_notes');
        },
        async saveCuratedNote(note) {
            if (!this.isWorking || !this.db) return;
            try {
                const tx = this.db.transaction('curated_notes', 'readwrite');
                tx.objectStore('curated_notes').put(note);
            } catch (e) { console.error("Save Curated Note Failed", e); }
        },
        async deleteCuratedNote(id) {
            if (!this.isWorking || !this.db) return;
            try {
                const tx = this.db.transaction('curated_notes', 'readwrite');
                tx.objectStore('curated_notes').delete(id);
            } catch (e) { console.error("Delete Curated Note Failed", e); }
        }
    },

    // --- STATE MANAGEMENT ---
    State: {
        feed: [],
        curatedNotes: [],  // Dedicated storage for user-created notes
        editingNoteId: null,  // Track if we're editing an existing note
        bookmarks: new Set(),
        filterBookmarks: false,
        activeCategory: 'all',
        desktopLayout: 'paper',
        feedPointer: 12,       // How many cards are currently rendered
        batchSize: 12,         // How many to load at a time (optimized for performance)
        totalAvailable: 0,     // Total items in memory
        isLoadingMore: false,  // Prevent double triggers
        maxDomCards: 50,       // Maximum cards to keep in DOM
        virtualScrollOffset: 0, // Track how many cards have been recycled
        searchTerm: '',
        srsData: {},
        isDark: true,
        isGlobalHide: false,
        // NEW SETTINGS
        flashcardFreq: 5,      // Minutes
        flashcardEnabled: true,
        quiz: { mode: null, deck: [], index: 0, currentScore: 0 },
        pendingFeedUpdate: null,  // NEW: Holds fresh data until user clicks refresh
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
                if (this.getNextType() === 'self') return;
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

                if (this.state.dist > 150) this.state.dist = 150;

                this.dom.zone.style.height = `${this.state.dist}px`;
                this.dom.zone.classList.add('visible');

                if (this.state.dist > this.state.threshold) {
                    this.dom.arrow.classList.add('rotate');
                    if (navigator.vibrate && !this.dom.arrow.dataset.vibrated) {
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
        mergeStrategy(dynamicItems) {
            const hardcoded = this.getHardcodedData();
            const curated = App.State.curatedNotes || [];  // Protect curated notes
            const feedMap = new Map();

            // A. Load Curated Notes FIRST (Highest Priority - User's Own Data)
            curated.forEach(item => feedMap.set(item.id, { ...item, isCurated: true }));

            // B. Load Hardcoded (Base Layer)
            hardcoded.forEach(item => {
                if (!feedMap.has(item.id)) {  // Don't overwrite curated
                    feedMap.set(item.id, item);
                }
            });

            // C. Merge Dynamic (Overlay Layer) - Will NOT overwrite curated
            if (Array.isArray(dynamicItems)) {
                dynamicItems.forEach(item => {
                    if (feedMap.has(item.id) && feedMap.get(item.id).isCurated) return;

                    const existing = feedMap.get(item.id);
                    if (existing && !item.timestamp) {
                        item.timestamp = existing.timestamp;
                    }
                    feedMap.set(item.id, item);
                });
            }

            // D. Smart Sorting: Curated notes appear before others on same date
            return Array.from(feedMap.values()).sort((a, b) => {
                const tA = a.timestamp || 0;
                const tB = b.timestamp || 0;
                const dayA = Math.floor(tA / 86400000);
                const dayB = Math.floor(tB / 86400000);

                if (dayA === dayB) {
                    if (a.isCurated && !b.isCurated) return -1;
                    if (!a.isCurated && b.isCurated) return 1;
                }

                return tB - tA; // Descending (Newest First)
            });
        },

        async loadLocal() {
            const cached = await App.DB.getAll('feed_cache');
            return this.mergeStrategy(cached);
        },

        async syncNetwork() {
            if (!App.State.contentUrl) return null;
            try {
                const separator = App.State.contentUrl.includes('?') ? '&' : '?';
                const freshUrl = `${App.State.contentUrl}${separator}t=${Date.now()}`;

                const res = await fetch(freshUrl, { method: 'GET', redirect: 'follow' });
                if (res.ok) {
                    const cloudData = await res.json();
                    const normalizedCloud = this.normalize(cloudData, true);

                    if (App.DB.isWorking && App.DB.db) {
                        const tx = App.DB.db.transaction('feed_cache', 'readwrite');
                        const store = tx.objectStore('feed_cache');
                        normalizedCloud.forEach(item => store.put(item));
                    }
                    return normalizedCloud;
                }
            } catch (e) {
                console.warn("Sync failed", e);
                return null;
            }
        },

        getHardcodedData() {
            const baseTime = new Date('2025-01-01').getTime();
            const rawData = [
                {
                    category: "Current Affairs",
                    date: "1 Nov 25",
                    image: "https://tse3.mm.bing.net/th/id/OIP.WvbBV909fzI7zuLUadLrgQHaE6?rs=1&pid=ImgDetMain&o=7&rm=3",
                    title: "Daily Current Affairs Quiz UPSC JKPSC",
                    summary: "Boost your preparation with high-yield MCQs for UPSC and JKPSC Prelims. Do you know 'Panchamrit' strategy from COP26, which relates to India's {{c1::Climate Action}} goals. What about Article {{c2::35A}} which was abolished recently with Article 370. Do you know difference between ICJ and ICC. What about recent Environmental regulation considered Black law?. Regular practice of these static and dynamic topics on CivilsKash will boost your ability to crack competitive exams."
                },
                {
                    category: "Polity",
                    date: "1 Nov 25",
                    image: "https://media.istockphoto.com/id/1007178836/photo/indian-supreme-court.jpg?s=612x612&w=0&k=20&c=sVUxnP1WCkC62og2fjbzgdUMleD3WoeOzbBgNiJ9y_Y=",
                    title: "Schedules of Indian Constitution Mnemonic",
                    summary: "Memorizing the 12 Schedules of the Indian Constitution is crucial for matching questions in Prelims. Use the famous trick: '{{c1::TEARS OF OLD PM}}'. T stands for Territories (1st Schedule), E for Emoluments (2nd), A for Affirmations (3rd), and R for Rajya Sabha seats (4th). The 10th Schedule, added by the {{c2::52nd}} Amendment Act of 1985, deals with the Anti-Defection Law, often referred to as the 'Dal Badal' law."
                },
                {
                    category: "History",
                    date: "1 Nov 25",
                    image: "https://i0.wp.com/glimpsesofhistory.com/wp-content/uploads/2020/08/Captain_William_Bentinck_1764-1813_by_George_Romney.jpg?fit=1067%2C1280&ssl=1",
                    title: "Governor General vs Viceroy Modern History",
                    summary: "Aspirants often confuse these colonial titles. The Regulating Act of {{c1::1773}} created the post of Governor General of Bengal (Warren Hastings). Later, the Charter Act of {{c2::1833}} elevated this to Governor General of India (William Bentinck). Finally, after the Revolt of 1857, the Government of India Act 1858 transferred power to the British Crown, creating the title of {{c1::Viceroy}}, with Lord Canning becoming the first Viceroy of India."
                },
                {
                    category: "Environment",
                    date: "1 Nov 25",
                    image: "https://cdn.downtoearth.org.in/library/large/2022-11-08/0.94591600_1667918565_33.jpg",
                    title: "List of New Ramsar Sites in India 2026",
                    summary: "India has significantly expanded its conservation network, with the total number of Ramsar sites crossing {{c1::94}}. The {{c2::Sundarbans}} in West Bengal remains the largest site by area. Important wetland sites in Jammu & Kashmir like Wular Lake, Hokera, and Surinsar-Mansar are critical for migratory birds. Under the Montreux Record, only two Indian sites are currently listed: {{c1::Keoladeo}} National Park (Rajasthan) and {{c1::Loktak Lake }}(Manipur)."
                },
                {
                    category: "Polity",
                    date: "1 Nov 25",
                    title: "Key Provisions J&K Reorganization Act 2019",
                    summary: "This historic Act bifurcated the state of Jammu & Kashmir into two Union Territories: J&K (with legislature) and Ladakh (without legislature). Section {{c1::57}} of the Act effectively abolishes the Legislative Council. The total number of seats in the J&K Legislative Assembly was increased from 107 to {{c2::114}} after the delimitation commission's report. The High Court remains the common judicial authority for both UTs."
                },
                {
                    category: "Geography",
                    date: "1 Nov 25",
                    image: "https://cdn.thewire.in/wp-content/uploads/2022/11/25164308/image-603.png",
                    title: "Karewa Formation and Saffron Cultivation",
                    summary: "Karewas are unique lacustrine (lake-based) deposits found in the Valley of Kashmir, formed during the Pleistocene period. These flat-topped tablelands are world-famous for the cultivation of {{c1::Zafran}} (Saffron), a GI-tagged product. The Pampore region is known as the 'Saffron Town of Kashmir'. Apart from saffron, this distinct soil structure is also highly suitable for growing {{c2::Almonds}} and walnuts."
                },
                {
                    category: "Geography",
                    date: "1 Nov 25",
                    image: "https://th.bing.com/th/id/R.8aff93c4229fe168ed0d9e28ea6f9c0d?rik=wgO6yKzD2Dlt4A&riu=http%3a%2f%2fwww.freeworldmaps.net%2fasia%2findia%2fjammuandkashmir%2fjammuandkashmir-map.jpg&ehk=N1%2fj%2bigXP8Pc22xSdqyytcDFWf111pBlHlbsh1ia8Gw%3d&risl=&pid=ImgRaw&r=0",
                    title: "Important Mountain Passes of Jammu Kashmir",
                    summary: "Map-based questions often ask to arrange passes from North to South. The {{c1::Banihal Pass}} connects Jammu to Srinagar and houses the Jawahar Tunnel. The {{c2::Zoji La}} pass connects Srinagar to Leh and is vital for Ladakh's connectivity. The {{c1::Burzil Pass}} historically connects the Kashmir Valley to the Deosai Plains of Gilgit. The {{c1:: Khardung La }} in Ladakh is one of the highest motorable roads in the world."
                },
                {
                    category: "History",
                    date: "1 Nov 25",
                    image: "https://images.squarespace-cdn.com/content/v1/5ab61c67ec4eb7ab7a2f40f2/1570767012756-3RB9F64GC745URU1GNA5/ke17ZwdGBToddI8pDm48kMEscrJZt_tmaeDMTaC3Grd7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QPOohDIaIeljMHgDF5CVlOqpeNLcJ80NK65_fV7S1USasn69Hr34dwVEWwP0LjT7TmWk4ozqjQRTjqwHqVncSD8iN_TR6rJlKCdD_scFx3Q/71087629_10216837803031064_7165896983389929472_o.jpg",
                    title: "Timeline of Dogra Rule in Kashmir",
                    summary: "The Dogra dynasty was established by {{c1::Gulab Singh}} following the Treaty of Amritsar in 1846, often called the {{c1::'Sale Deed of Kashmir'}} in which whole region of JK was sold by British Raj for just ₨ 75 lakh. Dogra Rule unified whole region of J&K but is known for {{c1::Begari Sytem }} where peasents worked as forced unpaid slaves for Zamindars, they later revolted under Sheikh Abdullah leading to integration of J&K into the Dominion of India in 1947. J&K became one of only 2 states in India which freed tenants from Begari, and granted them land ownership under Sheikh"
                },
                {
                    category: "Economy",
                    date: "1 Nov 25",
                    image: "https://iol-prod.appspot.com/image/52f0e1045b489d817cb85bef800ea88482c44804=w700",
                    title: "Repo Rate vs Reverse Repo Rate Explained",
                    summary: "Monetary Policy tools are used by the central bank to manage liquidity. Repo Rate is the rate at which the {{c1::RBI}} lends money to commercial banks for short-term needs. An increase in Repo Rate helps control {{c2::Inflation}} by making borrowing expensive. Conversely, Reverse Repo Rate is the rate at which the RBI borrows money from banks to absorb excess liquidity from the market."
                },
                {
                    category: "Polity",
                    date: "1 Nov 25",
                    image: "https://www.nextias.com/blog/wp-content/uploads/2024/02/indian-constitution-1024x1024.jpg",
                    title: "Fundamental Rights Articles 12-35",
                    summary: "Part III of the Constitution is called the Magna Carta of India. It guarantees civil liberties such as the Right to Equality (Articles 14-18). Article {{c1::17}} specifically abolishes Untouchability in all forms. Article {{c2::21}} provides the Right to Life and Personal Liberty, which has the widest interpretation by the Supreme Court. Dr. Ambedkar called Article 32 the 'Heart and Soul' of the Constitution."
                },
                {
                    category: "World",
                    date: "1 Nov 25",
                    image: "https://www.deccanchronicle.com/h-upload/2025/04/24/1911090-induswaterstreaty.jpg",
                    title: "Indus Water Treaty 1960 India Pakistan",
                    summary: "Brokered by the {{c1::World Bank}}, this treaty divides the Indus river system. India has full control over the three Eastern Rivers: Ravi, Beas, and Sutlej. Pakistan controls the three Western Rivers: Indus, Jhelum, and Chenab. However, India is allowed to use western river waters for non-consumptive uses, including {{c2::Run-of-the-River}} hydroelectric projects like Kishanganga and Ratle."
                },
                {
                    category: "Geography",
                    date: "1 Nov 25",
                    image: "https://www.pngitem.com/pimgs/m/505-5057181_india-map-of-kppen-climate-classification-koppen-climate.png",
                    title: "Shortest Koppen’s Climatic Classification for Exam",
                    summary: "Koppen’s Climatic Classification links climate to natural vegetation using temperature and rainfall. It has five major groups {{c1::A – Tropical}}, {{c2::B – Dry}}, {{c3::C – Temperate}}, {{c4::D – Continental}}, {{c5::E – Polar}}. <br> Important subtypes include {{c6::Af (Tropical Rainforest)}}, {{c7::Aw (Tropical Savanna)}}, {{c8::BWh (Hot Desert)}}, {{c9::Cfa (Humid Subtropical)}}, and {{c10::ET (Tundra)}}. <br> India mainly has: {{c11::Am in Western Coast}}, {{c12::Aw in Peninsular India}}, {{c13::Cwa/Cfa in North India}}, and {{c14::BWh/BSh in Rajasthan}}."
                }
            ];
            return this.normalize(rawData, false);
        },

        normalize(data, isNetworkSource = false) {
            const now = Date.now();

            return data.map((item, idx) => {
                const slug = (item.title || 'note')
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '');

                const uniqueId = item.id || `art_${idx}_${slug}`;

                let finalTimestamp = item.timestamp;

                if (!finalTimestamp && item.date) {
                    const parsed = Date.parse(item.date);
                    if (!isNaN(parsed)) {
                        finalTimestamp = parsed;
                    }
                }

                if (!finalTimestamp) {
                    if (isNetworkSource) {
                        finalTimestamp = now + (idx * 1000);
                    } else {
                        finalTimestamp = now - (100000 - (idx * 1000));
                    }
                }

                return {
                    ...item,
                    id: uniqueId,
                    timestamp: finalTimestamp,
                    tags: [item.category]
                };
            });
        },

        async forceUpdate() {
            const btn = document.getElementById('update-btn-text');
            const spinner = document.getElementById('update-spinner');
            if (btn) btn.style.display = 'none';
            if (spinner) spinner.style.display = 'block';

            try {
                const freshData = await this.syncNetwork();
                if (freshData) {
                    App.State.feed = this.mergeStrategy(freshData);
                    App.UI.renderFeed();
                    App.UI.toast("Feed Updated ⚡️");
                } else {
                    App.UI.toast("No changes or Offline");
                }
            } catch (e) {
                console.error(e);
                App.UI.toast("Update Failed");
            } finally {
                if (btn) btn.style.display = 'block';
                if (spinner) spinner.style.display = 'none';
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
            if (heart) {
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
            if (!id) return;

            App.UI.closeModals(); // Close menu first

            if (type === 'image') {
                // Share as Image (Full Content)
                setTimeout(() => this.shareAsImage(id, 'image'), 300);
            }
            else if (type === 'question') {
                // Share as Question (Hidden Cloze)
                setTimeout(() => this.shareAsImage(id, 'question'), 300);
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

        // 4. SHARE AS IMAGE (GENERATOR)
        async shareAsImage(cardId, mode = 'question') {
            const originalCard = document.getElementById(cardId);
            const cardData = App.State.feed.find(c => c.id === cardId); // Data Backup

            if (!originalCard) return;

            App.UI.toast(mode === 'question' ? "Designing Quiz... 🧩" : "Designing Note... 🎨");

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

                            // --- HANDLE CLOZE VISIBILITY BASED ON MODE ---
                            const keywords = clonedCard.querySelectorAll('.keyword');
                            if (mode === 'question') {
                                // HIDE Answer (Mask it)
                                keywords.forEach(k => { k.innerText = '[ ...?... ]'; });
                            } else {
                                // SHOW Answer (Ensure it looks like a highlight)
                                keywords.forEach(k => {
                                    k.classList.remove('is-hidden'); // Force visibility
                                    // Optional: Add specific highlight style if needed, 
                                    // but default .keyword style should work.
                                });
                            }

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
                            } else {
                                // 2b. If no image, Activate Premium Text Mode
                                clonedCard.classList.add('premium-text-only');
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
                    let titleSlug = titleEl ? titleEl.innerText.substring(0, 15).replace(/[^a-z0-9]/gi, '_') : 'Note';

                    // Add suffix based on mode
                    const suffix = mode === 'question' ? '_quiz' : '_full';
                    const fileName = `CivilsKash_${titleSlug}${suffix}.png`;

                    const file = new File([blob], fileName, { type: "image/png" });

                    if (navigator.canShare && navigator.canShare({ files: [file] })) {
                        try { await navigator.share({ files: [file] }); } catch (e) { }
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
            if (select) select.value = themeName;

        },

        async toggleBookmark(id) {
            App.UI.haptic([5, 30, 5]);
            const isBookmarked = App.State.bookmarks.has(id);
            const newSet = new Set(App.State.bookmarks);
            if (isBookmarked) newSet.delete(id); else newSet.add(id);

            App.State.bookmarks = newSet;
            await App.DB.put('bookmarks', 'ids', Array.from(newSet));

            const btn = document.getElementById(`like-btn-${id}`);
            if (btn) btn.classList.toggle('liked', !isBookmarked);
            App.UI.toast(isBookmarked ? "Removed Bookmark" : "Saved ❤️");
        },
        async setLayout(mode) {
            App.State.desktopLayout = mode;

            await App.DB.put('settings', 'desktopLayout', mode);

            const feed = document.getElementById('feed-list');

            // Reset Classes
            feed.classList.remove('layout-paper', 'layout-web');

            // Apply New Class
            if (mode === 'paper') feed.classList.add('layout-paper');
            if (mode === 'web') feed.classList.add('layout-web');

            App.UI.toast(`Layout changed to ${mode.charAt(0).toUpperCase() + mode.slice(1)}`);

            App.UI.renderFeed(false);
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
            if (keywords.length === 0) return;
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
            if (input) {
                input.value = '';
                input.focus(); // Keep focus so user can type something else
            }
            if (btn) btn.style.display = 'none';

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
            window.history.pushState({ path: cleanUrl }, '', cleanUrl);
            document.title = "CivilsKash - for Daily Current Affairs"; // Reset Title

            this.clearSearch();
            document.getElementById('category-active-badge').style.display = 'none';
            document.getElementById('category-btn').classList.remove('active-state');
            const bookmarkBtn = document.getElementById('bookmarks-btn');
            bookmarkBtn.classList.remove('active-state');
            bookmarkBtn.querySelector('svg').style.fill = 'none';

            document.getElementById('app-container').scrollTo(0, 0);
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

            const dateStr = new Date().toISOString().slice(0, 10);
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
                if (lastDate) {
                    const d1 = new Date(lastDate);
                    const d2 = new Date(today);
                    const diffDays = Math.ceil(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24));
                    if (diffDays > 1) count = 0; // Reset if broken
                }

                count++;
                localStorage.setItem('civils_streak_count', count);
                localStorage.setItem('civils_last_streak_date', today);

                App.UI.toast(`Streak Extended! 🔥 ${count} Days`);
                this.updateStreakInfo(); // Refresh UI
            }
        },

        // 2. Content Hash Generator
        _generateContentHash(text) {
            let hash = 0;
            const cleanText = text.replace(/\s+/g, '').toLowerCase();
            for (let i = 0; i < cleanText.length; i++) {
                hash = ((hash << 5) - hash) + cleanText.charCodeAt(i);
                hash = hash & hash; // Convert to 32-bit integer
            }
            return Math.abs(hash).toString(36);
        },

        // 3. CARD PARSER (Uses content-hash IDs)
        _createAtomicCards(item, itemIndex) {
            if (!item.summary) return [];
            const chunks = item.summary.split(/<br\s*\/?>|\n\n/i);
            const cards = [];

            chunks.forEach((chunk) => {
                if (chunk.includes('{{c')) {
                    // ISSUE #3 FIX: Use content hash instead of index
                    const contentHash = this._generateContentHash(chunk);
                    const subId = `${item.id}_h_${contentHash}`;
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
            // 1. HELPER: Calculate Urgency Score
            // High Score = More Urgent
            const getUrgency = (card) => {
                // Default Intervals (in ms)
                const intervals = {
                    'again': 0.1 * 24 * 60 * 60 * 1000,    // 2.4 hours
                    'viewed': 0.5 * 24 * 60 * 60 * 1000,   // 12 hours
                    'hard': 1.0 * 24 * 60 * 60 * 1000,     // 1 day
                    'good': 3.0 * 24 * 60 * 60 * 1000,     // 3 days
                    'easy': 7.0 * 24 * 60 * 60 * 1000,     // 7 days
                };

                if (card.status === 'new') return 100; // Arbitrary high urgency for new cards if picked

                const lastReview = card.lastReview || 0;
                const timeSince = Date.now() - lastReview;
                const idealInterval = intervals[card.status] || intervals['viewed'];

                return timeSince / idealInterval;
            };

            // 2. PREPARE DATA: Flatten & Attach Metadata
            let allCards = App.State.feed.flatMap((item, idx) => this._createAtomicCards(item, idx));
            const cardsWithMeta = allCards.map(card => {
                const dbEntry = App.State.srsData[card.id];
                const status = dbEntry ? dbEntry.status : 'new';
                const lastReview = dbEntry ? dbEntry.lastReview : 0;

                // Form the enriched object
                const enriched = { ...card, status, lastReview };

                // Attach dynamic urgency score
                enriched.urgencyScore = getUrgency(enriched);
                return enriched;
            });

            // --- MODE A: CRAM MODE (Smart Triage) ---
            if (mode === 'cram') {
                // Focus: Anything that isn't brand new.
                // Priority: Highest Urgency Score (Overdue Hard > Overdue Good > Recent Hard)
                let cramCandidates = cardsWithMeta.filter(c => c.status !== 'new');

                // Fallback: If literally zero reviews exist, use everything
                if (cramCandidates.length === 0) cramCandidates = [...cardsWithMeta];

                // Sort Descending by Urgency
                cramCandidates.sort((a, b) => b.urgencyScore - a.urgencyScore);

                return cramCandidates.slice(0, 10);
            }

            // --- MODE B: PRACTICE (Queue) ---
            if (mode === 'practice') {
                if (App.State.activeCategory !== 'all') {
                    // Note: Filter creates a new array, so we must assign it back or use a chained approach
                    const filtered = cardsWithMeta.filter(c => c.category === App.State.activeCategory);
                    // Use the filtered list for sorting
                    filtered.sort((a, b) => {
                        if (a.lastReview !== b.lastReview) return a.lastReview - b.lastReview; // Unseen (0) first
                        return a.feedIndex - b.feedIndex;
                    });
                    return filtered.slice(0, 10);
                }

                // Global Practice
                cardsWithMeta.sort((a, b) => {
                    if (a.lastReview !== b.lastReview) return a.lastReview - b.lastReview;
                    return a.feedIndex - b.feedIndex;
                });

                return cardsWithMeta.slice(0, 10);
            }

            // --- MODE C: DAILY MASTERY (Weighted Buckets) ---
            // Buckets
            const buckets = { new: [], learning: [], review: [] };

            cardsWithMeta.forEach(card => {
                if (card.status === 'new') buckets.new.push(card);
                else if (card.status === 'again' || card.status === 'hard') buckets.learning.push(card);
                else buckets.review.push(card);
            });

            // Weighted Sorting
            // New: Random Shuffle (to explore different topics)
            buckets.new.sort(() => 0.5 - Math.random());

            // Learning & Review: Sort by Urgency (Descending) - Most overdue first
            const urgencySort = (a, b) => b.urgencyScore - a.urgencyScore;
            buckets.learning.sort(urgencySort);
            buckets.review.sort(urgencySort);

            // Selection Logic (4-4-2 Split)
            let finalDeck = [];
            const TARGET = 10;

            // Helper to pull N cards
            const pull = (source, count) => {
                const extracted = source.splice(0, count);
                finalDeck.push(...extracted);
                return count - extracted.length; // Returns MISSING count
            };

            // 1. Initial Pull
            let deficit = 0;
            deficit += pull(buckets.new, 4);      // 4 New
            deficit += pull(buckets.learning, 4); // 4 Learning
            deficit += pull(buckets.review, 2);   // 2 Review

            // 2. Intelligent Backfill (if deficit > 0)
            // Priority: Learning > New > Review
            if (finalDeck.length < TARGET) {
                if (buckets.learning.length > 0) pull(buckets.learning, TARGET - finalDeck.length);
            }
            if (finalDeck.length < TARGET) {
                if (buckets.new.length > 0) pull(buckets.new, TARGET - finalDeck.length);
            }
            if (finalDeck.length < TARGET) {
                if (buckets.review.length > 0) pull(buckets.review, TARGET - finalDeck.length);
            }

            return finalDeck.slice(0, TARGET);
        },

        // 4. SESSION CONTROLS
        startTest() { this._boot('test'); },
        startPractice() { this._boot('practice'); },
        startCram() { this._boot('cram'); },

        cycleFont() {
            const s = this.session;
            s.fontIndex = (s.fontIndex + 1) % s.fontLevels.length;

            const newSize = s.fontLevels[s.fontIndex];

            const els = [document.getElementById('fc-front-text'), document.getElementById('fc-back-text')];
            els.forEach(el => {
                if (el) {
                    el.style.fontSize = newSize;
                    el.style.transition = "font-size 0.2s ease";
                }
            });
            App.UI.toast(`Text Size: ${newSize}`);
        },

        _boot(mode) {
            const deck = this.generateDeck(mode);

            if (deck.length === 0) {
                if (mode === 'cram') return App.UI.toast("No 'Hard' cards to cram yet! Keep studying.");
                return App.UI.toast("No cards available for this mode.");
            }

            this.session = {
                mode: mode, deck: deck, pointer: 0,
                stats: { score: 0, breakdown: { again: 0, hard: 0, good: 0, easy: 0 } },
                isAnimating: false,
                viewedInSession: new Set(),
                fontLevels: ['0.9rem', '1rem', '1.2rem', '1.4rem', '1.7rem', '2rem'],
                fontIndex: 2
            };

            App.UI.closeModals();
            document.getElementById('quiz-fullscreen-layer').classList.add('active');

            let title = "DAILY MASTERY";
            if (mode === 'practice') title = "PRACTICE QUEUE";
            if (mode === 'cram') title = "CRAM SESSION ⚡";

            document.getElementById('quiz-header-label').innerHTML = `<span style="color:var(--primary)">●</span> ${title}`;
            document.getElementById('quiz-summary').classList.remove('visible');

            this._renderCard(false);
        },

        // 5. RESET CARD FUNCTIONALITY (The new power feature)
        async resetCard(cardId) {
            // Prevent bubbling if triggered from button
            if (event) event.stopPropagation();

            const currentCard = this.session.deck.find(c => c.id === cardId);
            if (!currentCard) return;

            // 1. Reset Data
            currentCard.status = 'new';
            currentCard.lastReview = 0;

            App.State.srsData[cardId] = { status: 'new', lastReview: 0, parentId: currentCard.parentId };
            await App.DB.put('srs_data', null, App.State.srsData[cardId]);

            // 2. Update UI Immediately
            const cap = document.querySelector(`.card-status-capsule`);
            if (cap) {
                cap.className = `card-status-capsule status-new`;
                cap.innerHTML = `<span>✨</span> NEW`;
                // Flash effect
                cap.style.transform = "scale(1.2)";
                setTimeout(() => cap.style.transform = "scale(1)", 200);
            }

            App.UI.toast("Card reset to New");
        },

        // 6. SHARE FLASHCARD (Generates Premium Image)
        async shareCard(cardId) {
            const card = this.session.deck.find(c => c.id === cardId);
            if (!card) return;

            App.UI.toast("Designing Flashcard... 🎨");

            // 1. Process Text: Replace clozes with styled spans
            const processedText = card.raw.replace(/\{\{c\d+::(.*?)\}\}/g, '<span class="export-cloze"> [... ? ...] </span>');

            // 2. Context Info
            const parent = App.State.feed.find(p => p.id === card.parentId);
            const parentTitle = parent ? parent.title : 'General Knowledge';
            const category = (card.category || 'Flashcard').toUpperCase();

            // 3. Create Container
            const exportContainer = document.createElement('div');
            exportContainer.id = 'export-container-wrapper';
            exportContainer.style.position = 'fixed';
            exportContainer.style.left = '-9999px';
            exportContainer.style.top = '0';
            exportContainer.style.zIndex = '-9999';

            exportContainer.innerHTML = `
                <div class="flashcard-export-canvas" id="export-canvas-${cardId}">
                    <div class="export-header-row">
                        <span class="export-pill-category">${category}</span>
                        <div class="export-watermark-logo">Civils<span>Kash</span><span class="tld">.in</span></div>
                    </div>
                    
                    <div class="export-card-body">
                        <div class="export-text-content">
                            ${processedText}
                        </div>
                    </div>
                    
                    <div class="export-footer-row">
                       <div class="export-meta-info">
                            <span class="export-label">TOPIC</span>
                            <span class="export-topic-title">${parentTitle}</span>
                       </div>
                       <div class="export-app-badge">
                            <span>Answer this?</span>
                       </div>
                    </div>
                </div>
            `;

            document.body.appendChild(exportContainer);

            try {
                const target = exportContainer.querySelector('.flashcard-export-canvas');
                // Allow layout to settle
                await new Promise(r => setTimeout(r, 100));

                const canvas = await html2canvas(target, {
                    scale: 2, // High resolution
                    useCORS: true,
                    backgroundColor: null,
                });

                canvas.toBlob(async (blob) => {
                    if (!blob) throw new Error("Image generation failed");
                    const fileName = `CivilsKash_Card_${Date.now()}.png`;
                    const file = new File([blob], fileName, { type: "image/png" });

                    if (navigator.canShare && navigator.canShare({ files: [file] })) {
                        await navigator.share({ files: [file] });
                    } else {
                        const link = document.createElement('a');
                        link.download = fileName;
                        link.href = canvas.toDataURL();
                        link.click();
                        App.UI.toast("Saved to Gallery 📸");
                    }
                    if (document.body.contains(exportContainer)) document.body.removeChild(exportContainer);
                }, 'image/png');

            } catch (e) {
                console.error("Export Error:", e);
                App.UI.toast("Export failed");
                if (document.body.contains(exportContainer)) document.body.removeChild(exportContainer);
            }
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

                const isEnlarged = App.Quiz.session.isLargeFont ? 'enlarged' : '';

                return `
                        <div class="status-header">
                            <span class="clean-capsule ${info.cls}">${info.label}</span>
                            <div style="display:flex; gap:8px;">
                                <button class="capsule-reset-btn" onclick="event.stopPropagation(); App.Quiz.cycleFont()" title="Change Size">
                                    <span style="font-size:0.9rem; font-weight:800; letter-spacing:-1px;">Aa</span>
                                </button>
                                <button class="capsule-reset-btn" onclick="event.stopPropagation(); App.Quiz.resetCard('${card.id}')" title="Reset Card">
                                    ↺
                                </button>
                                <button class="capsule-reset-btn" onclick="event.stopPropagation(); App.Quiz.shareCard('${card.id}')" title="Share Flashcard">
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" style="display:block;"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                </button>
                            </div>
                        </div>`;
            };

            const setupText = () => {
                const headerHTML = getCapsuleHTML(card.status || 'new');
                const fEl = document.getElementById('fc-front-text');
                const bEl = document.getElementById('fc-back-text');

                fEl.innerHTML = headerHTML + card.front;
                bEl.innerHTML = headerHTML + card.back;

                const currentSize = s.fontLevels[s.fontIndex];
                fEl.style.fontSize = currentSize;
                bEl.style.fontSize = currentSize;

                wrapper.classList.remove('is-flipped');

                const footer = document.getElementById('quiz-back-controls');
                if (s.mode === 'test' || s.mode === 'cram') {
                    footer.innerHTML = `
                                <div class="srs-grid">
                                    <button class="srs-btn srs-again" onclick="App.Quiz.rate('again', 0.2)"><span>Again</span><span>Fail</span></button>
                                    <button class="srs-btn srs-hard" onclick="App.Quiz.rate('hard', 0.6)"><span>Hard</span><span>Tough</span></button>
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

            if (status === 'again') App.UI.haptic(40);
            else App.UI.haptic(10);

            const s = this.session;
            const card = s.deck[s.pointer];

            s.stats.score += points;

            // Track Breakdown
            if (s.stats.breakdown[status] !== undefined) {
                s.stats.breakdown[status]++;
            }

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
        async _finishSession() {
            const s = this.session;

            // SAVE STREAK
            this.commitStreak();

            document.getElementById('quiz-progress-bar').style.width = '100%';
            const summaryContainer = document.getElementById('quiz-summary');

            // --- MODE A: PRACTICE (Simple) ---
            if (s.mode === 'practice') {
                const title = "Queue Updated";
                const btnAction = "App.Quiz.startPractice()";
                const btnText = "Next Batch";

                summaryContainer.innerHTML = `
                        <div style="text-align:center; width:100%; max-width:350px; animation: fadeInUp 0.5s ease;">
                            <div style="font-size:4rem; margin-bottom:10px;">🔥</div>
                            <h2 style="font-size:2rem; font-weight:800; margin-bottom:5px;">${title}</h2>
                            <div style="font-size:1rem; color:var(--primary); margin-bottom:15px; font-weight:bold;">Streak Saved!</div>
                            <p style="color:var(--text-muted); margin-bottom:30px; line-height:1.5;">You reviewed ${s.deck.length} cards.</p>
                            <div style="display:flex; flex-direction:column; gap:12px;">
                                <button class="btn-large btn-primary" onclick="${btnAction}"><span>${btnText}</span> <span>↻</span></button>
                                <button class="btn-large btn-outline" style="border:none; color:var(--text-muted);" onclick="App.Quiz.exit()">Return to Feed</button>
                            </div>
                        </div>`;
                summaryContainer.classList.add('visible');
                return;
            }

            // --- MODE B: TEST / CRAM (Detailed Report Card) ---

            // 1. Calculate Score
            // Max Possible = deck.length * 1.0
            // Actual = stats.score
            // To normalise to 0-10 scale: (Actual / Max) * 10
            let rawScore = 0;
            if (s.deck.length > 0) {
                rawScore = (s.stats.score / s.deck.length) * 10;
            }
            // Clamp 0-10
            const finalScore = Math.min(Math.max(rawScore, 0), 10).toFixed(1);

            // 2. Save History & Get Graph Data
            await this.saveSessionScore(parseFloat(finalScore));
            const historyData = await this.getPast30DaysData();

            // 3. Prepare UI Elements
            const gradeInfo = this._getGrade(finalScore);
            const chartSVG = this._renderProgressChart(historyData);

            const btnAction = s.mode === 'cram' ? "App.Quiz.startCram()" : "App.Quiz.startTest()";
            const btnText = "New Session";
            const title = s.mode === 'cram' ? "Cram Session" : "Daily Mastery";

            const html = `
                <div class="result-card" style="width:100%; max-width:600px; padding:35px 30px; animation: fadeInUp 0.5s ease;">
                    
                    <!-- Header -->
                    <div style="text-align:center; margin-bottom:30px;">
                        <h2 style="font-size:1.6rem; font-weight:800; color:var(--text-main); margin-bottom:4px;">${title}</h2>
                        <div style="font-size:0.85rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:2px;">Session Complete</div>
                    </div>

                    <!-- Score Display (Horizontal: Score + Grade Pill) -->
                    <div style="display:flex; justify-content:center; align-items:center; gap:20px; margin-bottom:35px; flex-wrap:wrap;">
                        <div style="text-align:center;">
                            <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; margin-bottom:6px;">Your Score</div>
                            <div style="font-size:3.5rem; font-weight:900; line-height:1; color:var(--text-main);">${finalScore}<span style="font-size:1.5rem; color:var(--text-muted); font-weight:400;">/10</span></div>
                        </div>
                        <div class="grade-pill ${gradeInfo.class}" style="box-shadow:0 6px 20px rgba(0,0,0,0.3); font-size:1rem; padding:10px 24px;">
                            ${gradeInfo.label}
                        </div>
                    </div>

                    <!-- Quick Stats (Clean Icons + Numbers) -->
                    <div style="display:flex; justify-content:center; gap:25px; margin-bottom:30px; flex-wrap:wrap;">
                        <div style="text-align:center;">
                            <div style="font-size:1.8rem; font-weight:800; color:#10b981;">${s.stats.breakdown.easy}</div>
                            <div style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase;">Easy</div>
                        </div>
                        <div style="text-align:center;">
                            <div style="font-size:1.8rem; font-weight:800; color:#3b82f6;">${s.stats.breakdown.good}</div>
                            <div style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase;">Good</div>
                        </div>
                        <div style="text-align:center;">
                            <div style="font-size:1.8rem; font-weight:800; color:#f59e0b;">${s.stats.breakdown.hard}</div>
                            <div style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase;">Hard</div>
                        </div>
                        <div style="text-align:center;">
                            <div style="font-size:1.8rem; font-weight:800; color:#ef4444;">${s.stats.breakdown.again}</div>
                            <div style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase;">Again</div>
                        </div>
                    </div>

                    <!-- Performance Chart -->
                    <div class="chart-container" style="margin-bottom:30px;">
                        <div style="font-size:0.7rem; font-weight:700; color:var(--text-muted); margin-bottom:12px; text-transform:uppercase; letter-spacing:1px;">Progress (Last 15 Days)</div>
                        ${chartSVG}
                    </div>

                    <!-- Actions -->
                    <div style="display:flex; flex-direction:column; gap:12px;">
                        <button class="btn-large btn-primary" onclick="${btnAction}">
                            <span>${btnText}</span> <span>↻</span>
                        </button>
                        <button class="btn-large btn-outline" style="border:none; color:var(--text-muted);" onclick="App.Quiz.exit()">
                            Return to Feed
                        </button>
                    </div>

                </div>
            `;

            summaryContainer.innerHTML = html;
            summaryContainer.classList.add('visible');
        },

        // --- HELPER: SAVE SCORE ---
        async saveSessionScore(score) {
            const today = new Date().toISOString().split('T')[0];
            let history = await App.DB.get('settings', 'quizHistory') || []; // Array of {date, avgScore, count}

            // Find today's entry
            let entryIndex = history.findIndex(h => h.date === today);

            if (entryIndex >= 0) {
                // Update Average
                const e = history[entryIndex];
                const newTotal = (e.avgScore * e.count) + score;
                e.count++;
                e.avgScore = newTotal / e.count;
            } else {
                // New Day
                history.push({ date: today, avgScore: score, count: 1 });
            }

            // Prune > 15 Days (keep last 15)
            if (history.length > 15) {
                history = history.slice(history.length - 15);
            }

            await App.DB.put('settings', 'quizHistory', history);
        },

        async getPast30DaysData() {
            let history = await App.DB.get('settings', 'quizHistory') || [];
            // Sort by date just in case
            history.sort((a, b) => new Date(a.date) - new Date(b.date));
            return history;
        },

        // --- HELPER: GRADE ---
        _getGrade(score) {
            const s = parseFloat(score);
            if (s >= 9.0) return { label: 'A+', class: 'grade-gold' };
            if (s >= 8.0) return { label: 'A', class: 'grade-green' };
            if (s >= 7.0) return { label: 'B+', class: 'grade-blue' };
            if (s >= 6.0) return { label: 'B', class: 'grade-indigo' };
            if (s >= 5.0) return { label: 'C', class: 'grade-orange' };
            if (s >= 4.0) return { label: 'D', class: 'grade-burnt-orange' };
            return { label: 'F', class: 'grade-red' };
        },

        // --- HELPER: BAR CHART (15 Days) ---
        _renderProgressChart(data) {
            if (!data || data.length < 1) {
                return `<div style="height:80px; display:flex; align-items:center; justify-content:center; color:var(--text-muted); font-size:0.8rem; background:rgba(255,255,255,0.05); border-radius:8px;">Complete a session to see progress</div>`;
            }

            // Take only last 15 days
            const chartData = data.slice(-15);
            const maxScore = 10;

            // Generate bars HTML
            const barsHTML = chartData.map((day, index) => {
                const heightPercent = (day.avgScore / maxScore) * 100;
                const score = day.avgScore.toFixed(1);
                const delay = index * 50; // Stagger animation

                return `
                    <div class="chart-bar" 
                         style="--bar-height: ${heightPercent}%; height: ${heightPercent}%; animation-delay: ${delay}ms;"
                         data-score="${score}"
                         title="${day.date}: ${score}/10">
                    </div>
                `;
            }).join('');

            return `
                <div class="bar-chart" id="performance-bars">
                    ${barsHTML}
                </div>
                <div style="display:flex; justify-content:space-between; margin-top:8px; font-size:0.65rem; color:var(--text-muted);">
                    <span>${chartData.length} day${chartData.length > 1 ? 's' : ''} ago</span>
                    <span>Today</span>
                </div>
            `;
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
        toggleHeaderMenu() {
            const menu = document.getElementById('header-extras');
            if (menu) {
                menu.classList.toggle('active');
                this.haptic(5);
                if (menu.classList.contains('active')) {
                    const closeHandler = (e) => {
                        if (!e.target.closest('#header-extras') && !e.target.closest('#header-more-btn')) {
                            menu.classList.remove('active');
                            document.removeEventListener('click', closeHandler);
                        }
                    };
                    setTimeout(() => document.addEventListener('click', closeHandler), 10);
                }
            }
        },

        haptic(pattern = 5) {
            // Only works on Android/supported browsers
            if (navigator.vibrate) {
                navigator.vibrate(pattern);
            }
        },
        openModal(id) {
            this.haptic(10);
            const el = document.getElementById(id);

            if (id === 'modal-quiz-menu') {
                if (App.Quiz && App.Quiz.updateStreakInfo) {
                    App.Quiz.updateStreakInfo();
                }
            }

            if (id === 'modal-categories') {
                this.renderCategoryChips();

                setTimeout(() => {
                    const input = document.getElementById('global-search-input');
                    if (input) {
                        input.focus();
                        // Optional: Select existing text if any, so typing replaces it
                        input.select();
                    }
                }, 50);
            }

            // Note Modal: Initialize selection toolbar and reset title
            if (id === 'modal-create-card') {
                const modalTitle = document.getElementById('note-modal-title');
                if (modalTitle && !App.State.editingNoteId) {
                    modalTitle.innerHTML = 'New Note 📝';
                }
                // Initialize selection toolbar and focus on title input
                setTimeout(() => {
                    if (App.UI.initSelectionToolbar) {
                        App.UI.initSelectionToolbar();
                    }
                    // Auto-focus on title input for immediate typing
                    const titleInput = document.getElementById('input-card-title');
                    if (titleInput) titleInput.focus();
                }, 100);
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

        // New Content Available toast
        showNewContentToast() {
            const existingToast = document.getElementById('new-content-toast');
            if (existingToast) existingToast.remove(); // Remove if already exists

            const toast = document.createElement('div');
            toast.id = 'new-content-toast';
            toast.className = 'new-content-toast';
            toast.innerHTML = `
                <span class="new-content-icon">✨</span>
                <span class="new-content-text">New Feed Content</span>
                <button class="new-content-btn" onclick="App.UI.applyPendingUpdate()">Refresh</button>
                <button class="new-content-close" onclick="this.parentElement.remove()">✕</button>
            `;
            document.body.appendChild(toast);

            // Animate in
            requestAnimationFrame(() => {
                toast.classList.add('visible');
            });
        },

        applyPendingUpdate() {
            if (App.State.pendingFeedUpdate) {
                App.State.feed = App.Data.mergeStrategy(App.State.pendingFeedUpdate);
                App.State.pendingFeedUpdate = null;
                App.UI.renderFeed();
                App.UI.toast("Feed Updated ⚡");

                // Scroll to top smoothly
                document.getElementById('app-container').scrollTo({ top: 0, behavior: 'smooth' });
            }

            // Remove the toast
            const toast = document.getElementById('new-content-toast');
            if (toast) toast.remove();
        },

        renderCategoryChips() {
            const container = document.getElementById('category-chips-container');
            const categories = new Set(App.State.feed.map(i => i.category));
            let sorted = Array.from(categories).sort();

            // "All" chip first - with special 3D styling
            let html = `<div class="chip chip-special ${App.State.activeCategory === 'all' ? 'active' : ''}" onclick="App.Actions.setCategory('all')">All</div>`;

            // "Curated" chip second - with special 3D styling
            if (sorted.includes('Curated')) {
                const isActive = App.State.activeCategory === 'Curated';
                html += `<div class="chip chip-special ${isActive ? 'active' : ''}" onclick="App.Actions.setCategory('Curated')">Curated</div>`;
                sorted = sorted.filter(c => c !== 'Curated');
            }

            // Rest of categories
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

            // Curated always second after Bookmarked
            html += `<option value="Curated">📝 Curated Notes</option>`;

            categories.forEach(c => {
                if (c !== 'Curated') html += `<option value="${c}">${c}</option>`;
            });

            html += `<option value="all">All Categories</option>`;

            select.innerHTML = html;
        },

        renderFeed(appendMode = false) {
            const container = document.getElementById('feed-list');

            // 1. Get Base Data (Filtered)
            const term = App.State.searchTerm;
            let allItems = App.State.feed; // Start with raw feed

            // --- APPLY FILTERS ---
            if (App.State.activeDeepLink) {
                allItems = allItems.filter(i => i.id === App.State.activeDeepLink);
                if (allItems.length > 0) document.title = `${allItems[0].title} - CivilsKash`;
            } else {
                document.title = "CivilsKash - for Daily Current Affairs";
                if (term.length > 0) {
                    allItems = allItems.filter(i => (i.title + ' ' + i.summary).toLowerCase().includes(term));
                }
                if (App.State.activeCategory !== 'all') {
                    allItems = allItems.filter(i => i.category === App.State.activeCategory);
                }
                if (App.State.filterBookmarks) {
                    allItems = allItems.filter(i => App.State.bookmarks.has(i.id));
                }
            }

            App.State.totalAvailable = allItems.length;

            // 2. Handle Pagination Logic
            if (!appendMode) {
                container.innerHTML = '';
                App.State.feedPointer = App.State.batchSize; // Reset to initial batch
                container.scrollTop = 0; // Jump to top
            }

            // 3. Slice Data for *Current View*

            let itemsToRender;

            if (appendMode) {
                const start = App.State.feedPointer - App.State.batchSize;
                const end = App.State.feedPointer;
                itemsToRender = allItems.slice(start, end);
            } else {
                itemsToRender = allItems.slice(0, App.State.batchSize);
            }

            // --- EMPTY STATE ---
            if (!appendMode && itemsToRender.length === 0) {
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

            // 4. Generate HTML (Efficient String Buffer)
            let htmlBuffer = '';

            // Inject Back Button only once at the top if Deep Linked
            if (App.State.activeDeepLink && !appendMode) {
                htmlBuffer += `
                 <div style="grid-column: 1/-1; width:100%; display:flex; justify-content:center; margin-bottom:30px; animation: fadeIn 0.5s ease;">
                     <button class="btn-large btn-outline" onclick="App.Actions.goHome()" 
                         style="background:var(--bg-card); border:1px solid var(--border-glass); color:var(--text-main); max-width: 200px; gap:10px; box-shadow:var(--shadow-soft);">
                         <span>←</span> <span>View All Notes</span>
                     </button>
                 </div>`;
            }

            const isHidden = App.State.isGlobalHide;

            itemsToRender.forEach((item, idx) => {
                // Calculate absolute index for animations/logic
                const globalIdx = appendMode ? (idx + (App.State.feedPointer - App.State.batchSize)) : idx;

                htmlBuffer += this._createCardHTML(item, globalIdx);
            });

            // 5. Inject into DOM
            if (appendMode) {
                // Create a temp container to convert string to nodes
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = htmlBuffer;
                while (tempDiv.firstChild) {
                    container.appendChild(tempDiv.firstChild);
                }
            } else {
                container.innerHTML = htmlBuffer;
            }

            // --- C. TRIGGER AD LOAD ---
            setTimeout(() => {
                if (App.Ads) App.Ads.triggerGoogleAds();
            }, 100);

            App.State.isLoadingMore = false; // Release lock
        },

        // --- HELPER: HTML GENERATOR (Shared by Render & Restore) ---
        _createCardHTML(item, globalIdx) {
            const term = document.getElementById('search-input') ? document.getElementById('search-input').value.trim() : '';
            const isHidden = App.State.isGlobalHide;
            const hasImg = item.image && item.image.trim() !== '';
            const isLiked = App.State.bookmarks.has(item.id);
            const eyeIcon = isHidden ? App.Icons.eyeClosed : App.Icons.eyeOpen;
            const isVeryNew = (Date.now() - item.timestamp) < 86400000;
            const badgeClass = isVeryNew ? 'badge badge-new' : 'badge';

            const finalTitle = this._processSmartContent(item.title, term, false, isHidden);
            const finalSummary = this._processSmartContent(item.summary, term, true, isHidden);

            // Force layout styles for Web/No-Img
            const isWebLayout = App.State.desktopLayout === 'web';
            const summaryStyle = (isWebLayout || !hasImg)
                ? 'style="-webkit-line-clamp: unset; line-clamp: unset; max-height: none; display: block;"'
                : '';

            return `
                <article class="news-card ${hasImg ? '' : 'text-only'}" id="${item.id}" data-idx="${globalIdx}"
                        ondblclick="App.Actions.triggerHeartAnimation('${item.id}')"
                        ontouchend="App.Actions.handleTouchHeart(event, '${item.id}')">
                    
                    <div class="watermark-overlay">Civils<span style="color:var(--primary)">Kash</span></div>
                    <div id="heart-anim-${item.id}" class="heart-pop">❤️</div>

                    <div class="scroll-content">
                        ${hasImg ? `<div class="card-img" style="background-image: url('${item.image}')"></div>` : ''}
                        
                        <div class="card-body">
                            <div class="meta-row">
                                <span class="${badgeClass}" onclick="event.stopPropagation(); App.Actions.setCategory('${item.category}')">${item.category}</span>
                                <span class="date">${item.date || 'Recent'}</span>
                            </div>
                            <h2>${finalTitle}</h2>
                            <p class="summary-box" ${summaryStyle}>${finalSummary}</p> </div>

                        <div class="action-toolbar-container" onclick="event.stopPropagation()">
                            <div class="action-toolbar ${item.isCurated ? 'curated-toolbar' : ''}">
                                ${item.isCurated ? `
                                <button class="icon-btn curated-edit-btn" onclick="event.stopPropagation(); App.Actions.editCuratedNote('${item.id}')" title="Edit Note">
                                    <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                </button>
                                <button class="icon-btn curated-delete-btn" onclick="event.stopPropagation(); App.Actions.deleteCuratedNote('${item.id}')" title="Delete Note">
                                    <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                                <div style="width: 1px; height: 16px; background: rgba(255,255,255,0.1);"></div>
                                ` : ''}
                                <button class="icon-btn" onclick="event.stopPropagation(); App.Actions.openShareMenu('${item.id}')" title="Share Options">
                                    <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                                </button>
                                <div style="width: 1px; height: 16px; background: rgba(255,255,255,0.1);"></div>
                                <button class="icon-btn local-eye-btn" id="hide-btn-${item.id}" onclick="App.Actions.toggleLocalHide('${item.id}')" title="Toggle Keywords">
                                    ${eyeIcon}
                                </button>
                                <div style="width: 1px; height: 16px; background: rgba(255,255,255,0.1);"></div>
                                <button class="icon-btn ${isLiked ? 'liked' : ''}" id="like-btn-${item.id}" onclick="App.Actions.toggleBookmark('${item.id}')" title="Bookmark">
                                    <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </article>`;
        },

        _processSmartContent(rawText, query, isSummary, isHidden) {
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
        },

        //Virtual Scroll - Recycle old cards to prevent memory leak
        recycleOldCards() {
            const container = document.getElementById('feed-list');
            const cards = container.querySelectorAll('.news-card, .placeholder-card');
            const maxCards = App.State.maxDomCards;

            // Only recycle if we're over the limit
            if (cards.length <= maxCards) return;

            const toRemove = cards.length - maxCards;

            for (let i = 0; i < toRemove; i++) {
                const card = cards[i];
                if (card && card.classList.contains('news-card')) {
                    const cardHeight = card.offsetHeight;

                    // Create a lightweight placeholder
                    const placeholder = document.createElement('div');
                    placeholder.className = 'placeholder-card';
                    placeholder.style.height = `${cardHeight}px`;
                    placeholder.dataset.originalId = card.id;
                    placeholder.dataset.recycledIndex = App.State.virtualScrollOffset + i;

                    // Replace the card with placeholder
                    container.replaceChild(placeholder, card);
                }
            }

            App.State.virtualScrollOffset += toRemove;
        },

        // Restore Recycled Cards - Rehydrate placeholders when notified
        restoreRecycledCards() {
            const container = document.getElementById('feed-list');
            const placeholders = container.querySelectorAll('.placeholder-card');
            if (placeholders.length === 0) return;

            const scrollContainer = document.getElementById('app-container');
            const viewTop = scrollContainer.scrollTop;
            const viewBottom = viewTop + scrollContainer.clientHeight;
            // Buffer of 600px
            const bufferTop = viewTop - 600;
            const bufferBottom = viewBottom + 600;

            placeholders.forEach(ph => {
                const phTop = ph.offsetTop;
                const phBottom = phTop + ph.offsetHeight;

                // Check intersection with buffer
                if (phBottom > bufferTop && phTop < bufferBottom) {
                    // It is in view! Restore it.
                    const originalId = ph.dataset.originalId;
                    const item = App.State.feed.find(i => i.id === originalId);
                    if (item) {
                        const recycledIndex = parseInt(ph.dataset.recycledIndex || '0');
                        const html = this._createCardHTML(item, recycledIndex);

                        // Create temp node
                        const temp = document.createElement('div');
                        temp.innerHTML = html;
                        const newCard = temp.firstElementChild;

                        if (newCard) {
                            container.replaceChild(newCard, ph);
                            // Adjust virtual offset if we are restoring form top
                            if (recycledIndex < App.State.virtualScrollOffset) {
                                App.State.virtualScrollOffset--;
                            }
                        }
                    }
                }
            });
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

    // --- POPUP FLASHCARDS ENGINE ---
    Notifications: {
        timers: {
            top60: null,
            periodic5: null,
            systemCheck: null
        },
        state: {
            activeCard: null,
            isVisible: false
        },

        init() {
            // 1. Check Permissions for System Notifications
            if ("Notification" in window) {
                if (Notification.permission === "granted") {
                    this.scheduleSystemNotification();
                }
            }

            // 2. Schedule In-App Notifications
            this.startTimers();

            // 3. Inject DOM if missing (just to be safe, though we rely on CSS/JS creating it dynamically)
            if (!document.getElementById('flashcard-popup')) {
                const div = document.createElement('div');
                div.id = 'flashcard-popup';
                div.className = 'flashcard-popup';
                document.body.appendChild(div);
            }
        },

        restartTimers() {
            if (this.timers.top60) clearTimeout(this.timers.top60);
            if (this.timers.periodic5) clearInterval(this.timers.periodic5);
            this.startTimers();
        },

        startTimers() {
            if (!App.State.flashcardEnabled) return;

            // A. The "Reset/Refresh" Mimic (30s after open)
            this.timers.top60 = setTimeout(() => {
                if (App.State.flashcardEnabled) this.showPopup();
            }, 30000);

            // B. The Periodic Popup (User defined interval)
            const intervalMs = App.State.flashcardFreq * 60 * 1000;
            this.timers.periodic5 = setInterval(() => {
                if (App.State.flashcardEnabled) this.showPopup();
            }, intervalMs);
        },
        async getDueCard() {
            // SMART ALGORITHM v3: Uses ATOMIC flashcards, same as Quiz

            const srs = App.State.srsData || {};
            const now = Date.now();

            // Build atomic flashcards from feed (same logic as Quiz._createAtomicCards)
            const allAtomicCards = [];
            App.State.feed.forEach((item, idx) => {
                if (!item.summary) return;
                const chunks = item.summary.split(/<br\s*\/?>/i);

                chunks.forEach((chunk) => {
                    if (chunk.includes('{{c')) {
                        // Generate content hash for stable ID
                        let hash = 0;
                        const cleanText = chunk.replace(/\s+/g, '').toLowerCase();
                        for (let i = 0; i < cleanText.length; i++) {
                            hash = ((hash << 5) - hash) + cleanText.charCodeAt(i);
                            hash = hash & hash;
                        }
                        const contentHash = Math.abs(hash).toString(36);
                        const subId = `${item.id}_h_${contentHash}`;

                        const regex = /\{\{c\d+::(.*?)\}\}/g;
                        allAtomicCards.push({
                            id: subId,
                            parentId: item.id,
                            category: item.category,
                            title: item.title,
                            front: chunk.replace(regex, '<span class="cloze-blank">[ ...? ]</span>'),
                            back: chunk.replace(regex, '<strong style="color:var(--primary);">$1</strong>'),
                            raw: chunk
                        });
                    }
                });
            });

            if (allAtomicCards.length === 0) return null;

            // COOLDOWNS
            const COOLDOWN_HARD = 60 * 60 * 1000;      // 1 hour
            const COOLDOWN_REVIEW = 12 * 60 * 60 * 1000; // 12 hours

            // Shuffle helper
            const shuffle = (array) => {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
            };

            // Filter buckets using atomic card IDs
            const hardCards = allAtomicCards.filter(c => {
                const s = srs[c.id];
                if (!s || (s.status !== 'hard' && s.status !== 'again')) return false;
                return (now - (s.lastReview || 0)) > COOLDOWN_HARD;
            });

            const newCards = allAtomicCards.filter(c => !srs[c.id] || srs[c.id].status === 'new');

            const reviewCards = allAtomicCards.filter(c => {
                const s = srs[c.id];
                if (!s || (s.status !== 'good' && s.status !== 'easy')) return false;
                return (now - (s.lastReview || 0)) > COOLDOWN_REVIEW;
            });

            // Selection Strategy
            if (hardCards.length > 0) {
                if (newCards.length > 0 && Math.random() > 0.7) {
                    return shuffle(newCards)[0];
                }
                return shuffle(hardCards)[0];
            }

            if (newCards.length > 0) {
                return shuffle(newCards)[0];
            }

            if (reviewCards.length > 0) {
                return shuffle(reviewCards)[0];
            }

            // Fallback: oldest reviewed
            const reviewedCards = allAtomicCards.filter(c => srs[c.id]);
            if (reviewedCards.length > 0) {
                reviewedCards.sort((a, b) => {
                    const timeA = srs[a.id].lastReview || 0;
                    const timeB = srs[b.id].lastReview || 0;
                    return timeA - timeB;
                });
                return reviewedCards[0];
            }

            return shuffle(allAtomicCards)[0];
        },

        async showPopup() {
            if (this.state.isVisible) return;

            // 4. QUIZ MODE CHECK (Don't disturb if user is already studying)
            if (document.getElementById('quiz-fullscreen-layer') &&
                document.getElementById('quiz-fullscreen-layer').classList.contains('active')) {
                return;
            }

            const card = await this.getDueCard();
            if (!card) return;

            this.state.activeCard = card;

            // Use pre-generated front/back from atomic card
            const questionHtml = card.front;
            const answerHtml = card.back;

            const popup = document.getElementById('flashcard-popup');
            if (!popup) return;

            // MINIMALIST RENDER - Text Pill Actions (Premium & Compact)
            popup.innerHTML = `
                <!-- No Close Button -->
                
                <div id="popup-face-front" class="flashcard-popup-content" 
                     style="cursor:pointer; padding-top:10px; transition:opacity 0.2s;"
                     onclick="App.Notifications.flip()">
                    <div style="opacity:0.95; line-height:1.6;">${questionHtml}</div>
                </div>

                <div id="popup-face-back" class="flashcard-popup-content" style="display:none; padding-top:10px;">
                    <div style="opacity:0.95; line-height:1.6;">${answerHtml}</div>
                </div>

                <!-- Floating Pill Action Bar -->
                <div id="popup-actions" class="flashcard-popup-actions" style="display:none;">
                    <button class="flashcard-popup-btn btn-popup-hard" onclick="App.Notifications.rate('hard')">Hard</button>
                    <button class="flashcard-popup-btn btn-popup-good" onclick="App.Notifications.rate('good')">Good</button>
                    <button class="flashcard-popup-btn btn-popup-more" onclick="App.Notifications.more()">More</button>
                    <button class="flashcard-popup-btn btn-popup-share" onclick="App.Notifications.shareCard()">Share</button>
                </div>
            `;

            popup.classList.add('visible');
            this.state.isVisible = true;
            App.UI.haptic(10);
        },

        flip() {
            const front = document.getElementById('popup-face-front');
            const back = document.getElementById('popup-face-back');
            const actions = document.getElementById('popup-actions');

            if (front && back && actions) {
                front.style.display = 'none';
                back.style.display = 'block';
                actions.style.display = 'flex';
                App.UI.haptic(5);
            }
        },

        more() {
            this.close();
            // Redirect to Cram Mode logic
            if (App.Quiz) {
                App.Quiz.startCram();
            } else {
                App.UI.toast("Opening Quiz... ⚡");
            }
        },

        close() {
            const popup = document.getElementById('flashcard-popup');
            if (popup) popup.classList.remove('visible');
            this.state.isVisible = false;
        },

        async rate(rating) {
            const card = this.state.activeCard;
            if (!card) return;

            App.UI.haptic(rating === 'good' ? 5 : 20);

            // Update SRS Data - Use ACTUAL status, not mapped
            const now = Date.now();
            const newData = {
                status: rating, // 'hard' or 'good' - save as-is
                lastReview: now,
                parentId: card.parentId || card.id
            };

            App.State.srsData[card.id] = newData;
            await App.DB.put('srs_data', null, { id: card.id, ...newData });

            // Toast feedback
            if (rating === 'good') App.UI.toast("Nice work! 🧠");
            else App.UI.toast("Seemed Uff!");

            this.close();
        },

        // Share flashcard as premium image
        async shareCard() {
            const card = this.state.activeCard;
            if (!card) return;

            App.UI.toast("Designing Flashcard... 🎨");

            // 1. Process Text: Replace clozes with styled export format
            const tempDiv = document.createElement('div');
            // FIX: use card.raw because card.summary is undefined for atomic cards
            tempDiv.innerHTML = card.raw || card.front;
            let cleanText = tempDiv.innerText;
            const processedText = cleanText.replace(/\{\{c\d+::(.*?)\}\}/g, '<span class="export-cloze"> [... ? ...] </span>');

            // 2. Context Info
            const category = (card.category || 'Flashcard').toUpperCase();
            const parentTitle = card.title || 'General Knowledge';

            // 3. Create Export Container
            const exportContainer = document.createElement('div');
            exportContainer.id = 'notification-export-wrapper';
            exportContainer.style.cssText = 'position:fixed; left:-9999px; top:0; z-index:-9999;';

            exportContainer.innerHTML = `
                <div class="flashcard-export-canvas" id="notification-export-canvas">
                    <div class="export-header-row">
                        <span class="export-pill-category">${category}</span>
                        <div class="export-watermark-logo">Civils<span>Kash</span><span class="tld">.in</span></div>
                    </div>
                    
                    <div class="export-card-body">
                        <div class="export-text-content">
                            ${processedText}
                        </div>
                    </div>
                    
                    <div class="export-footer-row">
                       <div class="export-meta-info">
                            <span class="export-label">TOPIC</span>
                            <span class="export-topic-title">${parentTitle}</span>
                       </div>
                       <div class="export-app-badge">
                            <span>Answer this?</span>
                       </div>
                    </div>
                </div>
            `;

            document.body.appendChild(exportContainer);

            try {
                const target = exportContainer.querySelector('.flashcard-export-canvas');
                await new Promise(r => setTimeout(r, 100)); // Layout settle

                const canvas = await html2canvas(target, {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: null,
                });

                canvas.toBlob(async (blob) => {
                    if (!blob) throw new Error("Image generation failed");
                    const fileName = `CivilsKash_Flashcard_${Date.now()}.png`;
                    const file = new File([blob], fileName, { type: "image/png" });

                    if (navigator.canShare && navigator.canShare({ files: [file] })) {
                        await navigator.share({ files: [file] });
                    } else {
                        const link = document.createElement('a');
                        link.download = fileName;
                        link.href = canvas.toDataURL();
                        link.click();
                        App.UI.toast("Saved to Gallery 📸");
                    }
                    if (document.body.contains(exportContainer)) document.body.removeChild(exportContainer);
                }, 'image/png');

            } catch (e) {
                console.error("Export Error:", e);
                App.UI.toast("Export failed");
                if (document.body.contains(exportContainer)) document.body.removeChild(exportContainer);
            }

            this.close();
        },

        // --- SYSTEM NOTIFICATION LOGIC ---
        scheduleSystemNotification() {
            // Check periodically
            this.timers.systemCheck = setInterval(() => {
                this.checkAndSendSystemNotify();
            }, 3600000); // Check every hour
        },

        async checkAndSendSystemNotify() {
            // FIX: Mobile Only Check
            const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768;
            if (!isMobile) return;

            if (Notification.permission !== "granted") return;

            const lastTime = parseInt(localStorage.getItem('last_sys_notify') || '0');
            const now = Date.now();

            if (now - lastTime > 21600000) { // 6 hours
                const card = await this.getDueCard();
                if (card) {
                    const n = new Notification("Time to Revise! 🧠", {
                        body: card.title + " - Do you remember this topic?",
                        icon: "https://civilskash.in/icon-192.png",
                        tag: "revision"
                    });

                    n.onclick = () => {
                        window.focus();
                        this.showPopup();
                    };

                    localStorage.setItem('last_sys_notify', now);
                }
            }
        }
    },
    async init() {
        try {

            // LITE MODE CHECK (The Gatekeeper)
            if (this.isLiteMode) {
                this.hideLoader();
                this.Lite.init();
                return;
            }

            // 1. SYSTEM BOOT
            await this.DB.init();
            this.PTR.init();
            this.Notifications.init();

            // 1.5 INFINITE SCROLL ENABLER
            // IMPORTANT: Scroll happens on #app-container, NOT window
            const scrollContainer = document.getElementById('app-container');
            scrollContainer.addEventListener('scroll', () => {
                // Throttle: Don't load if already loading or maxed out
                if (App.State.isLoadingMore || App.State.feedPointer >= App.State.totalAvailable) {
                    // Still restore cards if scrolling up
                    App.UI.restoreRecycledCards();
                    return;
                }

                // Restore cards on scroll
                App.UI.restoreRecycledCards();

                const { scrollTop, scrollHeight, clientHeight } = scrollContainer;

                // Trigger when user is 600px from bottom (approx 1-2 cards)
                if (scrollTop + clientHeight >= scrollHeight - 600) {
                    App.State.isLoadingMore = true;

                    // Increment Pointer
                    App.State.feedPointer += App.State.batchSize;
                    if (App.State.feedPointer > App.State.totalAvailable) {
                        App.State.feedPointer = App.State.totalAvailable;
                    }

                    console.log(`🚀 Loading Batch... [${App.State.feedPointer}/${App.State.totalAvailable}]`);
                    App.UI.renderFeed(true); // TRUE = Append Mode

                    //Virtual Scroll - Recycle old cards to prevent memory leak
                    App.UI.recycleOldCards();
                }
            }, { passive: true });

            // 2. RESTORE PREFERENCES
            let savedTheme = await this.DB.get('settings', 'themeName') || 'dark';
            await App.Actions.setTheme(savedTheme);
            let savedLayout = await this.DB.get('settings', 'desktopLayout') || 'paper';
            App.State.desktopLayout = savedLayout;
            const feedList = document.getElementById('feed-list');
            if (savedLayout === 'paper') feedList.classList.add('layout-paper');
            if (savedLayout === 'web') feedList.classList.add('layout-web');

            const layoutSelect = document.getElementById('layout-select');
            if (layoutSelect) layoutSelect.value = savedLayout;

            // 3. RESTORE DATA CONNECTIONS
            const url = await this.DB.get('settings', 'contentUrl');
            if (url) App.State.contentUrl = url;

            const storedBookmarks = await this.DB.get('bookmarks', 'ids');
            if (storedBookmarks) App.State.bookmarks = new Set(storedBookmarks);

            // 2.5 RESTORE FLASHCARD SETTINGS
            const savedFreq = await this.DB.get('settings', 'flashcardFreq');
            if (savedFreq) {
                App.State.flashcardFreq = parseInt(savedFreq);
                const freqSelect = document.getElementById('flashcard-freq-select');
                if (freqSelect) freqSelect.value = savedFreq;
            } else {
                // Default to State value (5 min) if no save found
                const freqSelect = document.getElementById('flashcard-freq-select');
                if (freqSelect) freqSelect.value = App.State.flashcardFreq;
            }

            const savedToggle = await this.DB.get('settings', 'flashcardEnabled');
            if (savedToggle !== null && savedToggle !== undefined) {
                App.State.flashcardEnabled = savedToggle;
                const toggle = document.getElementById('flashcard-toggle');
                if (toggle) toggle.checked = savedToggle;
            }
            // Retrigger timers with loaded settings
            App.Notifications.restartTimers();

            // 3.5 LOAD CURATED NOTES (User's own notes - protected from overwrites)
            const storedCurated = await this.DB.getCuratedNotes();
            if (storedCurated && storedCurated.length > 0) {
                App.State.curatedNotes = storedCurated;
                console.log(`📝 Loaded ${storedCurated.length} curated notes`);
            }

            // 3.6 HYDRATE SRS DATA (Fix: Load card statuses so they persist after refresh)
            const srsRecords = await this.DB.getAll('srs_data');
            if (srsRecords && srsRecords.length > 0) {
                srsRecords.forEach(rec => {
                    App.State.srsData[rec.id] = rec;
                });
                console.log(`🧠 Hydrated ${srsRecords.length} SRS records`);
            }

            // 4. LOAD LOCAL CONTENT (mergeStrategy will include curated notes)
            let localFeed = await App.Data.loadLocal();
            App.State.feed = localFeed;
            App.UI.populateExportSelect();

            // 5. DEEP LINK INTELLIGENCE
            const isDeepLink = App.Actions.checkDeepLinkMode();

            if (isDeepLink) {
                const targetId = App.State.activeDeepLink;

                // --- SMART MATCHING LOGIC ---
                const findMatch = (idFromUrl) => {
                    const targetSlug = idFromUrl.replace(/^art_\d+_/, '');
                    return App.State.feed.find(item => {
                        // A. Exact Match
                        if (item.id === idFromUrl) return true;
                        // B. Slug Match 
                        const itemSlug = item.id.replace(/^art_\d+_/, '');
                        if (itemSlug === targetSlug) return true;
                        // C. Safety Match
                        if (targetSlug.length > 8 && itemSlug.length > 8) {
                            return targetSlug.includes(itemSlug) || itemSlug.includes(targetSlug);
                        }
                        return false;
                    });
                };

                // Attempt 1: Check Local Cache
                let foundItem = findMatch(targetId);

                if (foundItem) {
                    console.log(`✅ Deep Link Matched Locally: ${foundItem.id}`);
                    App.State.activeDeepLink = foundItem.id;
                    App.UI.renderFeed();
                    this.hideLoader();
                } else {
                    // Attempt 2: Network Sync
                    console.log("⚠️ Deep Link not in cache. Syncing...");
                    const loaderText = document.querySelector('#startup-loader div:nth-child(3)');
                    if (loaderText) loaderText.innerText = "Searching Archives...";

                    const freshData = await App.Data.syncNetwork();

                    if (freshData) {
                        // FIX: Use mergeStrategy to prevent Race Condition
                        App.State.feed = App.Data.mergeStrategy(freshData);
                        foundItem = findMatch(targetId); // Retry match

                        if (foundItem) {
                            console.log(`✅ Deep Link Found after Sync: ${foundItem.id}`);
                            App.State.activeDeepLink = foundItem.id;
                            App.UI.renderFeed();
                        } else {
                            // --- STATIC GUARD (SEO FIX) ---
                            const container = document.getElementById('feed-list');
                            if (container && container.querySelector('.news-card')) {
                                console.log("Data missing, but Static HTML found. Preserving for SEO.");
                                this.hideLoader();
                                return;
                            }

                            App.UI.toast("Note not found.");
                            App.Actions.goHome();
                        }
                    } else {
                        // --- STATIC GUARD (NETWORK FAIL FIX) ---
                        const container = document.getElementById('feed-list');
                        if (container && container.querySelector('.news-card')) {
                            console.log("Network failed, preserving Static HTML for Bot/Offline.");
                            this.hideLoader();
                            return;
                        }

                        App.UI.toast("Note not available offline.");
                        App.Actions.goHome();
                    }
                    this.hideLoader();
                }
            } else {
                // 6. STANDARD LAUNCH (No Deep Link)
                App.UI.renderFeed();
                this.hideLoader();

                // Background Sync - Store data instead of auto-refreshing
                setTimeout(async () => {
                    const fresh = await App.Data.syncNetwork();
                    if (fresh) {
                        App.State.pendingFeedUpdate = fresh;
                        App.UI.showNewContentToast();
                    }
                }, 1000);
            }

            // --- SECRET FEATURE TRIGGER (SFI Double Click) ---
            const sfiBtn = document.getElementById('flashcard-btn');
            if (sfiBtn) {
                sfiBtn.addEventListener('dblclick', (e) => {
                    e.preventDefault();
                    if (App.Annotate.isActive) {
                        App.Annotate.deactivate();
                    } else {
                        if (App.Notifications) App.Notifications.close();
                        App.Annotate.activate();
                    }
                });
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
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 500);
        }
    }
};

// --- SETTINGS ACTIONS ---
App.Actions.setFlashcardFrequency = async function (val) {
    const mins = parseInt(val);
    App.State.flashcardFreq = mins;
    await App.DB.put('settings', 'flashcardFreq', mins);
    App.Notifications.restartTimers();
    App.UI.toast(`Popup frequency: ${mins} mins`);
};

App.Actions.toggleFlashcards = async function (isEnabled) {
    App.State.flashcardEnabled = isEnabled;
    await App.DB.put('settings', 'flashcardEnabled', isEnabled);
    App.Notifications.restartTimers();
    const msg = isEnabled ? "Popups Enabled ✅" : "Popups Paused ⏸️";
    App.UI.toast(msg);
};

// --- CURATED NOTES HANDLER ---
App.Actions.saveSharedNote = async function () {
    const title = document.getElementById('input-card-title').value.trim();
    const body = document.getElementById('input-card-body').value.trim();

    if (!title || !body) return App.UI.toast("Please add text first");

    const now = Date.now();
    const dateStr = new Date(now).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' });
    const isEditing = App.State.editingNoteId !== null;

    if (isEditing) {
        const existingIdx = App.State.curatedNotes.findIndex(n => n.id === App.State.editingNoteId);
        if (existingIdx !== -1) {
            const updatedNote = {
                ...App.State.curatedNotes[existingIdx],
                title: title,
                summary: body,
                updatedAt: now
            };
            App.State.curatedNotes[existingIdx] = updatedNote;
            await App.DB.saveCuratedNote(updatedNote);
            App.UI.toast("Note Updated! ✏️");
        }
        App.State.editingNoteId = null;
    } else {
        // CREATE new note
        const newCard = {
            id: 'curated_' + now,
            category: 'Curated',
            title: title,
            summary: body,
            date: dateStr,
            timestamp: now,
            createdAt: now,
            image: '',
            tags: ['Curated'],
            isCurated: true
        };

        App.State.curatedNotes.unshift(newCard);
        await App.DB.saveCuratedNote(newCard);
        App.UI.toast("Note Saved! ✅");
    }

    App.State.feed = App.Data.mergeStrategy(await App.DB.getAll('feed_cache'));
    App.UI.closeModals();
    App.UI.renderFeed();

    document.getElementById('input-card-title').value = '';
    document.getElementById('input-card-body').value = '';
    window.history.replaceState({}, document.title, window.location.pathname);
};

// Edit a curated note - loads it into the modal
App.Actions.editCuratedNote = function (id) {
    const note = App.State.curatedNotes.find(n => n.id === id);
    if (!note) return App.UI.toast("Note not found");

    App.State.editingNoteId = id;

    document.getElementById('input-card-title').value = note.title;
    document.getElementById('input-card-body').value = note.summary;

    const modalTitle = document.querySelector('#modal-create-card h2');
    if (modalTitle) modalTitle.innerHTML = 'Edit Note ✏️';

    App.UI.openModal('modal-create-card');
};

App.Actions.deleteCuratedNote = async function (id) {
    const noteIdx = App.State.curatedNotes.findIndex(n => n.id === id);
    if (noteIdx === -1) return;

    const deletedNote = App.State.curatedNotes[noteIdx];

    App.State.curatedNotes.splice(noteIdx, 1);
    await App.DB.deleteCuratedNote(id);

    App.State.feed = App.Data.mergeStrategy(await App.DB.getAll('feed_cache'));
    App.UI.renderFeed();

    App.UI.toast(`"${deletedNote.title.substring(0, 20)}..." deleted`);

    App.State._lastDeletedNote = deletedNote;

    setTimeout(() => {
        if (App.State._lastDeletedNote && App.State._lastDeletedNote.id === id) {
            App.State._lastDeletedNote = null;
        }
    }, 5000);
};

// --- TEXT SELECTION TOOLBAR HANDLERS ---
App.Actions.wrapSelectionCloze = function () {
    const textarea = document.getElementById('input-card-body');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);

    if (!selectedText || selectedText.trim() === '') {
        App.UI.toast("Select some text first");
        return;
    }

    const wrapped = `{{c1::${selectedText}}}`;
    textarea.value = textarea.value.substring(0, start) + wrapped + textarea.value.substring(end);

    textarea.focus();
    textarea.setSelectionRange(start + wrapped.length, start + wrapped.length);

    document.getElementById('selection-toolbar').classList.remove('visible');
    App.UI.toast("Flashcard cloze added ✨");
};

App.Actions.wrapSelectionBold = function () {
    const textarea = document.getElementById('input-card-body');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);

    if (!selectedText || selectedText.trim() === '') {
        App.UI.toast("Select some text first");
        return;
    }

    const wrapped = `<b>${selectedText}</b>`;
    textarea.value = textarea.value.substring(0, start) + wrapped + textarea.value.substring(end);

    textarea.focus();
    textarea.setSelectionRange(start + wrapped.length, start + wrapped.length);

    document.getElementById('selection-toolbar').classList.remove('visible');
    App.UI.toast("Bold highlight added ✨");
};

// Initialize selection toolbar event listeners
App.UI.initSelectionToolbar = function () {
    const textarea = document.getElementById('input-card-body');
    const toolbar = document.getElementById('selection-toolbar');

    if (!textarea || !toolbar) return;

    const handleSelection = (e) => {
        const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);

        if (selectedText && selectedText.trim().length > 0) {
            toolbar.classList.add('visible');
        } else {
            toolbar.classList.remove('visible');
        }
    };

    textarea.addEventListener('mouseup', handleSelection);
    textarea.addEventListener('touchend', (e) => {
        setTimeout(handleSelection, 100); // Delay for touch devices
    });
    textarea.addEventListener('keyup', (e) => {
        if (e.shiftKey) handleSelection();
    });

    // Hide toolbar when clicking outside
    document.addEventListener('mousedown', (e) => {
        if (!toolbar.contains(e.target) && e.target !== textarea) {
            toolbar.classList.remove('visible');
        }
    });
};

// 2. The function to check URL parameters on startup
function checkShareTarget() {
    const params = new URLSearchParams(window.location.search);
    const sharedTitle = params.get('share_title');
    const sharedText = params.get('share_text');
    const sharedUrl = params.get('share_url');

    if (sharedTitle || sharedText || sharedUrl) {
        let finalBody = sharedText || '';
        if (sharedUrl) finalBody += `\n\nSource: ${sharedUrl}`;

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
document.addEventListener('DOMContentLoaded', () => {
    App.init();
    checkShareTarget();

    // --- KEYBOARD SHORTCUTS FOR DESKTOP ---
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            App.UI.openModal('modal-categories');
        }

        if (e.key === 'Enter' && document.activeElement?.id === 'note-save-btn') {
            e.preventDefault();
            App.Actions.saveSharedNote();
        }

        if (e.key === 'Escape') {
            App.UI.closeModals();
        }
    });
});


// --- ANNOTATION MODULE (Laser Tools) ---
App.Annotate = {
    pCanvas: null,      // Preview markings (global fixed)
    pCtx: null,
    toolbar: null,
    isActive: false,
    mode: 'rect',     // ['select', 'pen', 'rect', 'eraser']
    isDrawing: false,
    startX: 0,
    startY: 0,
    currentPath: [],
    colorIndex: 0,
    palettes: [
        // Ultra-distinct 8 color gradients with theme sensitivity
        { name: 'Magenta Burst', colors: { dark: ['#ff00ff', '#ff1493'], light: ['#c71585', '#ff1493'], sepia: ['#db7093', '#ff1493'] } },
        { name: 'Cyber Blue', colors: { dark: ['#00d4ff', '#0066ff'], light: ['#0080ff', '#0040ff'], sepia: ['#4682b4', '#1e90ff'] } },
        { name: 'Lime Electric', colors: { dark: ['#00ff00', '#7fff00'], light: ['#32cd32', '#228b22'], sepia: ['#9acd32', '#6b8e23'] } },
        { name: 'Tangerine', colors: { dark: ['#ff8c00', '#ff4500'], light: ['#ff6347', '#dc143c'], sepia: ['#ff8c00', '#d2691e'] } },
        { name: 'Purple Haze', colors: { dark: ['#9d00ff', '#6a0dad'], light: ['#8b00ff', '#4b0082'], sepia: ['#9370db', '#663399'] } },
        { name: 'Golden Sun', colors: { dark: ['#ffd700', '#ffb700'], light: ['#daa520', '#b8860b'], sepia: ['#daa520', '#cd853f'] } },
        { name: 'Aqua Dream', colors: { dark: ['#00ffff', '#00ced1'], light: ['#00ced1', '#008b8b'], sepia: ['#48d1cc', '#5f9ea0'] } },
        { name: 'Ruby Red', colors: { dark: ['#ff0000', '#ff1a1a'], light: ['#dc143c', '#8b0000'], sepia: ['#cd5c5c', '#a52a2a'] } }
    ],
    activeCard: null,
    activeScrollContent: null,

    init() {
        if (this.pCanvas) return;

        this.pCanvas = document.createElement('canvas');
        this.pCanvas.id = 'annotation-canvas-overlay';
        // FIX: Removed 100vw/100vh to prevent mobile address bar resize issues
        this.pCanvas.style.cssText = "position:fixed; top:0; left:0; z-index:99999; pointer-events:none; cursor:default; background:transparent;";
        this.pCtx = this.pCanvas.getContext('2d');

        this.toolbar = document.createElement('div');
        this.toolbar.className = 'laser-toolbar';
        this.updateToolbarHTML();

        this.bindEvents();
        window.addEventListener('resize', () => this.resize());
    },

    updateToolbarHTML() {
        const p = this.palettes[this.colorIndex];
        this.toolbar.innerHTML = `
            <button class="laser-btn ${this.mode === 'select' ? 'active' : ''}" onclick="App.Annotate.setTool('select')" title="Select & Scroll">
                <svg viewBox="0 0 24 24"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>
            </button>
            <button class="laser-btn ${this.mode === 'pen' ? 'active' : ''}" onclick="App.Annotate.setTool('pen')" title="Pen Tool">
                <svg viewBox="0 0 24 24"><path d="M12 19l7-7 3 3-7 7-3-3z M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>
            </button>
            <button class="laser-btn ${this.mode === 'rect' ? 'active' : ''}" onclick="App.Annotate.setTool('rect')" title="Rectangle Tool">
                <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
            </button>
            <button class="laser-btn laser-btn-eraser ${this.mode === 'eraser' ? 'active' : ''}" onclick="App.Annotate.setTool('eraser')" title="Eraser Tool">
                <svg viewBox="0 0 24 24"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.9-9.9c1-1 2.5-1 3.4 0l4.3 4.3c1 1 1 2.5 0 3.4L10.5 21z"/><path d="m15 5 4.3 4.3"/></svg>
            </button>
            <button class="laser-btn laser-btn-color" onclick="App.Annotate.cycleColor()" title="Color: ${p.name}" style="background: linear-gradient(135deg, ${this.getCurrentColors()[0]}, ${this.getCurrentColors()[1]}); border: 1px solid rgba(255,255,255,0.3);">
            </button>
            <button class="laser-btn laser-btn-clear" onclick="App.Annotate.clear()" title="Clear All Decorations">
                <svg viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
            <button class="laser-btn laser-btn-close" onclick="App.Annotate.deactivate()" title="Close Laser">
                <svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
        `;
    },

    bindEvents() {
        const pc = this.pCanvas;
        const start = (e) => this.startDrawing(e.touches ? e.touches[0] : e);
        const move = (e) => this.draw(e.touches ? e.touches[0] : e);
        const end = (e) => this.stopDrawing(e.touches ? e.changedTouches[0] : e);

        pc.addEventListener('mousedown', start, { passive: false });
        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', end);

        pc.addEventListener('touchstart', (e) => { if (this.mode !== 'select') { e.preventDefault(); start(e.touches[0]); } }, { passive: false });
        pc.addEventListener('touchmove', (e) => { if (this.mode !== 'select') { e.preventDefault(); move(e.touches[0]); } }, { passive: false });
        pc.addEventListener('touchend', (e) => { if (this.mode !== 'select') end(e.changedTouches[0]); });
    },

    resize() {
        if (!this.pCanvas) return;
        const w = window.innerWidth;
        const h = window.innerHeight;

        // Match internal resolution
        this.pCanvas.width = w;
        this.pCanvas.height = h;

        // Force CSS to match resolution EXACTLY
        this.pCanvas.style.width = w + 'px';
        this.pCanvas.style.height = h + 'px';
    },

    activate() {
        this.init();
        this.resize();
        document.body.appendChild(this.pCanvas);
        document.body.appendChild(this.toolbar);
        this.isActive = true;
        this.setTool('rect'); // Default to Rectangle as requested
        if (App.Notifications) App.Notifications.close();
        App.UI.haptic(20);
    },

    clear() {
        // Clear global preview
        if (this.pCtx) this.pCtx.clearRect(0, 0, this.pCanvas.width, this.pCanvas.height);
        // Remove all local persistent canvases
        document.querySelectorAll('.annotation-layer-local').forEach(c => c.remove());
        App.UI.toast("All Annotations Wiped 🧹");
        App.UI.haptic(10);
    },

    deactivate() {
        if (this.pCanvas?.parentNode) document.body.removeChild(this.pCanvas);
        if (this.toolbar?.parentNode) document.body.removeChild(this.toolbar);
        this.isActive = false;
        App.UI.toggleGlobalHide(false);
    },

    setTool(mode) {
        this.mode = mode;
        this.updateToolbarHTML();

        if (mode === 'select') {
            this.pCanvas.style.pointerEvents = 'none';
        } else {
            this.pCanvas.style.pointerEvents = 'auto';
        }
        App.UI.haptic(5);
    },

    toggleDrawingTool() {
        if (this.mode === 'pen') this.setTool('rect');
        else this.setTool('pen');
    },

    cycleColor() {
        this.colorIndex = (this.colorIndex + 1) % this.palettes.length;
        const colors = this.getCurrentColors();
        // Use the first color for the UI accent var
        document.documentElement.style.setProperty('--laser-color', colors[0]);
        App.UI.haptic(10);
        this.updateToolbarHTML();
    },

    getCurrentColors() {
        const p = this.palettes[this.colorIndex];
        const theme = document.documentElement.getAttribute('data-theme') || 'dark';
        return p.colors[theme] || p.colors.dark;
    },

    getStyles() {
        const colors = this.getCurrentColors();
        return {
            colors: colors,
            thick: this.mode === 'eraser' ? 50 : 2.8  // Slightly reduced
        };
    },

    // Helper: Draw perfectly rounded rectangle manually
    drawRoundedRect(ctx, x, y, w, h, radius) {
        // Ensure positive width/height
        if (w < 0) { x += w; w = -w; }
        if (h < 0) { y += h; h = -h; }

        // Clamp radius
        const r = Math.min(radius, Math.abs(w) / 2, Math.abs(h) / 2);

        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.arcTo(x + w, y, x + w, y + r, r);
        ctx.lineTo(x + w, y + h - r);
        ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
        ctx.lineTo(x + r, y + h);
        ctx.arcTo(x, y + h, x, y + h - r, r);
        ctx.lineTo(x, y + r);
        ctx.arcTo(x, y, x + r, y, r);
        ctx.closePath();
    },

    renderShape(ctx, type, x, y, w, h, path, fillOnly = false) {
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        if (type === 'pen') {
            if (!path || path.length < 2) return;
            ctx.beginPath();
            ctx.moveTo(path[0].x, path[0].y);
            for (let i = 1; i < path.length; i++) ctx.lineTo(path[i].x, path[i].y);
        } else {
            this.drawRoundedRect(ctx, x, y, w, h, 18);
        }

        if (fillOnly) {
            ctx.fill();
        } else {
            ctx.stroke();
        }
    },

    // --- PRESTIGE GRADIENT NEON ENGINE (Premium Edition) ---
    drawLaser(context, type, x, y, w, h, isLocal = false) {
        if (this.mode === 'eraser') {
            context.save();
            context.globalCompositeOperation = 'destination-out';
            const renderingPath = isLocal ? this._getLocalPath() : this.currentPath;
            context.lineWidth = 60;
            context.lineJoin = 'round';
            context.lineCap = 'round';
            this.renderShape(context, 'pen', 0, 0, 0, 0, renderingPath);
            context.restore();
            return;
        }

        const { colors, thick } = this.getStyles();
        const renderingPath = isLocal ? this._getLocalPath() : this.currentPath;

        // 1. Create Screen-Space Gradient
        const grad = context.createLinearGradient(0, 0, this.pCanvas.width, this.pCanvas.height);
        grad.addColorStop(0, colors[0]);
        grad.addColorStop(1, colors[1]);

        context.save();

        // HIGHLIGHTING LAYER: Fill for rectangles (0.15 opacity)
        if (type === 'rect') {
            context.fillStyle = colors[0]; // Use first color for fill
            context.globalAlpha = 0.15;
            this.renderShape(context, type, x, y, w, h, renderingPath, true);
        }

        // PREMIUM LAYER 1: Subtle outer stroke for depth
        context.shadowBlur = 0;
        context.strokeStyle = 'rgba(0, 0, 0, 0.15)';
        context.lineWidth = thick + 1.5;
        context.globalAlpha = 0.5;
        this.renderShape(context, type, x, y, w, h, renderingPath);

        // LAYER 2: The "Glow" (Atmosphere)
        context.shadowBlur = 18;
        context.shadowColor = colors[0]; // Use start color for glow
        context.strokeStyle = grad;
        context.lineWidth = thick;
        context.globalAlpha = 0.75;
        context.globalCompositeOperation = 'source-over';
        this.renderShape(context, type, x, y, w, h, renderingPath);

        // LAYER 3: The "Core" (Definition)
        context.shadowBlur = 0;
        context.lineWidth = thick;
        context.strokeStyle = grad;
        context.globalAlpha = 1.0;
        this.renderShape(context, type, x, y, w, h, renderingPath);

        // LAYER 4: "Glass Tube" Highlight (Premium shine)
        context.lineWidth = thick * 0.35;
        context.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        context.globalAlpha = 0.9;
        this.renderShape(context, type, x, y, w, h, renderingPath);

        context.restore();
    },

    _getLocalPath() {
        if (!this.activeScrollContent) return this.currentPath;
        const rect = this.activeScrollContent.getBoundingClientRect();
        const scrollT = this.activeScrollContent.scrollTop;
        const scrollL = this.activeScrollContent.scrollLeft;

        return this.currentPath.map(p => ({
            x: p.x - rect.left + scrollL,
            y: p.y - rect.top + scrollT
        }));
    },

    renderShape(ctx, type, x, y, w, h, path) {
        ctx.beginPath();
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        if (type === 'pen') {
            if (!path || path.length < 2) return;
            ctx.moveTo(path[0].x, path[0].y);
            for (let i = 1; i < path.length; i++) ctx.lineTo(path[i].x, path[i].y);
        } else {
            ctx.strokeRect(x, y, w, h);
        }
        ctx.stroke();
    },

    getCardCanvas(scrollContent) {
        let canvas = scrollContent.querySelector('.annotation-layer-local');
        const sW = scrollContent.scrollWidth;
        const sH = scrollContent.scrollHeight;

        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.className = 'annotation-layer-local';
            scrollContent.appendChild(canvas);
        }

        // Always sync resolution and style size to scrollable area
        if (canvas.width !== sW || canvas.height !== sH) {
            canvas.width = sW;
            canvas.height = sH;
            canvas.style.width = sW + 'px';
            canvas.style.height = sH + 'px';
        }
        return canvas;
    },

    startDrawing(e) {
        if (this.mode === 'select') return;

        // --- FIX: Pointer-Event Bypass for Detection ---
        this.pCanvas.style.pointerEvents = 'none';
        const el = document.elementFromPoint(e.clientX, e.clientY);
        this.pCanvas.style.pointerEvents = 'auto';

        const card = el ? el.closest('.news-card') : null;
        if (!card) return;

        this.activeCard = card;
        this.activeScrollContent = card.querySelector('.scroll-content');
        if (!this.activeScrollContent) return;

        this.isDrawing = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.currentPath = [{ x: this.startX, y: this.startY }];
    },

    draw(e) {
        if (!this.isDrawing) return;
        this.currentPath.push({ x: e.clientX, y: e.clientY });
        this.pCtx.clearRect(0, 0, this.pCanvas.width, this.pCanvas.height);

        if (this.mode === 'pen' || this.mode === 'eraser') {
            this.drawLaser(this.pCtx, 'pen', 0, 0, 0, 0);
        } else if (this.mode === 'rect') {
            this.drawLaser(this.pCtx, 'rect', this.startX, this.startY, e.clientX - this.startX, e.clientY - this.startY);
        }
    },

    stopDrawing(e) {
        if (!this.isDrawing) return;
        const finalX = (e && e.clientX) || this.startX;
        const finalY = (e && e.clientY) || this.startY;

        if (this.activeScrollContent) {
            const canvas = this.getCardCanvas(this.activeScrollContent);
            const ctx = canvas.getContext('2d');
            const rect = this.activeScrollContent.getBoundingClientRect();
            const sT = this.activeScrollContent.scrollTop;
            const sL = this.activeScrollContent.scrollLeft;

            if (this.mode === 'pen' || this.mode === 'eraser') {
                this.currentPath.push({ x: finalX, y: finalY });
                this.drawLaser(ctx, 'pen', 0, 0, 0, 0, true);
            } else if (this.mode === 'rect') {
                const localX = this.startX - rect.left + sL;
                const localY = this.startY - rect.top + sT;
                this.drawLaser(ctx, 'rect', localX, localY, finalX - this.startX, finalY - this.startY, true);
            }
        }

        this.pCtx.clearRect(0, 0, this.pCanvas.width, this.pCanvas.height);
        this.isDrawing = false;
        this.currentPath = [];
        this.activeCard = null;
        this.activeScrollContent = null;
    }
};
