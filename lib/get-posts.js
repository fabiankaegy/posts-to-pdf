const fetch = require( 'node-fetch' );

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

module.exports = getPosts;