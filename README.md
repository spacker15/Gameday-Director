# GameDay Director

GameDay Director is a league-agnostic game day operations web app for any youth or amateur sports organization.

## What it does
- Manage fields and field types
- Track games by field and time
- Assign paid referees
- Assign volunteers for clock and score table
- Calculate referee payroll
- Calculate volunteer hours
- Export reports to CSV
- Run entirely in the browser with local storage

## Run it
### Option 1: Open locally
Open `index.html` in any browser.

### Option 2: Upload to GitHub Pages
1. Create a new GitHub repo.
2. Upload all files from this folder.
3. In GitHub, go to Settings > Pages.
4. Set the source to deploy from the main branch root.
5. Your web app will be live as a static site.

### Option 3: Deploy to Vercel or Netlify
Drop the folder into a static hosting project.

## Notes
- This MVP stores everything in browser localStorage.
- Export your JSON backup regularly.
- Later, this can be upgraded to a multi-user cloud app with authentication and a database.
