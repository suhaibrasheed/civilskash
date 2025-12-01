import os
import json
import requests
import re
import shutil

# --- CONFIGURATION ---
DATA_URL = "https://script.google.com/macros/s/AKfycbxK7nCpv9ERmwbxQeoMKqyADLxgOLimbNMQG5hddgOO-yHx_o5Izt3ZUDDq31ahWAJp/exec"
BASE_URL = "https://civilskash.in"

# 1. HARDCODED DATA (Manual Backup for SEO)
# These are the 12 articles from your app.js that Google couldn't see.
HARDCODED_DATA = [
    {"title": "Daily Current Affairs Quiz UPSC JKPSC", "summary": "Boost your preparation with high-yield MCQs for UPSC and JKPSC Prelims. Do you know 'Panchamrit' strategy from COP26, which relates to India's {{c1::Climate Action}} goals."},
    {"title": "Schedules of Indian Constitution Mnemonic", "summary": "Memorizing the 12 Schedules of the Indian Constitution is crucial for matching questions in Prelims. Use the famous trick: '{{c1::TEARS OF OLD PM}}'."},
    {"title": "Governor General vs Viceroy Modern History", "summary": "Aspirants often confuse these colonial titles. The Regulating Act of {{c1::1773}} created the post of Governor General of Bengal (Warren Hastings)."},
    {"title": "List of New Ramsar Sites in India 2026", "summary": "India has significantly expanded its conservation network, with the total number of Ramsar sites crossing {{c1::94}}. The {{c2::Sundarbans}} in West Bengal remains the largest site."},
    {"title": "Key Provisions J&K Reorganization Act 2019", "summary": "This historic Act bifurcated the state of Jammu & Kashmir into two Union Territories: J&K (with legislature) and Ladakh (without legislature)."},
    {"title": "Karewa Formation and Saffron Cultivation", "summary": "Karewas are unique lacustrine (lake-based) deposits found in the Valley of Kashmir, formed during the Pleistocene period."},
    {"title": "Important Mountain Passes of Jammu Kashmir", "summary": "Map-based questions often ask to arrange passes from North to South. The {{c1::Banihal Pass}} connects Jammu to Srinagar and houses the Jawahar Tunnel."},
    {"title": "Timeline of Dogra Rule in Kashmir", "summary": "The Dogra dynasty was established by {{c1::Gulab Singh}} following the Treaty of Amritsar in 1846, often called the {{c1::'Sale Deed of Kashmir'}}."},
    {"title": "Repo Rate vs Reverse Repo Rate Explained", "summary": "Monetary Policy tools are used by the central bank to manage liquidity. Repo Rate is the rate at which the {{c1::RBI}} lends money to commercial banks."},
    {"title": "Fundamental Rights Articles 12-35", "summary": "Part III of the Constitution is called the Magna Carta of India. It guarantees civil liberties such as the Right to Equality (Articles 14-18)."},
    {"title": "Indus Water Treaty 1960 India Pakistan", "summary": "Brokered by the {{c1::World Bank}}, this treaty divides the Indus river system. India has full control over the three Eastern Rivers: Ravi, Beas, and Sutlej."},
    {"title": "Shortest Koppen’s Climatic Classification for Exam", "summary": "Koppen’s Climatic Classification links climate to natural vegetation using temperature and rainfall. It has five major groups."}
]

def clean_slug(text):
    slug = text.lower()
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    return slug.strip('-')

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

    # 3. MERGE DATA (Hardcoded + Sheets)
    # We put sheets first so they are fresher, but include hardcoded at the end
    full_data = sheet_data + HARDCODED_DATA

    # Read template
    with open("index.html", "r", encoding="utf-8") as f:
        template = f.read()

    sitemap_urls = []
    
    # 4. CLEANUP (Delete old root folders to fix the mess)
    print("🧹 Cleaning up old root folders...")
    for item in os.listdir('.'):
        if os.path.isdir(item) and item.startswith('art_'):
            shutil.rmtree(item)
            
    # Create 'notes' folder if missing
    if not os.path.exists("notes"):
        os.makedirs("notes")

    print(f"⚡ Generating {len(full_data)} pages inside /notes/ ...")

    for idx, item in enumerate(full_data):
        slug = clean_slug(item.get('title', 'note'))
        # Use existing ID if available, else generate consistent ID
        unique_id = item.get('id') or f"art_{idx}_{slug}"
        
        # 5. CREATE SUBFOLDER inside 'notes'
        # Path becomes: repo/notes/art_0_title/index.html
        output_dir = f"notes/{unique_id}"
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

        # SEO Meta Injection
        page_title = f"{item.get('title')} - CivilsKash"
        page_desc = item.get('summary', '')[:160].replace('"', "'").replace('\n', ' ')
        
        new_html = template
        new_html = re.sub(r'<title>.*?</title>', f'<title>{page_title}</title>', new_html)
        new_html = re.sub(r'content="Free UPSC.*?"', f'content="{page_desc}"', new_html)
        
        # 6. FIX RELATIVE PATHS (Crucial for Choice B)
        # Since we are in notes/folder/ (2 levels deep), we need ../../
        new_html = new_html.replace('href="style.css"', 'href="../../style.css"')
        new_html = new_html.replace('src="app.js"', 'src="../../app.js"')
        new_html = new_html.replace('href="manifest.json"', 'href="../../manifest.json"')
        new_html = new_html.replace('href="/favicon', 'href="../../favicon')

        with open(f"{output_dir}/index.html", "w", encoding="utf-8") as f:
            f.write(new_html)
            
        # Add to Sitemap with /notes/ prefix
        sitemap_urls.append(f"{BASE_URL}/notes/{unique_id}/")

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

    print("✅ Done! 'notes' folder populated and root cleaned.")

if __name__ == "__main__":
    generate_site()
