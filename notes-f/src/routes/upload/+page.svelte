<script>
	export let form;
	import { FileDropzone } from '@skeletonlabs/skeleton';
	import { toastStore } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';
	import { API_BASEURL } from '$lib/api';

	let files;

	// Form variables
	let name = 'Raspace';
	let university = 'Tribhuvan University';
	let subjectCode = 'ECO29';
	let courseTitle = '';

	const submitHandler = async (e) => {
		if (
			name != '' &&
			university != '' &&
			subjectCode != '' &&
			courseTitle != '' &&
			files != undefined &&
			files[0].type == 'application/pdf'
		) {
			const formData = new FormData(e.target);
			const res = await fetch(API_BASEURL + 'api/note', {
				method: 'POST',
				body: formData
			});
			const resData = await res.json();
			if (res.status === 200) {
				goto('/');
				const toast = {
					message: 'Notes uploaded successfully',
					timeout: 5000,
					background: 'variant-filled-success'
				};
				toastStore.trigger(toast);
			} else {
				const toast = {
					message: 'Error occured while uploading the notes',
					timeout: 3000,
					background: 'variant-filled-error'
				};
				toastStore.trigger(toast);
			}
		} else {
			const toast = {
				message: 'Please fill all the form inputs',
				timeout: 3000,
				background: 'variant-filled-warning'
			};
			toastStore.trigger(toast);
		}
	};
</script>

<div class="w-full grid justify-items-center">
	<div class="w-1/2">
		<h2 class="h2 my-2">Spread love by sharing notes</h2>

		<form
			on:submit|preventDefault={submitHandler}
			class="my-3"
			method="POST"
			enctype="multipart/form-data"
		>
			<FileDropzone bind:files name="pdf">
				<svelte:fragment slot="lead"
					><svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
						/>
					</svg>
				</svelte:fragment>
				<svelte:fragment slot="message"><b>Upload a file </b>or drag and drop</svelte:fragment>
				<svelte:fragment slot="meta">
					{#if files != undefined}
						1 file selected
					{:else}
						Only PDF allowed
					{/if}</svelte:fragment
				>
			</FileDropzone>
			<label class="label my-1">
				<span>Your Name</span>
				<input
					type="text"
					placeholder="enter your name"
					class="input"
					name="uploader"
					bind:value={name}
					required
				/>
			</label>
			<label class="label my-1">
				<span>University</span>
				<input
					type="text"
					placeholder="enter university"
					class="input"
					name="university"
					bind:value={university}
					required
				/>
			</label>
			<label class="label my-1">
				<span>Subject Code</span>
				<input
					type="text"
					placeholder="enter subject code"
					class="input"
					name="courseID"
					bind:value={subjectCode}
					required
				/>
			</label>
			<label class="label my-1">
				<span>Subject Title</span>
				<input
					type="text"
					placeholder="enter subject name"
					class="input"
					name="courseTitle"
					bind:value={courseTitle}
					required
				/>
			</label>
			<button type="submit" class="my-2 btn variant-filled">Upload</button>
		</form>
	</div>
</div>
