const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const log = require( './log' );


class Webpage {
    static async generatePDF( {
        url, 
        slug, 
        outputPath = process.cwd(), 
        format = 'A4',
        scale = 1,
        landscape = false,
    }) {
        const browser = await puppeteer.launch({ headless: true }); // Puppeteer can only generate pdf in headless mode.
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' }); // Adjust network idle as required. 
        
        const pdfConfig = {
            landscape: landscape,
            path: path.resolve( outputPath , 'pdf' ,`${slug}.pdf` ), // Saves pdf to disk. 
            format: format,
            printBackground: true,
            scale: parseFloat( scale ),
        };

        const outputFolder =  path.resolve( outputPath, 'pdf' );
        if ( ! fs.existsSync(outputFolder) ) {
            fs.mkdirSync( outputFolder ) 
        };

        await page.emulateMediaType( 'screen' );
        
        await page.pdf(pdfConfig); // Return the pdf buffer. Useful for saving the file not to disk. 

        await browser.close();

        return ` - ${url}`;
    }
}

module.exports = Webpage;