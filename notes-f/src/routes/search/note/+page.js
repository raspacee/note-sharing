import { API_BASEURL } from '$lib/api';

export async function load({ fetch, url }) {
	const res = await fetch(`${API_BASEURL}api/note/${url.searchParams.get('noteID')}`);
	const json = await res.json();
	if (res.status !== 200) {
		return {
			data: null
		};
	}
	return {
		data: json.note
	};
}
