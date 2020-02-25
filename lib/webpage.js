const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');


class Webpage {
    static async generatePDF( {
        url, 
        slug, 
        outputPath = process.cwd(), 
        format = 'A4'
    }) {
        const browser = await puppeteer.launch({ headless: true }); // Puppeteer can only generate pdf in headless mode.
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' }); // Adjust network idle as required. 
        
        const pdfConfig = {
            path: path.resolve( outputPath , 'pdf' ,`${slug}.pdf`), // Saves pdf to disk. 
            format: format,
            printBackground: true,
        };

        const outputFolder =  path.resolve( outputPath, 'pdf' );
        if ( ! fs.existsSync(outputFolder) ) {
            fs.mkdirSync( outputFolder ) 
        };

        await page.emulateMedia('screen');
        
        await page.pdf(pdfConfig); // Return the pdf buffer. Useful for saving the file not to disk. 

        await browser.close();

        return ` - ${url}`;
    }
}

module.exports = Webpage;