export namespace Account {
	export function loginWithPassword(username: string, password: string): Promise<void> {
		return window.fetch('/api/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ username, password }),
			credentials: 'same-origin',
		})
		.then(r => r.json())
		.then((json) => {
			if (json.status === 'success') {
				return;
			}

			throw new Error();
		});
	}
}
