/// Get the most recent 30 played tracks
export async function fetchTracks(token: string): Promise<{ topTracks: any[], recentTracks: any[] }> {

    // Get the current date
    const currentDate = new Date();
    // Set the time to midnight
    currentDate.setHours(0, 0, 0, 0);
    // Get the UNIX timestamp for midnight of the current date
    const timestamp = Math.floor(currentDate.getTime() / 1000);
    console.log(timestamp);
    
    
      const result = await fetch(`https://api.spotify.com/v1/me/player/recently-played?limit=50`, {
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
    
      console.log(recentTracks);
    return { topTracks, recentTracks };
    } 