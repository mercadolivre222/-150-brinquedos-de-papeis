const fs = require('fs');
const path = require('path');

const targetFiles = [
    'c:\\Users\\thefo\\OneDrive\\Desktop\\150 brinquedos\\-150-brinquedos-de-papeis\\index.html',
    'c:\\Users\\thefo\\OneDrive\\Desktop\\150 brinquedos\\-150-brinquedos-de-papeis\\+150 brinquedos exclusivos 3D_ – Amo ser Mãe.html'
];

targetFiles.forEach(filePath => {
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${filePath}`);
        return;
    }
    
    console.log(`Cleaning page content in file: ${filePath}`);
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Remove the entire "Olá! Muito prazer! Kit Colorir e Criar" container (id="404e4293")
    const containerRegex = /<div class="elementor-element elementor-element-404e4293[^"]*"[^>]*>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g;
    content = content.replace(containerRegex, '');

    // Backup regex in case structure is slightly different
    const backupContainerRegex = /<div class="elementor-element elementor-element-404e4293[^"]*"[^>]*>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/g;
    content = content.replace(backupContainerRegex, '');

    // Direct string replacement for safety
    content = content.replace(/Olá! Muito prazer![\s\S]*?Tudo isso de forma prática, acessível e com muito carinho! 💛/g, '');

    // Let's remove the actual elementor container for Olá! Muito prazer!
    // The container has class elementor-element-404e4293
    const containerStartIdx = content.indexOf('data-id="404e4293"');
    if (containerStartIdx !== -1) {
        // Find the start of the outer div containing this data-id
        let startPos = content.lastIndexOf('<div', containerStartIdx);
        // Find matching closing div tag for this block
        let openDivs = 1;
        let pos = startPos + 4;
        while (openDivs > 0 && pos < content.length) {
            const nextOpen = content.indexOf('<div', pos);
            const nextClose = content.indexOf('</div>', pos);
            if (nextClose === -1) break;
            if (nextOpen !== -1 && nextOpen < nextClose) {
                openDivs++;
                pos = nextOpen + 4;
            } else {
                openDivs--;
                pos = nextClose + 6;
            }
        }
        if (openDivs === 0) {
            content = content.substring(0, startPos) + content.substring(pos);
            console.log("Successfully removed Olá! Muito prazer! container by DOM balance traversal.");
        }
    }

    // 2. Remove the security seals widget / column (id="033c192" or "eecd6df")
    // Let's find and remove the div containing data-id="033c192" (the security column)
    const securityColIdx = content.indexOf('data-id="033c192"');
    if (securityColIdx !== -1) {
        let startPos = content.lastIndexOf('<div', securityColIdx);
        let openDivs = 1;
        let pos = startPos + 4;
        while (openDivs > 0 && pos < content.length) {
            const nextOpen = content.indexOf('<div', pos);
            const nextClose = content.indexOf('</div>', pos);
            if (nextClose === -1) break;
            if (nextOpen !== -1 && nextOpen < nextClose) {
                openDivs++;
                pos = nextOpen + 4;
            } else {
                openDivs--;
                pos = nextClose + 6;
            }
        }
        if (openDivs === 0) {
            content = content.substring(0, startPos) + content.substring(pos);
            console.log("Successfully removed Security Seals column by DOM balance traversal.");
        }
    }

    // 3. Double check and force all checkout links to the correct URL
    // We want: https://pay.disruptybr.app/c/jb2?of=Lue
    content = content.replace(/href="[^"]*checkout\.php[^"]*"/gi, 'href="https://pay.disruptybr.app/c/jb2?of=Lue"');
    content = content.replace(/href="[^"]*pay\.disruptybr\.app[^"]*"/gi, 'href="https://pay.disruptybr.app/c/jb2?of=Lue"');
    content = content.replace(/href="index\.html"/g, 'href="https://pay.disruptybr.app/c/jb2?of=Lue"');
    content = content.replace(/href="https:\/\/pay\.kiwify\.com\.br[^"]*"/gi, 'href="https://pay.disruptybr.app/c/jb2?of=Lue"');
    content = content.replace(/<a class="botao-comprar" href="[^"]*"/gi, '<a class="botao-comprar" href="https://pay.disruptybr.app/c/jb2?of=Lue"');
    content = content.replace(/<a class="elementor-button elementor-button-link[^"]*" href="[^"]*"/gi, '<a class="elementor-button elementor-button-link elementor-size-md" href="https://pay.disruptybr.app/c/jb2?of=Lue"');

    // 4. Update the pricing card text just in case (to ensure it displays 14,90)
    content = content.replace(/R\$ 18,90/g, 'R$ 14,90');
    content = content.replace(/R\$18,90/g, 'R$14,90');
    content = content.replace(/R\$ 9,90/g, 'R$ 14,90');
    content = content.replace(/R\$9,90/g, 'R$14,90');
    content = content.replace(/R\$ 29,90/g, 'R$ 14,90');
    content = content.replace(/R\$29,90/g, 'R$14,90');

    // 5. Update logo
    content = content.replace(/src="https:\/\/criandoarte\.com\/wp-content\/uploads\/2026\/05\/150-brinquedos-Photoroom-768x175\.png"/g, 'src="./brinca_facil_logo_v2.png"');
    content = content.replace(/src="[^"]*logo[^"]*"/gi, 'src="./brinca_facil_logo_v2.png"');
    content = content.replace(/src="https:\/\/criandoarte\.com\/wp-content\/uploads\/2025\/12\/Captura-de-tela[^"]*"/gi, 'src="./brinca_facil_logo_v2.png"');
    // Replace the base64 embedded "Criando Artes" logo right below "GANHE HOJE"
    content = content.replace(/src="data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAB4CAYAAABIFc8g[^"]*"/g, 'src="./brinca_facil_logo_v2.png"');
    
    // 6. Inject Custom CSS for catchy colors
    const customCSS = `
    <style>
        /* Catchy Colors and Animations injected by automation */
        .botao-comprar, .elementor-button {
            background: linear-gradient(45deg, #ff007f, #ff5e00) !important;
            box-shadow: 0 4px 15px rgba(255, 0, 127, 0.4) !important;
            transition: transform 0.3s ease, box-shadow 0.3s ease !important;
            border: none !important;
            color: #ffffff !important;
            font-weight: bold !important;
        }
        .botao-comprar:hover, .elementor-button:hover {
            transform: scale(1.05) translateY(-3px) !important;
            box-shadow: 0 8px 25px rgba(255, 0, 127, 0.6) !important;
        }
        .elementor-heading-title {
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1) !important;
        }
    </style>
    `;
    content = content.replace('</head>', customCSS + '\n</head>');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Successfully cleaned and updated: ${filePath}`);
});
console.log('Site cleaning completed.');
