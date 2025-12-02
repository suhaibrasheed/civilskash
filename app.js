
        /**
         * CivilsKash v0.25 - Ultimate Edition
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
                contentUrl: 'https://script.google.com/macros/s/AKfycbxK7nCpv9ERmwbxQeoMKqyADLxgOLimbNMQG5hddgOO-yHx_o5Izt3ZUDDq31ahWAJp/exec' ,
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
                mergeStrategy(dynamicItems) {
                    const hardcoded = this.getHardcodedData();
                    const feedMap = new Map();
                    
                    // A. Load Hardcoded (Base Layer)
                    hardcoded.forEach(item => feedMap.set(item.id, item));
                    
                    // B. Merge Dynamic (Overlay Layer)
                    if (Array.isArray(dynamicItems)) {
                        dynamicItems.forEach(item => {
                            const existing = feedMap.get(item.id);
                            if (existing && !item.timestamp) {
                                item.timestamp = existing.timestamp;
                            }
                            feedMap.set(item.id, item);
                        });
                    }

                    return Array.from(feedMap.values()).sort((a, b) => {
                        // Fallback: If timestamp missing, rely on ID index
                        const tA = a.timestamp || 0;
                        const tB = b.timestamp || 0;
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
                            image:"https://th.bing.com/th/id/R.8aff93c4229fe168ed0d9e28ea6f9c0d?rik=wgO6yKzD2Dlt4A&riu=http%3a%2f%2fwww.freeworldmaps.net%2fasia%2findia%2fjammuandkashmir%2fjammuandkashmir-map.jpg&ehk=N1%2fj%2bigXP8Pc22xSdqyytcDFWf111pBlHlbsh1ia8Gw%3d&risl=&pid=ImgRaw&r=0",
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
                            summary: "Koppen’s Climatic Classification links climate to natural vegetation using temperature and rainfall. It has five major groups {{c1::A – Tropical}}, {{c2::B – Dry}}, {{c3::C – Temperate}}, {{c4::D – Continental}}, {{c5::E – Polar}}. <br> Important subtypes include {{c6::Af (Tropical Rainforest)}}, {{c7::Aw (Tropical Savanna)}}, {{c8::BWh (Hot Desert)}}, {{c9::Cfa (Humid Subtropical)}}, and {{c10::ET (Tundra)}}. <br> India mainly has: {{c11::Am in Western Coast}}, {{c12::Aw in Peninsular India}}, {{c13::Cwa/Cfa in North India}}, and {{c14::BWh/BSh in Rajasthan}}."}
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
                    if(btn) btn.style.display = 'none';
                    if(spinner) spinner.style.display = 'block';

                    try {
                        const freshData = await this.syncNetwork();
                        if (freshData) {
                            App.State.feed = this.mergeStrategy(freshData);
                            App.UI.renderFeed();
                            App.UI.toast("Feed Updated ⚡️");
                        } else {
                            App.UI.toast("No changes or Offline");
                        }
                    } catch(e) {
                        console.error(e);
                        App.UI.toast("Update Failed");
                    } finally {
                        if(btn) btn.style.display = 'block';
                        if(spinner) spinner.style.display = 'none';
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

                cycleFont() {
                    const s = this.session;
                    s.fontIndex = (s.fontIndex + 1) % s.fontLevels.length;
                    
                    const newSize = s.fontLevels[s.fontIndex];
                    
                    const els = [document.getElementById('fc-front-text'), document.getElementById('fc-back-text')];
                    els.forEach(el => {
                        if(el) {
                            el.style.fontSize = newSize;
                            el.style.transition = "font-size 0.2s ease";
                        }
                    });
                    App.UI.toast(`Text Size: ${newSize}`);
                },

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
                        viewedInSession: new Set(),
                        fontLevels: ['0.9rem', '1rem', '1.2rem', '1.4rem', '1.7rem', '2rem'],
                        fontIndex: 2
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
                        const isVeryNew = (Date.now() - item.timestamp) < 86400000;
                        const badgeClass = isVeryNew ? 'badge badge-new' : 'badge';
                        
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
                                        <span class="${badgeClass}" onclick="event.stopPropagation(); App.Actions.setCategory('${item.category}')">${item.category}</span>
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
                    
                    // 1. Restore Preferences
                    const savedTheme = await this.DB.get('settings', 'themeName') || 'dark';
                    await App.Actions.setTheme(savedTheme); 
                    
                    const savedLayout = await this.DB.get('settings', 'desktopLayout') || 'grid';
                    App.State.desktopLayout = savedLayout;
                    if(savedLayout === 'paper') document.getElementById('feed-list').classList.add('layout-paper');
                    const layoutSelect = document.getElementById('layout-select');
                    if(layoutSelect) layoutSelect.value = savedLayout;

                    const url = await this.DB.get('settings', 'contentUrl');
                    if (url) App.State.contentUrl = url;
                    
                    const storedBookmarks = await this.DB.get('bookmarks', 'ids');
                    if (storedBookmarks) App.State.bookmarks = new Set(storedBookmarks);

                    // 2. Initial Render (Cache Strategy)
                    App.State.feed = await App.Data.loadLocal();
                    App.UI.populateExportSelect(); 

                    const isDeepLink = App.Actions.checkDeepLinkMode();
                    
                    if (!isDeepLink) {
                        App.UI.renderFeed();
                        this.hideLoader();
                    } else {
                        // Optimistic Deep Link Check (Local)
                        const targetId = App.State.activeDeepLink;
                        const getSlug = (idStr) => (idStr || '').split('_').slice(2).join('_') || idStr;
                        const targetSlug = getSlug(targetId);

                        const foundLocal = App.State.feed.find(item => item.id === targetId || getSlug(item.id) === targetSlug);
                        if (foundLocal) {
                            App.State.activeDeepLink = foundLocal.id;
                            App.UI.renderFeed();
                            this.hideLoader();
                        } else {
                            const loaderText = document.querySelector('#startup-loader div:nth-child(3)');
                            if(loaderText) loaderText.innerText = "Searching Archives...";
                        }
                    }

                    // 3. Network Sync & Reconcile (The Fix)
                    setTimeout(async () => {
                        const freshData = await App.Data.syncNetwork();
                        if (freshData) {
                            const updatedFeed = App.Data.mergeStrategy(freshData);
                            
                            // Check for changes to avoid unnecessary re-render
                            if (JSON.stringify(updatedFeed.length) !== JSON.stringify(App.State.feed.length) || isDeepLink) {
                                App.State.feed = updatedFeed;
                                
                                if (isDeepLink) {
                                    // Deep Link Re-Check after Sync
                                    const targetId = App.State.activeDeepLink;
                                    const getSlug = (idStr) => (idStr || '').split('_').slice(2).join('_') || idStr;
                                    const targetSlug = getSlug(targetId);
                                    
                                    const foundLive = App.State.feed.find(item => item.id === targetId || getSlug(item.id) === targetSlug);
                                    
                                    if (foundLive) {
                                        App.State.activeDeepLink = foundLive.id;
                                        App.UI.renderFeed();
                                    } else {
                                        App.UI.toast("Note not found or deleted.");
                                        App.Actions.goHome();
                                    }
                                    this.hideLoader();
                                } else {
                                    App.UI.renderFeed();
                                    App.UI.toast("New Articles Added ⚡");
                                }
                            }
                        } else if (isDeepLink && document.getElementById('startup-loader').style.display !== 'none') {
                            // Offline and Deep Link not found locally
                            App.UI.toast("Offline: Note unavailable.");
                            App.Actions.goHome();
                            this.hideLoader();
                        }
                    }, 500);

                } catch (err) {
                    console.error("Init Error", err);
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
                category: 'Curated',
                title: title,
                summary: body,
                date: 'Just Now',
                image: '', 
                tags: ['Curated']
            };
            App.State.feed.unshift(newCard); 
            if(App.DB.isWorking) await App.DB.put('feed_cache', null, newCard); 
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

        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then((reg) => console.log('Service Worker registered!', reg))
                .catch((err) => console.log('Service Worker failed:', err));
            });
        }
  
