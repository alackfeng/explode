
"use strict";

import { testMenuEnabled } from "../env"; 

function warn(error) {
	if(testMenuEnabled) {
		console.warn(error.message || error);
	} // only log promise failures when debug menu is enabled
	throw error; // To let the caller handle the rejection
}

export default store => next => action =>
	typeof action.type === "function"
		? Promise.resolve(action).then(next, warn)
		: next(action);