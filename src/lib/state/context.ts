import { getContext } from 'svelte';
import type { AppState } from './app-state.svelte';

const APP_STATE_KEY = Symbol('app-state');

export function getAppState(): AppState {
	return getContext<AppState>(APP_STATE_KEY);
}

export { APP_STATE_KEY };
