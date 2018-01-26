
export const getUser = (state, login) => {
	let user = {};
	//console.log("---------------------accounts ", state.app.accounts);
	user = state.app.accounts.filter(obj => { 
		//console.log("---------------------account ", obj);
		return (obj.username === login); 
	}); 
	//console.log("---------------------account ", user);
	return { user };
};
export const getRepo = (state, fullName) => state.entities.repos[fullName]
export const getStarredByUser = (state, login) => state.pagination.starredByUser[login] || {}
export const getStargazersByRepo = (state, fullName) => state.pagination.stargazersByRepo[fullName] || {}
