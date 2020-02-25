const program = require( 'commander' );
const { version } = require( '../package.json' );
const log = require( './log' );
const getPosts = require( './get-posts' );
const Webpage = require( './webpage' );

const commandName = 'posts-to-pdf';

program
    .version( version )
    .name( commandName )
    .arguments('[url]')
    .option('-d, --debug', 'output extra debugging')
    .option('-o, --output <string>', 'folder where the pdf`s should be saved', './')
    .option('-f, --format <sting>', 'PDF Format size', 'A4')
    .action( async function( url , { debug, output, format } ) {

        // debuging
        if (debug) log.info(program.opts());

        try {
            const posts = await getPosts( url );

            log.info( " " );
            log.info( `Generating PDF's for ${posts.length} posts:` );
            await posts.forEach( async function({ link, slug }) {
                
                log.success( await Webpage.generatePDF( {
                    url: link, 
                    slug, 
                    format: format,
                    outputPath: output || process.cwd(),
                }) );
            
            } );


        } catch ( error ) {
            log.error( error )
        }
    } )
    .on( '--help', function() {
		log.info( '' );
		log.info( 'Examples:' );
		log.info( `  $ ${ commandName } https://example.com` );
		log.info( `  $ ${ commandName } https://example.com --format A4 --output ~./pdfs` );
	} )
    .parse(process.argv);

