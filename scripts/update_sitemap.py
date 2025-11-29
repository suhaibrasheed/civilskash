import json
import requests
import re
import datetime
import os

# --- CONFIGURATION ---
BASE_URL = "https://civilskash.in/"
GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbyts9Lf6r37UUGkCNTlqMhb-YhdpOrrC4JRxVWpQ4uM0QxZzUMvNl0MMzumltlMd-8N/exec"
SITEMAP_PATH = "sitemap.xml"

# --- 1. HARDCODED DATA (Matches App.Data.getHardcodedData) ---
# This ensures your "SEO Magnet" cards are always in the sitemap even if the sheet fails
HARDCODED_DATA = [
    { 
        "category": "Current Affairs", 
        "title": "Daily Current Affairs Quiz UPSC JKPSC", 
        "summary": "Boost your preparation with high-yield MCQs..."
    },
    { 
        "category": "Polity", 
        "title": "Schedules of Indian Constitution Mnemonic", 
        "summary": "Memorizing the 12 Schedules of the Indian Constitution..."
    },
    { 
        "category": "History", 
        "title": "Governor General vs Viceroy Modern History", 
        "summary": "Aspirants often confuse these colonial titles..."
    },
    { 
        "category": "Environment", 
        "title": "List of New Ramsar Sites in India 2026", 
        "summary": "India has significantly expanded its conservation network..."
    },
    {
        "category": "Polity", 
        "title": "Key Provisions J&K Reorganization Act 2019",
        "summary": "This historic Act bifurcated the state of Jammu & Kashmir..."
    },
    {
        "category": "Geography", 
        "title": "Karewa Formation and Saffron Cultivation",
        "summary": "Karewas are unique lacustrine (lake-based) deposits..."
    },
    {
        "category": "Geography", 
        "title": "Important Mountain Passes of Jammu Kashmir",
        "summary": "Map-based questions often ask to arrange passes from North to South..."
    },
    {
        "category": "History", 
        "title": "Timeline of Dogra Rule in Kashmir",
        "summary": "The Dogra dynasty was established by Gulab Singh..."
    },
    {
        "category": "Economy", 
        "title": "Repo Rate vs Reverse Repo Rate Explained",
        "summary": "Monetary Policy tools are used by the central bank..."
    },
    {
        "category": "Polity", 
        "title": "Fundamental Rights Articles 12-35",
        "summary": "Part III of the Constitution is called the Magna Carta of India..."
    },
    {
        "category": "International Relations", 
        "title": "Indus Water Treaty 1960 India Pakistan",
        "summary": "Brokered by the World Bank, this treaty divides the Indus river system..."
    },
    {
        "category": "Geography",
        "title": "Shortest Koppen’s Climatic Classification for Exam",
        "summary": "Koppen’s Climatic Classification links climate to natural vegetation..."
    }
]

def generate_id(index, title):
    """
    Replicates the exact JS logic: 
    const slug = (item.title || 'note').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const uniqueId = `art_${idx}_${slug}`;
    """
    slug = title if title else 'note'
    slug = slug.lower()
    slug = re.sub(r'[^a-z0-9]+', '-', slug) # Replace non-alphanumeric with hyphen
    slug = slug.strip('-') # Remove leading/trailing hyphens
    return f"art_{index}_{slug}"

def generate_sitemap_content(urls):
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    # Add Homepage
    xml += '  <url>\n'
    xml += f'    <loc>{BASE_URL}</loc>\n'
    xml += '    <changefreq>daily</changefreq>\n'
    xml += '    <priority>1.0</priority>\n'
    xml += '  </url>\n'

    for url in urls:
        xml += '  <url>\n'
        xml += f'    <loc>{url}</loc>\n'
        xml += '    <changefreq>weekly</changefreq>\n'
        xml += '    <priority>0.8</priority>\n'
        xml += '  </url>\n'
    
    xml += '</urlset>'
    return xml

def main():
    all_urls = []
    
    print("--- 1. Processing Hardcoded Data ---")
    for idx, item in enumerate(HARDCODED_DATA):
        # JS Logic: normalize(rawData) runs on the array, using its index
        card_id = generate_id(idx, item.get('title', ''))
        full_url = f"{BASE_URL}?id={card_id}"
        all_urls.append(full_url)
        print(f"Added: {card_id}")

    print("\n--- 2. Fetching Dynamic Data from Google Sheets ---")
    try:
        response = requests.get(GOOGLE_SHEET_URL)
        if response.status_code == 200:
            cloud_data = response.json()
            # JS Logic: normalize(cloudData) starts index at 0 again for this specific array
            for idx, item in enumerate(cloud_data):
                card_id = generate_id(idx, item.get('title', ''))
                full_url = f"{BASE_URL}?id={card_id}"
                all_urls.append(full_url)
            print(f"Successfully fetched {len(cloud_data)} items from Cloud.")
        else:
            print(f"Failed to fetch cloud data. Status: {response.status_code}")
    except Exception as e:
        print(f"Error fetching cloud data: {e}")

    print(f"\nTotal URLs generated: {len(all_urls) + 1} (including home)")
    
    # Write to file
    xml_content = generate_sitemap_content(all_urls)
    with open(SITEMAP_PATH, "w", encoding="utf-8") as f:
        f.write(xml_content)
    
    print(f"Successfully wrote {SITEMAP_PATH}")

if __name__ == "__main__":
    main()
