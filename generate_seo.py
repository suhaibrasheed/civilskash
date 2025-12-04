import os
import requests
import re
import shutil
import hashlib

# --- CONFIGURATION ---
DATA_URL = "https://script.google.com/macros/s/AKfycbxK7nCpv9ERmwbxQeoMKqyADLxgOLimbNMQG5hddgOO-yHx_o5Izt3ZUDDq31ahWAJp/exec"
BASE_URL = "https://civilskash.in"
OUTPUT_DIR = "notes"

# 1. HARDCODED DATA (Extracted from app.js)
HARDCODED_DATA = [
    {
        "id": "static_001", 
        "title": "Daily Current Affairs Quiz UPSC JKPSC", 
        "summary": "Boost your preparation with high-yield MCQs for UPSC and JKPSC Prelims. Do you know 'Panchamrit' strategy from COP26, which relates to India's {{c1::Climate Action}} goals. What about Article {{c2::35A}} which was abolished recently with Article 370. Do you know difference between ICJ and ICC. What about recent Environmental regulation considered Black law?. Regular practice of these static and dynamic topics on CivilsKash will boost your ability to crack competitive exams.", 
        "category": "Current Affairs", 
        "date": "1 Nov 25", 
        "image": "https://tse3.mm.bing.net/th/id/OIP.WvbBV909fzI7zuLUadLrgQHaE6?rs=1&pid=ImgDetMain&o=7&rm=3"
    },
    {
        "id": "static_002", 
        "title": "Schedules of Indian Constitution Mnemonic", 
        "summary": "Memorizing the 12 Schedules of the Indian Constitution is crucial for matching questions in Prelims. Use the famous trick: '{{c1::TEARS OF OLD PM}}'. T stands for Territories (1st Schedule), E for Emoluments (2nd), A for Affirmations (3rd), and R for Rajya Sabha seats (4th). The 10th Schedule, added by the {{c2::52nd}} Amendment Act of 1985, deals with the Anti-Defection Law, often referred to as the 'Dal Badal' law.", 
        "category": "Polity", 
        "date": "1 Nov 25", 
        "image": "https://media.istockphoto.com/id/1007178836/photo/indian-supreme-court.jpg?s=612x612&w=0&k=20&c=sVUxnP1WCkC62og2fjbzgdUMleD3WoeOzbBgNiJ9y_Y="
    },
    {
        "id": "static_003", 
        "title": "Governor General vs Viceroy Modern History", 
        "summary": "Aspirants often confuse these colonial titles. The Regulating Act of {{c1::1773}} created the post of Governor General of Bengal (Warren Hastings). Later, the Charter Act of {{c2::1833}} elevated this to Governor General of India (William Bentinck). Finally, after the Revolt of 1857, the Government of India Act 1858 transferred power to the British Crown, creating the title of {{c1::Viceroy}}, with Lord Canning becoming the first Viceroy of India.", 
        "category": "History", 
        "date": "1 Nov 25", 
        "image": "https://i0.wp.com/glimpsesofhistory.com/wp-content/uploads/2020/08/Captain_William_Bentinck_1764-1813_by_George_Romney.jpg?fit=1067%2C1280&ssl=1"
    },
    {
        "id": "static_004", 
        "title": "List of New Ramsar Sites in India 2026", 
        "summary": "India has significantly expanded its conservation network, with the total number of Ramsar sites crossing {{c1::94}}. The {{c2::Sundarbans}} in West Bengal remains the largest site by area. Important wetland sites in Jammu & Kashmir like Wular Lake, Hokera, and Surinsar-Mansar are critical for migratory birds. Under the Montreux Record, only two Indian sites are currently listed: {{c1::Keoladeo}} National Park (Rajasthan) and {{c1::Loktak Lake }}(Manipur).", 
        "category": "Environment", 
        "date": "1 Nov 25", 
        "image": "https://cdn.downtoearth.org.in/library/large/2022-11-08/0.94591600_1667918565_33.jpg"
    },
    {
        "id": "static_005", 
        "title": "Key Provisions J&K Reorganization Act 2019", 
        "summary": "This historic Act bifurcated the state of Jammu & Kashmir into two Union Territories: J&K (with legislature) and Ladakh (without legislature). Section {{c1::57}} of the Act effectively abolishes the Legislative Council. The total number of seats in the J&K Legislative Assembly was increased from 107 to {{c2::114}} after the delimitation commission's report. The High Court remains the common judicial authority for both UTs.", 
        "category": "Polity", 
        "date": "1 Nov 25", 
        "image": ""
    },
    {
        "id": "static_006", 
        "title": "Karewa Formation and Saffron Cultivation", 
        "summary": "Karewas are unique lacustrine (lake-based) deposits found in the Valley of Kashmir, formed during the Pleistocene period. These flat-topped tablelands are world-famous for the cultivation of {{c1::Zafran}} (Saffron), a GI-tagged product. The Pampore region is known as the 'Saffron Town of Kashmir'. Apart from saffron, this distinct soil structure is also highly suitable for growing {{c2::Almonds}} and walnuts.", 
        "category": "Geography", 
        "date": "1 Nov 25", 
        "image": "https://cdn.thewire.in/wp-content/uploads/2022/11/25164308/image-603.png"
    },
    {
        "id": "static_007", 
        "title": "Important Mountain Passes of Jammu Kashmir", 
        "summary": "Map-based questions often ask to arrange passes from North to South. The {{c1::Banihal Pass}} connects Jammu to Srinagar and houses the Jawahar Tunnel. The {{c2::Zoji La}} pass connects Srinagar to Leh and is vital for Ladakh's connectivity. The {{c1::Burzil Pass}} historically connects the Kashmir Valley to the Deosai Plains of Gilgit. The {{c1:: Khardung La }} in Ladakh is one of the highest motorable roads in the world.", 
        "category": "Geography", 
        "date": "1 Nov 25", 
        "image": "https://th.bing.com/th/id/R.8aff93c4229fe168ed0d9e28ea6f9c0d?rik=wgO6yKzD2Dlt4A&riu=http%3a%2f%2fwww.freeworldmaps.net%2fasia%2findia%2fjammuandkashmir%2fjammuandkashmir-map.jpg&ehk=N1%2fj%2bigXP8Pc22xSdqyytcDFWf111pBlHlbsh1ia8Gw%3d&risl=&pid=ImgRaw&r=0"
    },
    {
        "id": "static_008", 
        "title": "Timeline of Dogra Rule in Kashmir", 
        "summary": "The Dogra dynasty was established by {{c1::Gulab Singh}} following the Treaty of Amritsar in 1846, often called the {{c1::'Sale Deed of Kashmir'}} in which whole region of JK was sold by British Raj for just ₨ 75 lakh. Dogra Rule unified whole region of J&K but is known for {{c1::Begari Sytem }} where peasents worked as forced unpaid slaves for Zamindars, they later revolted under Sheikh Abdullah leading to integration of J&K into the Dominion of India in 1947. J&K became one of only 2 states in India which freed tenants from Begari, and granted them land ownership under Sheikh", 
        "category": "History", 
        "date": "1 Nov 25", 
        "image": "https://images.squarespace-cdn.com/content/v1/5ab61c67ec4eb7ab7a2f40f2/1570767012756-3RB9F64GC745URU1GNA5/ke17ZwdGBToddI8pDm48kMEscrJZt_tmaeDMTaC3Grd7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QPOohDIaIeljMHgDF5CVlOqpeNLcJ80NK65_fV7S1USasn69Hr34dwVEWwP0LjT7TmWk4ozqjQRTjqwHqVncSD8iN_TR6rJlKCdD_scFx3Q/71087629_10216837803031064_7165896983389929472_o.jpg"
    },
    {
        "id": "static_009", 
        "title": "Repo Rate vs Reverse Repo Rate Explained", 
        "summary": "Monetary Policy tools are used by the central bank to manage liquidity. Repo Rate is the rate at which the {{c1::RBI}} lends money to commercial banks for short-term needs. An increase in Repo Rate helps control {{c2::Inflation}} by making borrowing expensive. Conversely, Reverse Repo Rate is the rate at which the RBI borrows money from banks to absorb excess liquidity from the market.", 
        "category": "Economy", 
        "date": "1 Nov 25", 
        "image": "https://iol-prod.appspot.com/image/52f0e1045b489d817cb85bef800ea88482c44804=w700"
    },
    {
        "id": "static_010", 
        "title": "Fundamental Rights Articles 12-35", 
        "summary": "Part III of the Constitution is called the Magna Carta of India. It guarantees civil liberties such as the Right to Equality (Articles 14-18). Article {{c1::17}} specifically abolishes Untouchability in all forms. Article {{c2::21}} provides the Right to Life and Personal Liberty, which has the widest interpretation by the Supreme Court. Dr. Ambedkar called Article 32 the 'Heart and Soul' of the Constitution.", 
        "category": "Polity", 
        "date": "1 Nov 25", 
        "image": "https://www.nextias.com/blog/wp-content/uploads/2024/02/indian-constitution-1024x1024.jpg"
    },
    {
        "id": "static_011", 
        "title": "Indus Water Treaty 1960 India Pakistan", 
        "summary": "Brokered by the {{c1::World Bank}}, this treaty divides the Indus river system. India has full control over the three Eastern Rivers: Ravi, Beas, and Sutlej. Pakistan controls the three Western Rivers: Indus, Jhelum, and Chenab. However, India is allowed to use western river waters for non-consumptive uses, including {{c2::Run-of-the-River}} hydroelectric projects like Kishanganga and Ratle.", 
        "category": "World", 
        "date": "1 Nov 25", 
        "image": "https://www.deccanchronicle.com/h-upload/2025/04/24/1911090-induswaterstreaty.jpg"
    },
    {
        "id": "static_012", 
        "title": "Shortest Koppen’s Climatic Classification for Exam", 
        "summary": "Koppen’s Climatic Classification links climate to natural vegetation using temperature and rainfall. It has five major groups {{c1::A – Tropical}}, {{c2::B – Dry}}, {{c3::C – Temperate}}, {{c4::D – Continental}}, {{c5::E – Polar}}. <br> Important subtypes include {{c6::Af (Tropical Rainforest)}}, {{c7::Aw (Tropical Savanna)}}, {{c8::BWh (Hot Desert)}}, {{c9::Cfa (Humid Subtropical)}}, and {{c10::ET (Tundra)}}. <br> India mainly has: {{c11::Am in Western Coast}}, {{c12::Aw in Peninsular India}}, {{c13::Cwa/Cfa in North India}}, and {{c14::BWh/BSh in Rajasthan}}.", 
        "category": "Geography", 
        "date": "1 Nov 25", 
        "image": "https://www.pngitem.com/pimgs/m/505-5057181_india-map-of-kppen-climate-classification-koppen-climate.png"
    }
]

# --- UTILS ---
def clean_slug(text):
    if not text: return "note"
    slug = text.lower()
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    return slug.strip('-')

# --- CLOZE CONVERTER ---
# Turns {{c1::Text}} into <strong>Text</strong>
def convert_cloze_to_bold(text):
    if not text: return ""
    return re.sub(r'\{\{c\d+::(.*?)\}\}', r'<strong>\1</strong>', text)

# --- META CLEANER ---
# Removes HTML and Cloze markers for Google Search Snippets
def strip_tags(text):
    if not text: return ""
    clean = re.sub(r'\{\{c\d+::(.*?)\}\}', r'\1', text) 
    return re.sub('<[^<]+?>', '', clean) 

# --- SAFE SURGICAL CLEANER ---
# Removes bloat without deleting article content
def strip_bloat(html_content):
    clean_html = html_content
    ids_to_kill = [
        "modal-categories", "modal-quiz-menu", "quiz-fullscreen-layer",
        "modal-share-menu", "modal-notekash-tutorial", "modal-settings",
        "modal-force-update", "modal-create-card", "quiz-summary"
    ]
    for div_id in ids_to_kill:
        pattern = rf'<div id="{div_id}".*?(?=<div id=|<script)'
        clean_html = re.sub(pattern, '', clean_html, flags=re.DOTALL)
    return clean_html

# --- STABLE ID GENERATOR ---
def generate_stable_id(item):
    # Generates ID from Title. Links stay same even if row number changes.
    title_slug = clean_slug(item.get('title', ''))
    title_bytes = item.get('title', '').encode('utf-8')
    title_hash = hashlib.md5(title_bytes).hexdigest()[:4] 
    
    if not title_slug: return f"note-{title_hash}"
    return f"{title_slug}-{title_hash}"

# --- MAIN GENERATOR ---
def generate_site():
    print("🚀 Starting Smart SEO Generation...")
    
    # 1. Fetch Google Sheet Data
    try:
        response = requests.get(f"{DATA_URL}?t=seo_gen")
        sheet_data = response.json()
        print(f"✅ Fetched {len(sheet_data)} articles from Google Sheets.")
    except Exception as e:
        print(f"❌ Error fetching Google Sheet data: {e}")
        sheet_data = []

    # 2. Merge Data
    full_data = sheet_data + HARDCODED_DATA
    full_data.reverse() 

    # 3. Load Template
    try:
        with open("index.html", "r", encoding="utf-8") as f:
            template = f.read()
    except FileNotFoundError:
        print("❌ Error: index.html not found!")
        return

    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    sitemap_urls = []
    updated_count = 0
    skipped_count = 0

    print(f"⚡ Processing {len(full_data)} articles...")

    for item in full_data:
        unique_id = generate_stable_id(item)
        folder_path = f"{OUTPUT_DIR}/{unique_id}"
        file_path = f"{folder_path}/index.html"
        page_url = f"{BASE_URL}/notes/{unique_id}/"
        
        # --- PREPARE CONTENT ---
        page_title = f"{item.get('title')} - CivilsKash"
        
        # Summary Processing
        raw_summary = item.get('summary', '') or ""
        display_summary = convert_cloze_to_bold(raw_summary)
        meta_description = strip_tags(raw_summary)[:160].replace('"', "'").replace('\n', ' ')
        
        # Image Handling
        image_url = item.get('image', '').strip()
        img_html = ""
        if image_url:
            img_html = f'<div class="card-img" style="background-image: url(\'{image_url}\')"></div>'

        # Card HTML
        card_html = f"""
        <article class="news-card" style="margin: 0 auto; max-width: 800px;">
            <div class="scroll-content">
                {img_html}
                <div class="card-body">
                    <div class="meta-row">
                        <span class="badge">{item.get('category', 'General')}</span>
                        <span class="date">{item.get('date', '')}</span>
                    </div>
                    <h2>{item.get('title', '')}</h2>
                    <p class="summary-box">{display_summary}</p>
                </div>
            </div>
        </article>
        """

        # Inject into Template
        new_html = template
        new_html = re.sub(r'<title>.*?</title>', f'<title>{page_title}</title>', new_html)
        new_html = re.sub(r'content="Free UPSC.*?"', f'content="{meta_description}"', new_html)
        new_html = new_html.replace('<link rel="canonical" href="https://civilskash.in/" />', f'<link rel="canonical" href="{page_url}" />')
        new_html = new_html.replace('<meta property="og:url" content="https://civilskash.in">', f'<meta property="og:url" content="{page_url}">')
        
        # --- NEW: SOCIAL IMAGE FIX (Updates og:image dynamically) ---
        if image_url:
             # Replaces the default logo with the article's image for social sharing
             new_html = re.sub(r'<meta property="og:image" content=".*?">', f'<meta property="og:image" content="{image_url}">', new_html)

        # Insert Card
        if '<div id="feed-list">' in new_html:
            new_html = new_html.replace('<div id="feed-list"></div>', f'<div id="feed-list">{card_html}</div>')
            
        # Fix Paths & Clean
        new_html = new_html.replace('href="style.css"', 'href="../../style.css"')
        new_html = new_html.replace('src="app.js"', 'src="../../app.js"')
        new_html = new_html.replace('href="manifest.json"', 'href="../../manifest.json"')
        new_html = new_html.replace('href="/favicon', 'href="../../favicon')
        new_html = new_html.replace("App.UI.openModal('modal-settings')", "void(0)")
        new_html = new_html.replace("App.UI.openModal('modal-quiz-menu')", "void(0)")
        new_html = strip_bloat(new_html)

        # --- SMART UPDATE CHECK ---
        should_write = True
        if os.path.exists(file_path):
            with open(file_path, "r", encoding="utf-8") as f:
                existing_content = f.read()
            # If files are identical, skip write
            if existing_content == new_html:
                should_write = False
                skipped_count += 1
        
        if should_write:
            if not os.path.exists(folder_path): os.makedirs(folder_path)
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(new_html)
            updated_count += 1
            print(f"💾 Updated: {unique_id}")

        sitemap_urls.append(page_url)

    # 4. Generate Sitemap
    print("🗺️  Updating sitemap.xml...")
    sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    sitemap += f'  <url><loc>{BASE_URL}/</loc><priority>1.0</priority></url>\n'
    for url in sitemap_urls:
        sitemap += f'  <url><loc>{url}</loc><changefreq>weekly</changefreq></url>\n'
    sitemap += '</urlset>'
    
    with open("sitemap.xml", "w", encoding="utf-8") as f:
        f.write(sitemap)

    print(f"\n✅ Job Done!")
    print(f"   - Files Updated: {updated_count}")
    print(f"   - Files Skipped (Unchanged): {skipped_count}")

if __name__ == "__main__":
    generate_site()
