<script>
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
</script>

<AppShell>
	<svelte:fragment slot="header">
		<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
			<svelte:fragment slot="lead"
				>📚

				<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
					<div class="input-group-shim">Search</div>
					<input type="search" placeholder="Search..." />
					<button class="variant-filled-secondary">Q</button>
				</div>
			</svelte:fragment>
			<h2 class="h2">NOTES</h2>
			<svelte:fragment slot="trail">
				<a href="/">Home</a>
				<a href="#">About Us</a>
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
