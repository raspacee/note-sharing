<script>
	let courseID = '';

	const validateInput = (e) => {
		if (courseID === '') {
			e.preventDefault();
		}
	};
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-5">
		<h1 class="h1">NOTES</h1>

		<form method="GET" action="/search" on:submit={validateInput}>
			<input
				bind:value={courseID}
				class="input"
				title="Input (text)"
				type="text"
				placeholder="enter course ID"
				name="courseID"
			/>
			<button type="submit" class="btn variant-filled my-4"> Search </button>
		</form>

		<blockquote class="blockquote">
			<h2 class="h2">How to use</h2>
			Every course/subject has a unique ID.<br />
			View your course/subject ID through your university website or by internet. <br />
			Copy the ID and paste it above.
		</blockquote>
		<h2 class="h2">Other links</h2>
		<ol class="breadcrumb">
			<li class="crumb"><a class="anchor" href="/upload">Upload</a></li>
			<li class="crumb-separator" aria-hidden>/</li>
			<li class="crumb"><a class="anchor" href="/about">About</a></li>
		</ol>
	</div>
</div>
