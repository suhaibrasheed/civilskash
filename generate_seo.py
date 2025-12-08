import os
import requests
import re
import hashlib
import json
import random
from datetime import datetime

# --- CONFIGURATION ---
DATA_URL = "https://script.google.com/macros/s/AKfycbxK7nCpv9ERmwbxQeoMKqyADLxgOLimbNMQG5hddgOO-yHx_o5Izt3ZUDDq31ahWAJp/exec"
BASE_URL = "https://civilskash.in"
OUTPUT_DIR = "notes"

# 1. HARDCODED DATA (Verified Complete from app.js)
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

# --- PREMIUM HTML TEMPLATE (With Social Image & Schema) ---
HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
    <title>{title_tag}</title>
    <meta name="description" content="{meta_desc}">
    <link rel="canonical" href="{page_url}" />
    
    <meta property="og:title" content="{title}">
    <meta property="og:description" content="{meta_desc}">
    <meta property="og:image" content="{og_image}">
    <meta property="og:url" content="{page_url}">
    <meta property="og:type" content="article">
    <meta name="theme-color" content="#050505">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,700;0,900;1,700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="../../style_lite.css">

    <link rel="icon" type="image/png" sizes="192x192" href="https://civilskash.in/icon-192.png">
    <link rel="apple-touch-icon" href="https://civilskash.in/icon-192.png">

    <script type="application/ld+json">{schema_json}</script>
</head>
<body>

    <article class="premium-card">
        
        <div class="card-visual">
            <div class="watermark">Civils<span>Kash</span></div>
            <div class="hero-img" style="background-image: url('{og_image}');"></div>
        </div>

        <div class="card-content">
            
            <div class="meta-row">
                <button class="category-pill js-go-home">{category}</button>
                <span class="date">{date}</span>
            </div>

            <h1 class="card-title">{title}</h1>

            <div class="card-text">
                {content_html}
            </div>

            <div class="action-area">
                <button class="btn-compact js-go-home">
                    <span>Open Feed</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                </button>
            </div>

            <div class="divider"></div>

            <div class="related-area">
                <div class="related-label">Read Next</div>
                <div class="related-list">
                    {related_html}
                </div>
            </div>

        </div>

    </article>

    <script src="../../app_lite.js" defer></script>

</body>
</html>
"""

# --- HELPER FUNCTIONS ---
def clean_slug(text):
    if not text: return "note"
    slug = text.lower()
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    return slug.strip('-')

def convert_cloze_to_highlights(text):
    if not text: return ""
    return re.sub(r'\{\{c\d+::(.*?)\}\}', r'<strong class="highlight">\1</strong>', text)

def strip_tags(text):
    if not text: return ""
    clean = re.sub(r'\{\{c\d+::(.*?)\}\}', r'\1', text) 
    return re.sub('<[^<]+?>', '', clean) 

def generate_stable_id(item):
    # Generates ID from Title (Stable)
    title_slug = clean_slug(item.get('title', ''))
    seed = item.get('title', '')
    hash_suffix = hashlib.md5(seed.encode('utf-8')).hexdigest()[:5]
    if not title_slug: return f"note-{hash_suffix}"
    return f"{title_slug}-{hash_suffix}"

def parse_date_for_seo(date_str):
    """
    Converts display date (1 Nov 25) to ISO format (2025-11-01) for Google.
    Falls back to today if format fails.
    """
    if not date_str:
        return datetime.now().strftime("%Y-%m-%d")
    try:
        # Attempts to parse '1 Nov 25' or '01 Nov 2025'
        return datetime.strptime(date_str, "%d %b %y").strftime("%Y-%m-%d")
    except ValueError:
        try:
             # Backup: try full year format
             return datetime.strptime(date_str, "%d %b %Y").strftime("%Y-%m-%d")
        except:
             return datetime.now().strftime("%Y-%m-%d")

# --- SMART DATE CHECKER ---
def get_existing_date(file_path):
    """
    Opens existing HTML file and reads the date.
    Used to compare against Sheet date.
    """
    if not os.path.exists(file_path):
        return None
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            # Looks for: <span class="date">1 Nov 25</span>
            match = re.search(r'<span class="date">(.*?)</span>', content)
            if match:
                return match.group(1).strip()
    except Exception as e:
        return None
    return None

# --- MAIN LOGIC ---
def generate_site():
    print("🚀 Starting Smart SEO Generation (Date-Lock Mode)...")

    try:
        response = requests.get(f"{DATA_URL}?t=seo_lite", timeout=10)
        sheet_data = response.json()
        print(f"✅ Fetched {len(sheet_data)} articles from Sheet.")
    except Exception as e:
        print(f"⚠️ Network error, using hardcoded only: {e}")
        sheet_data = []

    full_data = sheet_data + HARDCODED_DATA
    
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    updated_count = 0
    skipped_count = 0
    sitemap_entries = [] # Stores tuple (url, iso_date)

    print(f"⚡ Processing {len(full_data)} items...")

    for item in full_data:
        unique_id = generate_stable_id(item)
        folder_path = f"{OUTPUT_DIR}/{unique_id}"
        file_path = f"{folder_path}/index.html"
        page_url = f"{BASE_URL}/notes/{unique_id}/"
        
        # 1. PREPARE METADATA
        title = item.get('title', 'Untitled Note')
        new_date_str = item.get('date', datetime.now().strftime("%d %b %Y")).strip()
        iso_date_seo = parse_date_for_seo(new_date_str) # Get Machine Readable Date
        
        # 2. THE SMART CHECK (Logic: If File Exists AND Dates Match -> SKIP)
        existing_date = get_existing_date(file_path)
        
        if existing_date and existing_date == new_date_str:
            # The file is up to date. Do not touch it.
            skipped_count += 1
            # IMPORTANT: Even if skipped, we add to sitemap with correct date
            sitemap_entries.append((page_url, iso_date_seo)) 
            continue

        # 3. GENERATE NEW CONTENT (Only runs if Date is different or File is new)
        raw_summary = item.get('summary', '')
        desc_clean = strip_tags(raw_summary)[:160].replace('"', "'").strip()
        body_html = convert_cloze_to_highlights(raw_summary)
        
        image_url = item.get('image', '').strip()
        og_image = image_url if image_url else f"{BASE_URL}/icon-512.png"
        
        # Schema for SEO (Updated to use ISO Date)
        schema_data = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": title,
            "image": [og_image],
            "datePublished": iso_date_seo, 
            "dateModified": iso_date_seo, # Crucial for Google
            "author": {"@type": "Organization", "name": "CivilsKash"},
            "publisher": {
                "@type": "Organization",
                "name": "CivilsKash",
                "logo": {"@type": "ImageObject", "url": f"{BASE_URL}/icon-192.png"}
            },
            "description": desc_clean,
            "mainEntityOfPage": {"@type": "WebPage", "@id": page_url}
        }

        # Related Articles
        others = [x for x in full_data if x != item and x.get('title')]
        related = random.sample(others, min(3, len(others))) if others else []
        related_str = ""
        for rel in related:
            r_id = generate_stable_id(rel)
            rel_cat = rel.get('category', 'GK')
            rel_title = rel.get('title')
            
            related_str += f"""
            <a href="../../notes/{r_id}/" class="related-item">
                <div class="rel-info">
                    <span class="rel-cat">{rel_cat}</span>
                    <div class="rel-title">{rel_title}</div>
                </div>
                <div class="rel-arrow">→</div>
            </a>
            """

        final_html = HTML_TEMPLATE.format(
            title_tag=f"{title} | CivilsKash",
            meta_desc=desc_clean,
            page_url=page_url,
            title=title,
            og_image=og_image,
            schema_json=json.dumps(schema_data),
            category=item.get('category', 'General'),
            date=new_date_str,
            content_html=body_html,
            related_html=related_str
        )

        # Write File
        if not os.path.exists(folder_path): os.makedirs(folder_path)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(final_html)
        
        updated_count += 1
        print(f"💾 Updated: {unique_id}")
        
        sitemap_entries.append((page_url, iso_date_seo))

    # 4. SITEMAP GENERATION (Corrected for SEO)
    print("🗺️  Updating sitemap.xml with Last-Modified Tags...")
    
    # Use today for homepage lastmod
    today_iso = datetime.now().strftime("%Y-%m-%d")
    
    sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    # Homepage entry
    sitemap += f'  <url><loc>{BASE_URL}/</loc><lastmod>{today_iso}</lastmod><priority>1.0</priority></url>\n'
    
    # Article entries
    for url, mod_date in sitemap_entries:
        sitemap += f'  <url><loc>{url}</loc><lastmod>{mod_date}</lastmod></url>\n'
    sitemap += '</urlset>'
    
    with open("sitemap.xml", "w", encoding="utf-8") as f:
        f.write(sitemap)

    # 5. AUTO-PING GOOGLE (The Fix for 'Unknown URL')
    print("📡 Pinging Google to index new changes...")
    try:
        ping_url = f"http://www.google.com/ping?sitemap={BASE_URL}/sitemap.xml"
        # We use a simple get request to notify Google
        p_response = requests.get(ping_url)
        if p_response.status_code == 200:
             print("✅ Google successfully notified! (Status 200)")
        else:
             print(f"⚠️ Google Ping returned: {p_response.status_code}")
    except Exception as e:
        print(f"⚠️ Google Ping failed (Network Issue): {e}")

    print(f"✅ Finished.")
    print(f"   - Files Updated: {updated_count}")
    print(f"   - Files Skipped (Unchanged): {skipped_count}")

if __name__ == "__main__":
    generate_site()
