<script>
	export let data;

	import { API_BASEURL } from '$lib/api';
	import Time from 'svelte-time';

	let pdfURL;

	data = data.data;

	const fetchPDF = async () => {
		const res = await fetch(`${API_BASEURL}api/note/pdf/${data.file}`);
		const blob = await res.blob();
		pdfURL = URL.createObjectURL(blob);
	};

	fetchPDF();
</script>

<div
	class="container mx-auto h-full grid gap-4 grid-cols-3 grid-rows-1 justify-items-center items-center"
>
	<div class="c">
		<h2 class="h2">Course ID: {data.courseID}</h2>
		<h3 class="h3">Course Title: {data.courseTitle}</h3>
		<h4 class="h4">{data.university}</h4>
		<blockquote class="blockquote my-4">
			<h4 class="h3">Uploaded by {data.uploader}</h4>
			<Time timestamp={data.createdDate} format="D MMM, YYYY" />
		</blockquote>
		<div class="actions my-4">
			<a href={pdfURL} download type="button" class="btn variant-ghost-success">Download</a>
			<a href={pdfURL} type="button" target="_blank" class="btn variant-ghost-primary"
				>Open in new tab</a
			>
		</div>
	</div>

	<div class="col-span-2 h-full w-full">
		<embed src={pdfURL} type="application/pdf" width="90%" height="100%" />
	</div>
</div>
