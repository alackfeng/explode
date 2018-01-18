
import { createActionSet } from "../../components";

// setting relation action type
export const SETTINGS									= createActionSet('SETTINGS');
export const SETTINGS_CHANGE 					= createActionSet('SETTINGS_CHANGE');
export const SETTINGS_CURRENTACCOUNT 	= createActionSet('SETTINGS_CURRENTACCOUNT');

// wallet manage
export const WALLET 									= createActionSet('WALLET');
export const WALLET_NEW 							= createActionSet('WALLET_NEW');
export const WALLET_DELETE 						= createActionSet('WALLET_DELETE');
export const WALLET_DELETEALL 				= createActionSet('WALLET_DELETEALL');
export const WALLET_RESTORE 					= createActionSet('WALLET_RESTORE');


export const NODE			= createActionSet('NODE');
export const CONNECT 	= createActionSet('CONNECT');
export const ACCOUNTSEARCH 	= createActionSet('ACCOUNTSEARCH');
