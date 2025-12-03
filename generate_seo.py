import os
import json
import requests
import re
import shutil

# --- CONFIGURATION ---
DATA_URL = "https://script.google.com/macros/s/AKfycbxK7nCpv9ERmwbxQeoMKqyADLxgOLimbNMQG5hddgOO-yHx_o5Izt3ZUDDq31ahWAJp/exec"
BASE_URL = "https://civilskash.in"

# 1. HARDCODED DATA
HARDCODED_DATA = [
    {"title": "Daily Current Affairs Quiz UPSC JKPSC", "summary": "Boost your preparation with high-yield MCQs for UPSC and JKPSC Prelims. Do you know 'Panchamrit' strategy from COP26, which relates to India's {{c1::Climate Action}} goals.", "category": "Current Affairs", "date": "Daily Update", "image": "https://tse3.mm.bing.net/th/id/OIP.WvbBV909fzI7zuLUadLrgQHaE6?rs=1&pid=ImgDetMain&o=7&rm=3"},
    {"title": "Schedules of Indian Constitution Mnemonic", "summary": "Memorizing the 12 Schedules of the Indian Constitution is crucial for matching questions in Prelims. Use the famous trick: '{{c1::TEARS OF OLD PM}}'.", "category": "Polity", "date": "Cheat Sheet", "image": "https://media.istockphoto.com/id/1007178836/photo/indian-supreme-court.jpg?s=612x612&w=0&k=20&c=sVUxnP1WCkC62og2fjbzgdUMleD3WoeOzbBgNiJ9y_Y="},
    {"title": "Governor General vs Viceroy Modern History", "summary": "Aspirants often confuse these colonial titles. The Regulating Act of {{c1::1773}} created the post of Governor General of Bengal (Warren Hastings).", "category": "History", "date": "Modern India", "image": "https://i0.wp.com/glimpsesofhistory.com/wp-content/uploads/2020/08/Captain_William_Bentinck_1764-1813_by_George_Romney.jpg?fit=1067%2C1280&ssl=1"},
    {"title": "List of New Ramsar Sites in India 2026", "summary": "India has significantly expanded its conservation network, with the total number of Ramsar sites crossing {{c1::94}}.", "category": "Environment", "date": "Updated List", "image": "https://cdn.downtoearth.org.in/library/large/2022-11-08/0.94591600_1667918565_33.jpg"},
    {"title": "Key Provisions J&K Reorganization Act 2019", "summary": "This historic Act bifurcated the state of Jammu & Kashmir into two Union Territories.", "category": "Polity", "date": "Act 2019", "image": ""},
    {"title": "Karewa Formation and Saffron Cultivation", "summary": "Karewas are unique lacustrine (lake-based) deposits found in the Valley of Kashmir.", "category": "Geography", "date": "Landforms", "image": "https://cdn.thewire.in/wp-content/uploads/2022/11/25164308/image-603.png"},
    {"title": "Important Mountain Passes of Jammu Kashmir", "summary": "Map-based questions often ask to arrange passes from North to South.", "category": "Geography", "date": "Mapping", "image": "https://th.bing.com/th/id/R.8aff93c4229fe168ed0d9e28ea6f9c0d?rik=wgO6yKzD2Dlt4A&riu=http%3a%2f%2fwww.freeworldmaps.net%2fasia%2findia%2fjammuandkashmir%2fjammuandkashmir-map.jpg&ehk=N1%2fj%2bigXP8Pc22xSdqyytcDFWf111pBlHlbsh1ia8Gw%3d&risl=&pid=ImgRaw&r=0"},
    {"title": "Timeline of Dogra Rule in Kashmir", "summary": "The Dogra dynasty was established by {{c1::Gulab Singh}} following the Treaty of Amritsar in 1846.", "category": "History", "date": "Regional", "image": "https://images.squarespace-cdn.com/content/v1/5ab61c67ec4eb7ab7a2f40f2/1570767012756-3RB9F64GC745URU1GNA5/ke17ZwdGBToddI8pDm48kMEscrJZt_tmaeDMTaC3Grd7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QPOohDIaIeljMHgDF5CVlOqpeNLcJ80NK65_fV7S1USasn69Hr34dwVEWwP0LjT7TmWk4ozqjQRTjqwHqVncSD8iN_TR6rJlKCdD_scFx3Q/71087629_10216837803031064_7165896983389929472_o.jpg"},
    {"title": "Repo Rate vs Reverse Repo Rate Explained", "summary": "Monetary Policy tools are used by the central bank to manage liquidity.", "category": "Economy", "date": "Concepts", "image": "https://iol-prod.appspot.com/image/52f0e1045b489d817cb85bef800ea88482c44804=w700"},
    {"title": "Fundamental Rights Articles 12-35", "summary": "Part III of the Constitution is called the Magna Carta of India.", "category": "Polity", "date": "Constitution", "image": "https://www.nextias.com/blog/wp-content/uploads/2024/02/indian-constitution-1024x1024.jpg"},
    {"title": "Indus Water Treaty 1960 India Pakistan", "summary": "Brokered by the {{c1::World Bank}}, this treaty divides the Indus river system.", "category": "International Relations", "date": "Treaties", "image": "https://www.deccanchronicle.com/h-upload/2025/04/24/1911090-induswaterstreaty.jpg"},
    {"title": "Shortest Koppen’s Climatic Classification for Exam", "summary": "Koppen’s Climatic Classification links climate to natural vegetation.", "category": "Geography", "date": "Climatology", "image": "https://www.pngitem.com/pimgs/m/505-5057181_india-map-of-kppen-climate-classification-koppen-climate.png"}
]

def clean_slug(text):
    slug = text.lower()
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    return slug.strip('-')

# Helper to remove {{c1::text}} syntax for clean SEO text
def clean_cloze(text):
    if not text: return ""
    return re.sub(r'\{\{c\d+::(.*?)\}\}', r'\1', text)

def generate_site():
    print("🚀 Starting SEO Generation...")
    
    # 2. FETCH GOOGLE SHEETS DATA
    try:
        response = requests.get(f"{DATA_URL}?t=seo_gen")
        sheet_data = response.json()
        print(f"✅ Fetched {len(sheet_data)} articles from Google Sheets.")
    except Exception as e:
        print(f"❌ Error fetching data: {e}")
        sheet_data = []

    # 3. MERGE LOGIC
    combined_raw = sheet_data + HARDCODED_DATA
    combined_raw.reverse() # Latest first
    full_data = combined_raw

    # Read template
    with open("index.html", "r", encoding="utf-8") as f:
        template = f.read()

    sitemap_urls = []
    
    # 4. CLEANUP
    print("🧹 Cleaning old folders...")
    if os.path.exists("notes"):
        shutil.rmtree("notes")
    os.makedirs("notes")

    print(f"⚡ Generating {len(full_data)} pages inside /notes/ ...")

    for idx, item in enumerate(full_data):
        slug = clean_slug(item.get('title', 'note'))
        unique_id = item.get('id') or f"art_{idx}_{slug}"
        
        output_dir = f"notes/{unique_id}"
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

        # PREPARE SEO CONTENT
        page_title = f"{item.get('title')} - CivilsKash"
        clean_summary = clean_cloze(item.get('summary', ''))
        # Limit description to 160 chars, remove quotes/newlines
        page_desc = clean_summary[:160].replace('"', "'").replace('\n', ' ')
        
        # URL for Canonical
        page_url = f"{BASE_URL}/notes/{unique_id}/"

        # --- HTML INJECTION ---
        new_html = template
        
        # 0. STRIP HEAVY FEATURES (FIXED LOGIC)
        # We perform this BEFORE other substitutions.
        # This removes everything between the start and end markers (Modals, Quizzes, Settings).
        pattern = r'.*?'
        new_html = re.sub(pattern, '', new_html, flags=re.DOTALL)
        
        # 1. Inject Title
        new_html = re.sub(r'<title>.*?</title>', f'<title>{page_title}</title>', new_html)
        
        # 2. Inject Description
        new_html = re.sub(r'content="Free UPSC.*?"', f'content="{page_desc}"', new_html)
        
        # 3. Inject Canonical & OG URL
        new_html = new_html.replace(
            '<link rel="canonical" href="https://civilskash.in/" />', 
            f'<link rel="canonical" href="{page_url}" />'
        )
        
        new_html = new_html.replace(
            '<meta property="og:url" content="https://civilskash.in">', 
            f'<meta property="og:url" content="{page_url}">'
        )

        # 4. Inject Static Card HTML (Fixes Screenshot / Empty Shell)
        img_html = ""
        if item.get('image'):
            img_html = f'<div class="card-img" style="background-image: url(\'{item.get("image")}\')"></div>'
            
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
                    <p class="summary-box">{clean_summary}</p>
                </div>
            </div>
        </article>
        """
        # Replace the empty div with our filled card
        new_html = new_html.replace('<div id="feed-list"></div>', f'<div id="feed-list">{card_html}</div>')
        
        # 5. FIX RELATIVE PATHS
        new_html = new_html.replace('href="style.css"', 'href="../../style.css"')
        new_html = new_html.replace('src="app.js"', 'src="../../app.js"')
        new_html = new_html.replace('href="manifest.json"', 'href="../../manifest.json"')
        new_html = new_html.replace('href="/favicon', 'href="../../favicon')

        with open(f"{output_dir}/index.html", "w", encoding="utf-8") as f:
            f.write(new_html)
            
        sitemap_urls.append(page_url)

    # 7. UPDATE SITEMAP
    print("🗺️  Updating sitemap.xml...")
    sitemap_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
    sitemap_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    sitemap_content += f'  <url><loc>{BASE_URL}/</loc><priority>1.0</priority></url>\n'
    
    for url in sitemap_urls:
        sitemap_content += f'  <url><loc>{url}</loc><changefreq>weekly</changefreq></url>\n'
        
    sitemap_content += '</urlset>'
    
    with open("sitemap.xml", "w", encoding="utf-8") as f:
        f.write(sitemap_content)

    print("✅ Done! SEO Fixed: Heavy features stripped.")

if __name__ == "__main__":
    generate_site()
