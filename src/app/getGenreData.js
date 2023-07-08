export default async function getGenreData() {
    const json = await fetch(`${props.env.NEXT_PUBLIC_URL}/api/listData`, {
        next: {
            revalidate: 60 * 10
        }
    });
    const data = await json.json();
    return data;
}
