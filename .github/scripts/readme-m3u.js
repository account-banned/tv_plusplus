const fs = require('fs');
const path = require('path');

function updateReadme(m3uPath) {
    // Get directories for both types of groups
    const countriesDir = path.join(path.dirname(m3uPath), 'groups');
    const groups = {
        countries: {}
    };
    
    // Read the main M3U to get original group names and channel counts
    const content = fs.readFileSync(m3uPath, 'utf8');
    const lines = content.split('\n');
    let totalChannels = 0;
    
    lines.forEach(line => {
        if (line.startsWith('#EXTINF')) {
            totalChannels++;
            const groupMatch = line.match(/group-title="([^"]*)"/);
            const groupTitle = groupMatch ? groupMatch[1] : 'Unknown';
            groups.countries[groupTitle] = (groups.countries[groupTitle] || 0) + 1;
        }
    });

    // Build README content
    let readmeContent = '# Accountbanned TV++\n\n';
    
    // Add description and features
    readmeContent += '## About\n\n';
    readmeContent += 'Accountbanned TV++ provides a collection of IPTV channels. ';
    readmeContent += 'The channels are organized in groups for easy access.\n\n';

    // Add usage section
    readmeContent += '## Usage\n\n';
    readmeContent += '1. **Complete Playlist**: Use the main `accountbanned_tv++.m3u` file for access to all channels\n';
    readmeContent += '2. **Group-Specific**: Individual group playlists are available in the `groups/` directory\n\n';

    // Add statistics
    readmeContent += '## Statistics\n\n';
    readmeContent += `- Total Channels: ${totalChannels}\n`;
    readmeContent += `- Groups Available: ${Object.keys(groups.countries).length}\n\n`;

    // Add playlists table
    readmeContent += '## Available Playlists\n\n';
    readmeContent += '| Playlist | Channels | Link |\n';
    readmeContent += '|----------|-----------|------|\n';
    
    // Add main playlist
    const mainPlaylistName = path.basename(m3uPath);
    readmeContent += `| **Complete (All channels)** | ${totalChannels} | [${mainPlaylistName}](${mainPlaylistName}) |\n`;
    
    // Add countries
    readmeContent += '| **───────── Groups ─────────** | | |\n';
    const sortedCountryGroups = Object.entries(groups.countries).sort((a, b) => a[0].localeCompare(b[0]));
    sortedCountryGroups.forEach(([groupName, channelCount]) => {
        const safeGroupName = groupName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        readmeContent += `| ${groupName} | ${channelCount} | [${safeGroupName}.m3u](groups/${safeGroupName}.m3u) |\n`;
    });

    // Add note about legal usage
    readmeContent += '## Legal Notice\n\n';
    readmeContent += 'This playlist is a collection of publicly available IPTV streams. ';
    readmeContent += 'Please check your local laws regarding IPTV streaming before using this playlist.\n';
    
    const readmePath = path.join(path.dirname(m3uPath), 'README.md');
    fs.writeFileSync(readmePath, readmeContent);
    console.log('README.md has been updated with comprehensive playlist information');
}

const filePath = process.argv[2];
if (!filePath) {
    console.error('Please provide the path to accountbanned_tv++.m3u');
    process.exit(1);
}

try {
    updateReadme(filePath);
} catch (error) {
    console.error('Error updating README:', error.message);
    process.exit(1);
}
