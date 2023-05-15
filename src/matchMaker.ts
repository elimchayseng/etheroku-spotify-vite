interface matchTrack {
    title: string;
    artist: string;
    album: string;
  }
  
export function findMatches(topTracks: matchTrack[], recentTracks: matchTrack[]): matchTrack[] {
    const commonTracks: matchTrack[] = [];
    topTracks.forEach((topTrack) => {
      const isMatch = recentTracks.some(
        (recentTrack) => recentTrack.title === topTrack.title && recentTrack.artist === topTrack.artist && recentTrack.album === topTrack.album
      );
  
      if (isMatch) {
        commonTracks.push(topTrack);
      }
      else (console.log("Not a match"))
    });
  
    // HERE ARE THE MATCHES
    console.log(commonTracks);
    
  // CONVERT MATCHES TO JSON STRING
    const database_commonTracks = JSON.stringify(commonTracks);
    console.log(database_commonTracks);
  // 
    const hashes = createHashes(database_commonTracks);
    console.log(hashes);
  
    interface Track {
      title: string;
      artist: string;
      album: string;
    }
  
    function createHashes(json: string): Record<string, Track> {
      const data: Track[] = JSON.parse(json);
      const user = "rowdyDEVroadtrip"
      const hashes: Record<string, Track> = {};
      let counter = 1;
  
      data.forEach((track) => {
        
        const hash = `match${user}_${counter}`;
        hashes[hash] = track;
        counter++; 
      });
      return hashes;
    }
  
    return commonTracks;
  }
  