import { NextResponse } from 'next/server'

export async function GET() {
    const json = await fetch(process.env.DB_URL, {
        next: {
            revalidate: 5
        }
    });
    const data = await json.json();
    return NextResponse.json(data);

}