/// generic parameters 
const clientId = "f3ab9fbdd61342c0b05ff2e4d1d7a5e9";
const params = new URLSearchParams(window.location.search);
const code = params.get("code");



import { buildTables } from './tableUtils';
import {getAccessToken, redirectToAuthCodeFlow} from './authUtils';
import {fetchProfile, populateUI} from './profileFinder';
import {fetchTracks} from './trackFetcher';
import {findMatches} from './matchMaker'; 

// Landing Page Elements

const spotifyLoginButton = document.getElementById('spotify-login-button');
const welcomeMessage = document.getElementById('landing-page');

// Check-Login
if(!code){
// Button to Request User Information if none exists - runs authentication flow, and populates the User field in the UI, then removes the landing page HTML 
spotifyLoginButton!.addEventListener('click', async () => {
  await executeAuthFlow();
});
// Run Authorization Flow once button is clicked 
async function executeAuthFlow() {
    //Authorization Flow
    console.log(code);
    await redirectToAuthCodeFlow(clientId);
    const accessToken = await getAccessToken(clientId, code!);
    localStorage.setItem('accessToken', accessToken)
}
// ****** POPULATE THE PAGE ****** 
} else {
  // Get Token again to pass to the API 
   const accessToken = await getAccessToken(clientId, code!);
    // Profile Grabber
    const profile = await fetchProfile(accessToken);
    // Build the Profile UI
    populateUI(profile);
    // Get the Data for Top and Recent Tracks 
    const tables = await fetchTracks(accessToken);  
    // Build the HTML Tables for Top and Recent Tracks 
    buildTables(tables.topTracks, tables.recentTracks);
   // Find the Matches Between the two tables 
    const match = findMatches(tables.topTracks, tables.recentTracks);
    console.log(match);
    if(match){
      const matchElement = document.getElementById('match-element');
      matchElement!.textContent = JSON.stringify(match);
    } else { 
      const matchElement = document.getElementById('match-element');
      matchElement!.textContent = "You haven't listened to any of your top songs today";
  }
  // Remove Landing Page Stuff
  spotifyLoginButton!.remove();
  welcomeMessage!.remove();
}
