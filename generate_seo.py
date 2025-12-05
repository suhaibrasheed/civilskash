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

# 1. HARDCODED DATA (Backup)
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
        "id": "static_012", 
        "title": "Shortest Koppen’s Climatic Classification for Exam", 
        "summary": "Koppen’s Climatic Classification links climate to natural vegetation using temperature and rainfall. It has five major groups {{c1::A – Tropical}}, {{c2::B – Dry}}, {{c3::C – Temperate}}, {{c4::D – Continental}}, {{c5::E – Polar}}. <br> Important subtypes include {{c6::Af (Tropical Rainforest)}}, {{c7::Aw (Tropical Savanna)}}, {{c8::BWh (Hot Desert)}}, {{c9::Cfa (Humid Subtropical)}}, and {{c10::ET (Tundra)}}. <br> India mainly has: {{c11::Am in Western Coast}}, {{c12::Aw in Peninsular India}}, {{c13::Cwa/Cfa in North India}}, and {{c14::BWh/BSh in Rajasthan}}.", 
        "category": "Geography", 
        "date": "1 Nov 25", 
        "image": "https://www.pngitem.com/pimgs/m/505-5057181_india-map-of-kppen-climate-classification-koppen-climate.png"
    }
]

# --- PREMIUM HTML TEMPLATE ---
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
    title_slug = clean_slug(item.get('title', ''))
    seed = item.get('date', item.get('title', '')) 
    hash_suffix = hashlib.md5(seed.encode('utf-8')).hexdigest()[:5]
    if not title_slug: return f"note-{hash_suffix}"
    return f"{title_slug}-{hash_suffix}"

# --- MAIN LOGIC ---
def generate_site():
    print("🚀 Starting Premium SEO Generation...")

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
    sitemap_urls = []

    print(f"⚡ Processing {len(full_data)} items...")

    for item in full_data:
        unique_id = generate_stable_id(item)
        folder_path = f"{OUTPUT_DIR}/{unique_id}"
        file_path = f"{folder_path}/index.html"
        page_url = f"{BASE_URL}/notes/{unique_id}/"
        
        title = item.get('title', 'Untitled Note')
        raw_summary = item.get('summary', '')
        desc_clean = strip_tags(raw_summary)[:160].replace('"', "'").strip()
        
        body_html = convert_cloze_to_highlights(raw_summary)
        
        image_url = item.get('image', '').strip()
        og_image = image_url if image_url else f"{BASE_URL}/icon-512.png"
        
        date_str = item.get('date', datetime.now().strftime("%d %b %Y"))

        schema_data = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": title,
            "image": [og_image],
            "datePublished": "2025-11-01", 
            "author": {"@type": "Organization", "name": "CivilsKash"},
            "publisher": {
                "@type": "Organization",
                "name": "CivilsKash",
                "logo": {"@type": "ImageObject", "url": f"{BASE_URL}/icon-192.png"}
            },
            "description": desc_clean,
            "mainEntityOfPage": {"@type": "WebPage", "@id": page_url}
        }

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
            date=date_str,
            content_html=body_html,
            related_html=related_str
        )

        should_write = True
        if os.path.exists(file_path):
            with open(file_path, "r", encoding="utf-8") as f:
                if f.read() == final_html:
                    should_write = False
        
        if should_write:
            if not os.path.exists(folder_path): os.makedirs(folder_path)
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(final_html)
            updated_count += 1
        
        sitemap_urls.append(page_url)

    print("🗺️  Updating sitemap.xml...")
    sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    sitemap += f'  <url><loc>{BASE_URL}/</loc><priority>1.0</priority></url>\n'
    for url in sitemap_urls:
        sitemap += f'  <url><loc>{url}</loc><changefreq>weekly</changefreq></url>\n'
    sitemap += '</urlset>'
    
    with open("sitemap.xml", "w", encoding="utf-8") as f:
        f.write(sitemap)

    print(f"✅ Finished. Generated/Updated {updated_count} premium pages.")

if __name__ == "__main__":
    generate_site()
