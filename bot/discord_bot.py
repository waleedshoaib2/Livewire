import os
import discord
from discord import app_commands
from discord.ext import commands, tasks
from supabase import create_client, Client
from dotenv import load_dotenv
import asyncio

load_dotenv()

# Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
DISCORD_TOKEN = os.getenv("DISCORD_TOKEN")
DISCORD_CHANNEL_ID = os.getenv("DISCORD_CHANNEL_ID")

# Initialize Supabase
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Initialize Bot
intents = discord.Intents.default()
# intents.message_content = True # Not strictly needed for slash commands but good for debugging/reading
bot = commands.Bot(command_prefix="!", intents=intents)

@bot.event
async def on_ready():
    print(f'Logged in as {bot.user}')
    print("Connected to servers:")
    for guild in bot.guilds:
        print(f" - {guild.name} (id: {guild.id})")
    
    if DISCORD_CHANNEL_ID:
        channel = bot.get_channel(int(DISCORD_CHANNEL_ID))
        if channel:
            print(f"✅ Configured Channel Found: #{channel.name} (ID: {channel.id})")
        else:
            print(f"❌ Configured Channel ID {DISCORD_CHANNEL_ID} NOT FOUND. Check your ID and Bot Permissions.")
    
    # Sync Slash Commands
    try:
        synced = await bot.tree.sync()
        print(f"✅ Synced {len(synced)} command(s) globaly.")
    except Exception as e:
        print(f"❌ Failed to sync commands: {e}")

    check_notifications.start()

@bot.tree.command(name="addsub", description="Add a subreddit to monitor")
@app_commands.describe(name="The name of the subreddit")
async def addsub(interaction: discord.Interaction, name: str):
    try:
        data = {"name": name, "active": True, "added_via": "discord"}
        supabase.table("subreddits").insert(data).execute()
        await interaction.response.send_message(f"✅ Added r/{name} to monitoring.")
    except Exception as e:
        await interaction.response.send_message(f"❌ Error adding r/{name}: {e}")

@bot.tree.command(name="removesub", description="Stop monitoring a subreddit")
@app_commands.describe(name="The name of the subreddit")
async def removesub(interaction: discord.Interaction, name: str):
    try:
        supabase.table("subreddits").update({"active": False}).eq("name", name).execute()
        await interaction.response.send_message(f"zzz Stopped monitoring r/{name}.")
    except Exception as e:
        await interaction.response.send_message(f"❌ Error removing r/{name}: {e}")

@bot.tree.command(name="listsubs", description="List all active subreddits")
async def listsubs(interaction: discord.Interaction):
    try:
        response = supabase.table("subreddits").select("name").eq("active", True).execute()
        subs = [row["name"] for row in response.data]
        if subs:
            await interaction.response.send_message(f"📋 **Active Subreddits:**\n" + "\n".join([f"- r/{s}" for s in subs]))
        else:
            await interaction.response.send_message("📭 No active subreddits.")
    except Exception as e:
        await interaction.response.send_message(f"❌ Error listing subreddits: {e}")

@tasks.loop(minutes=1)
async def check_notifications():
    """Check for unnotified posts and send to Discord."""
    if not DISCORD_CHANNEL_ID:
        print("DISCORD_CHANNEL_ID not set, skipping notifications.")
        return

    channel = bot.get_channel(int(DISCORD_CHANNEL_ID))
    if not channel:
        # print("Channel not found.") # Reduce spam in logs if channel is bad
        return

    try:
        # Fetch unnotified posts
        response = supabase.table("posts").select("*").eq("notified", False).limit(5).execute()
        posts = response.data

        for post in posts:
            embed = discord.Embed(
                title=post["title"],
                url=post["url"],
                description=post.get("body", "")[:200] + "...",
                color=0xFF5733
            )
            embed.set_author(name=f"r/{post['subreddit']} • u/{post['author']}")
            embed.add_field(name="Keywords", value=", ".join(post.get("matched_keywords", [])), inline=True)
            embed.add_field(name="Score", value=str(post.get("score")), inline=True)

            try:
                await channel.send(embed=embed)
                
                # Mark as notified
                supabase.table("posts").update({
                    "notified": True, 
                    "notified_at": "now()"
                }).eq("id", post["id"]).execute()
                print(f"📢 Notified: {post['id']}")
                
            except Exception as e:
                print(f"Error sending/updating post {post['id']}: {e}")

    except Exception as e:
        print(f"Error in notification loop: {e}")

@check_notifications.before_loop
async def before_check_notifications():
    await bot.wait_until_ready()

if __name__ == "__main__":
    if not DISCORD_TOKEN:
        print("Error: DISCORD_TOKEN not found.")
    else:
        bot.run(DISCORD_TOKEN)
