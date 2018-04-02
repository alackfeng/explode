import { SerializerValidation, TransactionBuilder, TransactionHelper } from 'assetfunjs/es';
import ApplicationApi from './ApplicationApi';
import WalletDb from './WalletDb';

/* eslint class-methods-use-this: ["error", { "exceptMethods":
  ["new_transaction", "sign_and_broadcast", "template"] }]
*/
class WalletApi {
  constructor() {
    this.application_api = new ApplicationApi();
  }

  new_transaction() {
    return new TransactionBuilder();
  }

  sign_and_broadcast(tr, broadcast = true) {
    SerializerValidation.required(tr, 'transaction');
    return WalletDb.process_transaction(
      tr,
      null, // signer_private_key,
      broadcast
    );
  }

  /** Console print any transaction object with zero default values. */
  template(transaction_object_name) {
    let object = TransactionHelper.template(
      transaction_object_name,
      { use_default: true, annotate: true }
    );
    // visual
    console.error(JSON.stringify(object, null, 4));

    // usable
    object = TransactionHelper.template(
      transaction_object_name,
      { use_default: true, annotate: false }
    );
    // visual
    console.error(JSON.stringify(object));
    return object;
  }
}
export default WalletApi;
