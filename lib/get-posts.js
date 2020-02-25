const fetch = require( 'node-fetch' );
const log = require( './log' );

/**
 * retrive all posts from the WordPress Rest Api
 * @param {String} url url of the WordPress site
 */
async function getPosts( url ) {

    const postsUrl = `${url}/?rest_route=/wp/v2/posts/&per_page=100`;
       
	const posts = await fetch( postsUrl )
        .then( async function( response ) {
            
            // bail out when the resoponse status code isn't in the 200 range
            if ( ! response.ok ) {
                const { message, code, data: {status} } = await response.json();
                throw `${status} - ${message}`;
            }

            // get total amount of pages
            const pages = response.headers.get( 'x-wp-totalpages' );

            // load posts on all pages
            return await loadMore( pages );
            }
        );

	/**
     * load posts from paginated rest routes
     * @param {Integer} pages Number of pages in the rest response
     */
	async function loadMore( pages ) {

        if ( Number.isNaN( pages ) ) {
            throw `The parameter pages needs to be an integer. Currently it's ${pages}`;
        }

        log.info( ' ' );

        if ( 1 == pages ) {
            log.info( `Loading Posts:` );
        } 
        
        if ( 1 < pages ) {
            log.info( `Loading Posts from ${pages} pages:` );
        }

        const posts = await new Promise( async (resolve, reject) => {

            let posts = [];
            // Loop all pages, which was counted from the first REST API fetch.
            for ( let page = 1; page <= pages; page++ ) {
                
                const allPosts = await fetch( `${postsUrl}&page=${page}` ).then( response => response.json() ).catch( error => reject( error ) );

                log.info( ` - Page ${page} loaded` );

                posts=[ ...posts, ...allPosts ];

                if ( page == pages ) {

                    log.success( `all posts are loaded` );

                    resolve( posts );
                }
            }
        } );
        
        return posts;
    }
    
    return posts;
    
};

module.exports = getPosts;