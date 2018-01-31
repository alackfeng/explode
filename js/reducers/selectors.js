
export const getUser = (state, login) => {
	if(!state || !login) {
		return {};
	}
	const user = state.app.authAccounts.filter(obj => { 
		return (obj.username === login); 
	});
	return { user };
};
export const getRepo = (state, fullName) => state.entities.repos[fullName]
export const getStarredByUser = (state, login) => state.pagination.starredByUser[login] || {}
export const getStargazersByRepo = (state, fullName) => state.pagination.stargazersByRepo[fullName] || {}
