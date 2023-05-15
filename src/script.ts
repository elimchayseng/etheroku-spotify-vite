/// generic parameters 
const clientId = "f3ab9fbdd61342c0b05ff2e4d1d7a5e9";
const params = new URLSearchParams(window.location.search);
const code = params.get("code");


/// Redirect flow for app authentication 
export async function redirectToAuthCodeFlow(clientId: string) {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "https://etheroku-spotify-vite.herokuapp.com/callback");
    params.append("scope", "user-read-private user-read-email user-read-recently-played user-top-read");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}
/// Auth code Verification 
function generateCodeVerifier(length: number) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
/// Auth code challenge 
async function generateCodeChallenge(codeVerifier: string) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}
/// Access Token generation
export async function getAccessToken(clientId: string, code: string): Promise<string> {
    const verifier = localStorage.getItem("verifier");

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "https://etheroku-spotify-vite.herokuapp.com/callback");
    params.append("code_verifier", verifier!);

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    const { access_token } = await result.json();
    return access_token;
}
/// Profile Info retrieve 
async function fetchProfile(token: string): Promise<any> {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}
/// Get the most recent 30 played tracks
async function fetchRecentTrack(token: string): Promise<{ topTracks: any[], recentTracks: any[] }> {

  const result = await fetch(`https://api.spotify.com/v1/me/player/recently-played?limit=30`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const recentTracksData = await result.json();
  const recentTracks = recentTracksData.items.map((item: any) => ({
    title: item.track.name,
    artist: item.track.artists[0].name,
    album: item.track.album.name,
  }));
  console.log("Here are the Recent Tracks:")
  console.log(recentTracks)

/// Get the Top 30 Tracks from the last 4 weeks  
  const topTracksResult = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=30`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const topTracksData = await topTracksResult.json();

  const topTracks = topTracksData.items.map((item: any) => {
    return {
      title: item.name,
      artist: item.artists[0].name,
      album: item.album.name,
    };
  });
console.log("Here are the Top Tracks:")
console.log(topTracks)
return { topTracks, recentTracks };
} 

// Build the HTML Tables from the Track Data 
function buildTables(topTracks: any[],recentTracks: any[]){
// Create the Table for Top Tracks 
  const topTable = document.createElement('table');
  // Create Top table headers
  const headers1 = ['Top 30 Title', 'Top 30 Artist', 'Top 30 Album'];
  const headerRow1 = document.createElement('tr');
  headers1.forEach(header => {
    const th1 = document.createElement('th');
    th1.textContent = header;
    headerRow1.appendChild(th1);
  });
  topTable.appendChild(headerRow1);

  // Create table rows for top tracks
  topTracks.forEach(track => {
    const row1 = document.createElement('tr');
    row1.innerHTML = `
      <td>${track.title}</td>
      <td>${track.artist}</td>
      <td>${track.album}</td>
    `;
    topTable.appendChild(row1);
  });

const outputDiv1 = document.getElementById('topTable');
outputDiv1!.innerHTML = '';
outputDiv1!.appendChild(topTable);
  
// Create the Table for Recent Tracks 
const recentTable = document.createElement('table');
// Create Top table headers
const headers2 = ['Recent Title', 'Recent Artist', 'Recent Album'];
const headerRow2 = document.createElement('tr');
headers2.forEach(header => {
  const th2 = document.createElement('th');
  th2.textContent = header;
  headerRow2.appendChild(th2);
});

recentTable.appendChild(headerRow2);
  // Create table rows for recent tracks
  recentTracks.forEach(track => {
    const row2 = document.createElement('tr');
    row2.innerHTML = `
      <td>${track.title}</td>
      <td>${track.artist}</td>
      <td>${track.album}</td>
    `;
    recentTable.appendChild(row2);
  });

// recent table
const outputDiv2 = document.getElementById('recentTable');
outputDiv2!.innerHTML = '';
outputDiv2!.appendChild(recentTable);
}

/// Populates the HTML elements for the Profile information
function populateUI(profile: any) {
    document.getElementById("displayName")!.innerText = profile.display_name;
    if (profile.images[0]) {
        const profileImage = new Image(200, 200);
        profileImage.src = profile.images[0].url;
        document.getElementById("avatar")!.appendChild(profileImage);
    }
    document.getElementById("id")!.innerText = profile.id;
    document.getElementById("email")!.innerText = profile.email;
    document.getElementById("uri")!.innerText = profile.uri;
    document.getElementById("uri")!.setAttribute("href", profile.external_urls.spotify);
    document.getElementById("url")!.innerText = profile.href;
    document.getElementById("url")!.setAttribute("href", profile.href);
    document.getElementById("imgUrl")!.innerText = profile.images[0]?.url ?? '(no profile image)';
}

interface matchTrack {
  title: string;
  artist: string;
  album: string;
}

function findMatches(topTracks: matchTrack[], recentTracks: matchTrack[]): matchTrack[] {
  const commonTracks: matchTrack[] = [];
  topTracks.forEach((topTrack) => {
    const isMatch = recentTracks.some(
      (recentTrack) => recentTrack.title === topTrack.title && recentTrack.artist === topTrack.artist && recentTrack.album === topTrack.album
    );

    if (isMatch) {
      commonTracks.push(topTrack);
    }
    else (console.log("No Matches"))
  });
  return commonTracks;
}


/// ****************** MAIN CODE *******************

const spotifyLoginButton = document.getElementById('spotify-login-button');
const welcomeMessage = document.getElementById('landing-page');
spotifyLoginButton!.addEventListener('click', async () => {
  console.log("CLICK")
  console.log(code);
  await redirectToAuthCodeFlow(clientId);
  const accessToken = await getAccessToken(clientId, code!);
  const profile = await fetchProfile(accessToken);
  if (profile) {
    // Remove the login button
    spotifyLoginButton!.remove();
    welcomeMessage!.remove();

  }
  populateUI(profile);
  const tables = await fetchRecentTrack(accessToken);
  console.log(tables);
  buildTables(tables.topTracks, tables.recentTracks);
  const match = findMatches(tables.topTracks, tables.recentTracks);
  console.log(match);
});

if (!code) {
  // Display the login button
  document.body.appendChild(spotifyLoginButton!);
} else {
  // Code is already present, execute the other functions directly
  await executeMainFlow();
}

async function executeMainFlow() {
  const accessToken = await getAccessToken(clientId, code!);
  const profile = await fetchProfile(accessToken);
  if (profile) {
    // Remove the login button
    spotifyLoginButton!.remove();
    welcomeMessage!.remove();
  }
  populateUI(profile);
  const tables = await fetchRecentTrack(accessToken);
  console.log(tables);
  buildTables(tables.topTracks, tables.recentTracks);
  const match = findMatches(tables.topTracks, tables.recentTracks);
  console.log(match);
}
