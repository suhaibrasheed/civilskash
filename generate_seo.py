import os
import json
import requests
import re
import shutil

# --- CONFIGURATION ---
# Replace with your actual Google Script URL
DATA_URL = "https://script.google.com/macros/s/AKfycbxK7nCpv9ERmwbxQeoMKqyADLxgOLimbNMQG5hddgOO-yHx_o5Izt3ZUDDq31ahWAJp/exec"
BASE_URL = "https://civilskash.in"

def clean_slug(text):
    # Turns "Wayanad Landslide!" into "wayanad-landslide"
    slug = text.lower()
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    return slug.strip('-')

def generate_site():
    print("🚀 Connecting to Google Sheets...")
    try:
        # We add ?t=timestamp to bypass cache
        response = requests.get(f"{DATA_URL}?t=seo_gen")
        data = response.json()
    except Exception as e:
        print(f"❌ Error fetching data: {e}")
        return

    # Read your 'skeleton' index.html
    with open("index.html", "r", encoding="utf-8") as f:
        template = f.read()

    sitemap_urls = []
    
    # Clean up old article folders first (optional, prevents ghosts)
    # logic: if folder starts with 'art_', delete it
    for item in os.listdir('.'):
        if os.path.isdir(item) and item.startswith('art_'):
            shutil.rmtree(item)

    print(f"⚡ Generating static pages for {len(data)} articles...")

    for idx, item in enumerate(data):
        # 1. Generate the Folder Name
        slug = clean_slug(item.get('title', 'note'))
        unique_id = item.get('id') or f"art_{idx}_{slug}"
        
        # 2. Create Directory
        if not os.path.exists(unique_id):
            os.makedirs(unique_id)

        # 3. Prepare SEO Content
        page_title = f"{item.get('title')} - CivilsKash"
        # Get first 160 chars for description, clean up quotes
        page_desc = item.get('summary', '')[:160].replace('"', "'").replace('\n', ' ')
        
        # 4. Inject into Template (The "Prerendering" Magic)
        new_html = template
        
        # Replace Title
        new_html = re.sub(r'<title>.*?</title>', f'<title>{page_title}</title>', new_html)
        
        # Replace Description
        new_html = re.sub(r'content="Free UPSC.*?"', f'content="{page_desc}"', new_html)
        
        # CRITICAL: Fix Relative Links (Because we are now one folder deep)
        # We replace "style.css" with "../style.css" so the browser looks up one level
        new_html = new_html.replace('href="style.css"', 'href="../style.css"')
        new_html = new_html.replace('src="app.js"', 'src="../app.js"')
        new_html = new_html.replace('href="manifest.json"', 'href="../manifest.json"')
        new_html = new_html.replace('href="/favicon', 'href="../favicon')
        
        # 5. Save the File
        with open(f"{unique_id}/index.html", "w", encoding="utf-8") as f:
            f.write(new_html)
            
        # 6. Add to Sitemap List
        sitemap_urls.append(f"{BASE_URL}/{unique_id}/")

    # --- GENERATE SITEMAP.XML ---
    print("🗺️  Updating sitemap.xml...")
    sitemap_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
    sitemap_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    sitemap_content += f'  <url><loc>{BASE_URL}/</loc><priority>1.0</priority></url>\n'
    
    for url in sitemap_urls:
        sitemap_content += f'  <url><loc>{url}</loc><changefreq>weekly</changefreq></url>\n'
        
    sitemap_content += '</urlset>'
    
    with open("sitemap.xml", "w", encoding="utf-8") as f:
        f.write(sitemap_content)

    print("✅ SEO Generation Complete!")

if __name__ == "__main__":
    generate_site()
