export const Account = {
	loginWithPassword(username: string, password: string): Promise<void> {
		return window
			.fetch('/api/login', {
				method: 'POST',
				credentials: 'same-origin',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username, password }),
			})
			.then(r => r.json())
			.then(json => {
				if (json.status === 'success') {
					return;
				}

				throw new Error();
			});
	},
};
