/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'covers.openlibrary.org',
            'localhost',
            'books.google.com',
            process.env.NEXT_PUBLIC_DOMAIN,
        ]
    }
}

module.exports = nextConfig
