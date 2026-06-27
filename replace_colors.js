const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            if (!file.includes('node_modules') && !file.includes('.next') && !file.includes('.git') && !file.includes('.expo')) {
                results = results.concat(walk(file));
            }
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css') || file.endsWith('.js') || file.endsWith('.json')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files1 = walk('d:/code file/couup');
const files2 = walk('d:/code file/couup-app');
const allFiles = [...files1, ...files2];

let changedFiles = 0;

allFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Special case for ListingCard.tsx
    if (file.includes('ListingCard.tsx')) {
        content = content.replace(/bg-\\[#FFFFFF\\]/g, 'bg-[#F97316]');
        content = content.replace('hover:bg-[#FFFFFF]/90', 'hover:bg-[#F97316]/90');
        // change text-[#F97316] to text-white for this specific button
        content = content.replace(/text-\\[#F97316\\] rounded-md py-2/g, 'text-white rounded-md py-2');
    }

    // Special case for BecomeHostClient.tsx selected card styles
    if (file.includes('BecomeHostClient.tsx')) {
        content = content.replace(/border-\\[#FFFFFF\\]/g, 'border-[#F97316]');
        content = content.replace(/shadow-\\[0_0_0_1px_#FFFFFF\\]/g, 'shadow-[0_0_0_1px_#F97316]');
        // There are some bg-[#FFFFFF] progress bars or buttons here too?
        // Let's change the continue button at the end:
        content = content.replace(/bg-\\[#FFFFFF\\] text-\\[#F97316\\]/g, 'bg-[#F97316] text-white');
    }

    if (file.includes('HostEmailVerification.tsx')) {
        content = content.replace(/bg-\\[#FFFFFF\\] text-\\[#F97316\\]/g, 'bg-[#F97316] text-white');
    }

    if (file.includes('ListingReservation.tsx')) {
        // bg-[#F97316] hover:bg-[#EA580C] text-[#FFFFFF] 
        // This will be handled by the general replace correctly.
    }

    // General Teal -> Orange
    content = content.replace(/#F97316/gi, '#F97316');
    content = content.replace(/249, 115, 22/gi, '249, 115, 22'); // rgba
    content = content.replace(/#EA580C/gi, '#EA580C'); // darker teal -> darker orange
    content = content.replace(/#EA580C/gi, '#EA580C');
    content = content.replace(/#F97316/gi, '#F97316');

    // General Gold -> White
    content = content.replace(/#FFFFFF/gi, '#FFFFFF');
    content = content.replace(/#F3F4F6/gi, '#F3F4F6');
    content = content.replace(/#F3F4F6/gi, '#F3F4F6');
    content = content.replace(/#F3F4F6/gi, '#F3F4F6');
    
    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        changedFiles++;
        console.log(`Updated: ${file}`);
    }
});

console.log(`Total files updated: ${changedFiles}`);
