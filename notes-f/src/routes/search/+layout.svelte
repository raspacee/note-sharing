<script>
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';

	let searchQuery = '';

	const validateSearch = (e) => {
		if (searchQuery === '') {
			e.preventDefault();
		}
	};
</script>

<AppShell>
	<svelte:fragment slot="header">
		<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
			<svelte:fragment slot="lead"
				>📚

				<form
					method="GET"
					action="/search"
					class="input-group input-group-divider grid-cols-[auto_1fr_auto]"
					on:submit={validateSearch}
				>
					<div class="input-group-shim">Search</div>
					<input name="courseID" bind:value={searchQuery} type="search" placeholder="Search..." />
					<button class="variant-filled-secondary" type="submit">
						<svg
							fill="currentColor"
							xmlns="http://www.w3.org/2000/svg"
							height="1em"
							viewBox="0 0 512 512"
							><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path
								d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
							/></svg
						>
					</button>
				</form>
			</svelte:fragment>
			<h2
				class="h2"
				on:click={() => {
					goto('/');
				}}
			>
				NOTES
			</h2>
			<svelte:fragment slot="trail">
				<a href="/">Home</a>
				<a href="/upload">Upload</a>
				<a href="/about">About Us</a>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- (sidebarLeft) -->
	<!-- (sidebarRight) -->
	<!-- (pageHeader) -->
	<!-- Router Slot -->
	<slot />
	<!-- ---- / ---- -->
	<svelte:fragment slot="pageFooter"
		><div class="grid justify-center"><span>Made with ❤️ by raspace.</span></div></svelte:fragment
	>
	<!-- (footer) -->
</AppShell>

<style>
	.h2:hover {
		cursor: pointer;
	}

	button {
		color: white;
	}
</style>
