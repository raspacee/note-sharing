<script>
	export let data;
	import Time from 'svelte-time';
	import { Paginator } from '@skeletonlabs/skeleton';
	import { API_BASEURL } from '$lib/api';
	import { page } from '$app/stores';
	import { toastStore } from '@skeletonlabs/skeleton';

	const courseID = $page.url.searchParams.get('courseID');

	const Options = {
		NEWEST: 0,
		MOST_LIKED: 1,
		OLDEST: 2
	};

	let sortValue = Options.NEWEST;
	let items = data.items;

	let paginator = {
		offset: 0,
		limit: 4,
		size: data.totalLength,
		amounts: [4]
	};

	// const sortHandler = (e) => {
	// 	sortItems(e.target.value);
	// };

	// const sortItems = (option) => {
	// 	if (option == Options.OLDEST) {
	// 		items = items.sort((a, b) => {
	// 			if (new Date(a.createdDate).getTime() < new Date(b.createdDate).getTime()) {
	// 				return -1;
	// 			} else {
	// 				return 1;
	// 			}
	// 		});
	// 	}
	// 	if (option == Options.NEWEST) {
	// 		items = items.sort((a, b) => {
	// 			if (new Date(a.createdDate).getTime() < new Date(b.createdDate).getTime()) {
	// 				return 1;
	// 			} else {
	// 				return -1;
	// 			}
	// 		});
	// 	}

	// 	if (option == Options.MOST_LIKED) {
	// 		items = items.sort((a, b) => {
	// 			if (a.upvotes.length > b.upvotes.length) {
	// 				return -1;
	// 			} else if (a.upvotes.length < b.upvotes.length) {
	// 				return 1;
	// 			} else {
	// 				return 0;
	// 			}
	// 		});
	// 	}
	// };

	// sortItems(Options.NEWEST);

	const pageHandler = async () => {
		const res = await fetch(
			`${API_BASEURL}api/notes/${courseID}?p=${paginator.offset}&sort=${sortValue}`
		);
		const data = await res.json();
		items = data.results;
	};

	const voteHandler = async (e, noteID, voteChoice) => {
		e.preventDefault();
		const body = {
			noteID: noteID,
			choice: voteChoice
		};
		const res = await fetch(`${API_BASEURL}api/note`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		});
		const data = await res.json();
		if (res.status == 200) {
			const toast = {
				message: data.message,
				timeout: 3000,
				background: 'variant-filled-success'
			};
			toastStore.trigger(toast);
		} else {
			const toast = {
				message: data.error,
				timeout: 3000,
				background: 'variant-filled-error'
			};
			toastStore.trigger(toast);
		}
	};
</script>

<div class="w-1/5 px-4 my-2">
	<label class="label">
		<span>Sort by</span>
		<select class="select" bind:value={sortValue} on:change={pageHandler}>
			<option value={Options.NEWEST}>Newest first</option>
			<option value={Options.MOST_LIKED}>Most liked</option>
			<option value={Options.OLDEST}>Oldest first</option>
		</select>
	</label>
</div>
<div class="my-4 mx-4 grid grid-cols-2 gap-4">
	{#if data.items.length === 0}
		<h3>
			Sorry, PDF's for that course are not available. You can start by posting notes for that :)
		</h3>
	{:else}
		{#each items as item}
			<a href="/search/note?noteID={item._id}" class="block card card-hover p-4">
				<header class="card-header">
					Uploaded by {item.uploader}, <Time relative timestamp={item.createdDate} />
				</header>
				<section class="p-4">
					<h3 class="h3">{item.courseTitle}</h3>
					<p>{item.university}</p>
				</section>
				<footer class="card-footer w-1/6 flex justify-evenly">
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div
						class="upvote-btn ${item.upvotes.contains({ by: event.clientAddress })}"
						on:click={(e) => voteHandler(e, item._id, 'UPVOTE')}
					>
						<svg
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
								d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
							/>
						</svg>
						<p>39</p>
					</div>

					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div class="downvote-btn" on:click={(e) => voteHandler(e, item._id, 'DOWNVOTE')}>
						<svg
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
								d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384"
							/>
						</svg>
						<p>4</p>
					</div>
				</footer>
			</a>
		{/each}
	{/if}
</div>
{#if data.items.length !== 0}
	<Paginator bind:settings={paginator} on:page={pageHandler} showNumerals select="hidden" />
{/if}

<style>
	.card {
		width: 40rem;
	}

	.upvote-btn:hover {
		color: rgb(23, 175, 23);
	}

	.downvote-btn:hover {
		color: red;
	}
</style>
