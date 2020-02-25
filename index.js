const fetch = require( 'node-fetch' );
const program = require('commander');
const { version } = require( './package.json' );
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

program
.version( version )
    .name('posts-to-pdf')
    .arguments('[url]')
    .option('-d, --debug', 'output extra debugging')
    .option('-o, --output', 'folder where the pdf`s should be saved', './')
    .option('-f, --format <sting>', 'PDF Format size', 'A4')
    .action( async function( url , { debug, output, format } ) {

        // debuging
        if (debug) console.log(program.opts());

        try {
            const posts = await getPosts( url );

            console.info( "Generated PDF's:" );
            await posts.forEach( async function({ link, slug }) {
                
                console.log ( await Webpage.generatePDF( {
                    url: link, 
                    slug, 
                    format: format 
                }) );
            
            } );


        } catch ( error ) {
            console.error( error )
        }
    } )
    .on( '--help', function() {
		console.info( '' );
		console.info( 'Examples:' );
		console.info( `  $ ${ commandName }` );
		console.info( `  $ ${ commandName } todo-list` );
		console.info( `  $ ${ commandName } --template es5 todo-list` );
	} )
    .parse(process.argv);


async function getPosts( url ) {

    const postsUrl = `${url}/wp-json/wp/v2/posts?per_page=100`;
       
	const posts = await fetch( postsUrl )
        .then( async function( response ) {
            const pages = response.headers.get( 'x-wp-totalpages' );
            
            if ( response.ok ) {
                return await loadMore( pages );
            }
            throw new TypeError( 'Oops, the format is not JSON.' );
            }
        );

	// Load contact info, 100 posts at one time.
	async function loadMore( pages ) {

        const posts = await new Promise( async (resolve, reject) => {

            let posts = [];
            // Loop all pages, which was counted from the first REST API fetch.
            for ( let page = 1; page <= pages; page++ ) {
                
                const allPosts = await fetch( `${postsUrl}&page=${page}` ).then( response => response.json() );
                posts=[ ...posts, ...allPosts ];

                if ( page == pages ) {
                    resolve( posts );
                }
            }
        } );
        
        return await posts;
    }
    
    return posts;
    
}


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

module.exports = program;