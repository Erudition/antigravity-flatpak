const { execSync } = require('child_process');

function getChangelog(targetVersion) {
    try {
        const bundleName = execSync('curl -s -A "Mozilla/5.0" --compressed https://antigravity.google/ | grep -oE "main-[A-Z0-9]+\\.js"', { encoding: 'utf8' }).trim();
        const bundleUrl = `https://antigravity.google/${bundleName}`;
        const jsContent = execSync(`curl -s -A "Mozilla/5.0" --compressed ${bundleUrl}`, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });

        // Use a more liberal regex to find the section matching our version
        // We look for something like {version:"1.19.6...",description:"...",accordion:{...}}
        const escapedVersion = targetVersion.replace(/\./g, '\\.');
        const sectionRegex = new RegExp(`\\{version:"${escapedVersion}[^"]*",description:"([^"]*)",accordion:\\{changes:"([^"]*)",items:\\[(.*?)\\]\\}\\}`, 's');
        
        const match = jsContent.match(sectionRegex);
        if (!match) return `No official notes found for version ${targetVersion}`;

        const [_, description, changes, itemsJson] = match;

        let markdown = `### ${description}\n\n`;
        const cleanHtml = (str) => str.replace(/<br>/g, '\n').replace(/\\\\"/g, '"').replace(/<\/?[^>]+(>|$)/g, "");
        
        markdown += `${cleanHtml(changes)}\n\n`;

        // Parse items manually since they are minified JS objects
        // items look like: [{title:"Improvements",accordion_items:[{text:"..."}]},{title:"Fixes",...}]
        const itemRegex = /\{title:"([^"]*)",accordion_items:\[(.*?)\]\}/g;
        let itemMatch;
        while ((itemMatch = itemRegex.exec(itemsJson)) !== null) {
            const title = itemMatch[1];
            const listContent = itemMatch[2];
            const bulletRegex = /\{text:"([^"]*)"\}/g;
            let bulletMatch;
            let bullets = [];
            while ((bulletMatch = bulletRegex.exec(listContent)) !== null) {
                bullets.push(bulletMatch[1]);
            }
            if (bullets.length > 0) {
                markdown += `**${title}:**\n`;
                bullets.forEach(b => markdown += `- ${cleanHtml(b)}\n`);
                markdown += '\n';
            }
        }

        return markdown.trim();
    } catch (err) {
        console.error('Scraper error:', err.message);
        process.exit(1);
    }
}

const version = process.argv[2] || '1.19.6';
console.log(getChangelog(version));
