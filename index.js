const fetch = require( 'node-fetch' );
const program = require('commander');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

program
  .requiredOption('-u, --url <string>', 'Url of the WordPress Site needs to be set')
  .option('-d, --debug', 'output extra debugging')
  .option('-o, --output', 'folder where the pdf`s should be saved', './')
  .option('-f, --format <sting>', 'PDF Format size', 'A4');

async function main() {

    program.parse(process.argv);

    // debuging
    if (program.debug) console.log(program.opts());

    try {
        const posts = await getPosts( program.url );

        console.info( "Generated PDF's:" )
        posts.forEach( async ({link, slug}) => {
            
            console.log ( await Webpage.generatePDF( link, slug ) );
        
        } );


    } catch ( error ) {
        console.error( error )
    }
}

main();
 



async function getPosts ( url ) {

    const postsUrl = `${url}/wp-json/wp/v2/posts?per_page=99`;

    return await fetch( postsUrl ).then( response => {
        if ( ! response.ok ) {
            throw response.json();
        }
        return response.json();
    } )
}


class Webpage {
    static async generatePDF(url, slug, outputPath = process.cwd(),  format = 'A4') {
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

module.exports = program;