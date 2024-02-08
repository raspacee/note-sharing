import { API_BASEURL } from '$lib/api';

export async function load({ fetch, url }) {
	const res = await fetch(API_BASEURL + `api/notes/${url.searchParams.get('courseID')}`);
	if (res.status !== 200) {
		return { items: [] };
	}
	const data = await res.json();

	return { items: data.results, totalLength: data.total };
}
