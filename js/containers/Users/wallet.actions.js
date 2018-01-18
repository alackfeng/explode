
import { WALLET, WALLET_NEW, WALLET_DELETE, WALLET_DELETEALL, WALLET_RESTORE } from "./types";

import WalletBox from "./wallet.box";

export const init = () => {
	return dispatch => {
		dispatch({type: WALLET.SUCCESS});
	};
};

export const setNewWallet = (wallet_name, create_wallet_password, brnkey) => {
	return dispatch => {

		console.log("==========[wallet.actions.js]::setNewWallet - ", wallet_name, create_wallet_password, brnkey);
		// first 
		dispatch({type: WALLET_NEW.PENDING});

		let ret = (res) => {
				console.log("++++++[wallet.actions.js]::setNewWallet - ret -  ", res);
				// finial
				dispatch({
					type: WALLET_NEW.SUCCESS,
					payload: {
						new_wallet: wallet_name
					}
				});
			};
		// api call
		WalletBox.onSetWallet({wallet_name, create_wallet_password, brnkey, 
			ret
		});/*.then(res => {
			console.log("++++++[wallet.actions.js]::setNewWallet - normal - ", res);
		}).catch(err => {
			console.log("++++++[wallet.actions.js]::setNewWallet - err - ", err);
		}); */


	};
};

export const onDeleteAllWallets = () => {

}

export const deleteWallet = (detele_wallet_name) => {
	return dispatch => {

		dispatch({type: WALLET_DELETE.PENDING});

		// call someting, example api

		dispatch({
			type: WALLET_DELETE.SUCCESS,
			payload: {
				detele_wallet_name: detele_wallet_name
			}
		});	

	};
};

export const restore = ({wallet_name, wallet_object}) => {
	console.log("++++++[wallet.actions.js]::restore - wallet restore -  ", wallet_name, wallet_object);
	return {
		type: WALLET_RESTORE.SUCCESS,
		payload: {
			wallet_name,
			wallet_object
		}
	}
}
