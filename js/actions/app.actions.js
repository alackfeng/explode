

// app action type 
export const DO_STUFF 		= 'DO_STUFF';
export const GET_RANDOM 	= 'GET_RANDOM';
export const SET_APP_READY 	= 'SET_APP_READY';
export const SET_APP_LOCALE	= 'SET_APP_LOCALE';

/*
// app relation action call
app 相关全局设置存储在本地上，
*/

export function setAppReady() {
	return {
		type: SET_APP_READY,
		appReady: true,
	};
}

export function setAppLocale(locale) {
	return {
		type: SET_APP_LOCALE,
		locale: locale || 'en',
	}
}

// some test
export function getRandomNumber() {
  return {
    type: GET_RANDOM,
    payload: {
      random: Math.floor(Math.random() * 1e6),
    },
  };
}

export function doSomeStuff() {
  return {
    type: DO_STUFF,
    payload: {
      stuff: 2 + 2,
    },
  };
}




