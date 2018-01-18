


function track(action): void {
	switch (action.type) {
		case "LOGGED_IN":
			console.log(">>>>>Track::LOGGED_IN - ", action);
			break;
		default:
			console.log(">>>>>Track::default - ", action);
			break;
	}
}

module.exports = track;