import { NextResponse } from 'next/server'
import { redirect } from 'next/navigation';

export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const isbn = searchParams.get('isbn')


    const requestUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
    console.log(requestUrl);
    const data = await fetch(requestUrl);
    const json = await data.json();
    console.log(json);
    const photoUrl = json.items[0].volumeInfo.imageLinks.thumbnail;
    // photoUrl = photoUrl.replace("zoom=1", "zoom=3");
    console.log(photoUrl);
    redirect(photoUrl);
}