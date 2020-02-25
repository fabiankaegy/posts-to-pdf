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
    .option('-s, --scale <float>', 'scale of the webpage', 1.0)
    .option('-t, --post-type <string>', 'post-type', 'posts')
    .option('-l, --landscape <boolean>', 'generate landscape pdf', false)
    .option('-f, --format <sting>', 'PDF Format size', 'A4')
    .action( async function( url , { debug, output, format, scale, postType } ) {

        // debuging
        if (debug) log.info(program.opts());

        try {
            const posts = await getPosts( url, postType );

            log.info( " " );
            log.info( `Generating PDF's for ${posts.length} posts:` );

            for (var index = 0; index < posts.length; index++) { 

                const { link, slug } = posts[index];
                const pdf = await Webpage.generatePDF( {
                    url: link, 
                    slug, 
                    format: format,
                    outputPath: output || process.cwd(),
                    scale: scale,
                });

                log.success( pdf );
            
            };

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

