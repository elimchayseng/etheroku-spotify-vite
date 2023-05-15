// Build the HTML Tables from the Track Data 
export function buildTables(topTracks: any[],recentTracks: any[]){
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
    