import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: Supabase credentials missing.")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def seed():
    subreddits = [
        # Original List
        "AI_Agents", "aipromptprogramming", "androiddev", "appdev", "AppDevelopers",
        "AppDevelopment", "ArtificialInelligence", "Backend", "B2BForHire", "coding",
        "DeveloperJobs", "expressjs", "FlutterDev", "forhire", "freelance_forhire",
        "googlecloud", "hireaprogrammer", "jobbit", "LangChain", "MachineLearning",
        "MachineLearningJobs", "microsaas", "n8n", "n8n_ai_agents", "programmingcirclejerk",
        "programminghorror", "PythonJobs", "remotepython", "remotework", "softwaretesting",
        "vercel", "Supabase", "WebDeveloper", "WebDeveloperJobs", "WebDevJobs",
        "WorkOnline", "webscraping",
        # Founder/Entrepreneur Hubs
        "startups", "indiehackers", "SideProject", "indianstartups",
        # High-Pay Niche Tech Stacks
        "rust", "golang", "kubernetes", "terraform", "ansible", "rails", "haskell", "linuxadmin",
        # Geographic & Specialized Hubs
        "developersIndia", "cscareerquestionsEU", "cscareerquestionsCAD", "developersLatinAmerica",
        # Livewire Suggestions (High-Value Tech)
        "reactjs", "vuejs", "javascript", "typescript", "node", "aws", "azure", 
        "devops", "sysadmin", "freelance", "remote", "digitalnomad", "sales", "marketing"
    ]
    
    print(f"Seeding {len(subreddits)} subreddits...")
    
    for sub in subreddits:
        print(f"Adding r/{sub}...", end=" ")
        try:
            # We strip 'r/' and whitespace just in case, though this list looks clean
            clean_name = sub.replace("r/", "").strip()
            data = {"name": clean_name, "active": True, "added_via": "seed"}
            supabase.table("subreddits").upsert(data, on_conflict="name").execute()
            print("✅")
        except Exception as e:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    seed()
