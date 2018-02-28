
let id_regex = /\b\d+\.\d+\.(\d+)\b/;

import {ChainTypes} from "assetfunjs/es";
var {object_type, operations} = ChainTypes;

export const Utils = {

  formatAmount(v) {
    // TODO: use asset's precision to format the number
    if (!v) v = "";
    if (typeof v === "number") v = v.toString();
    let value = v.trim().replace(/,/g, "");

    // value = utils.limitByPrecision(value, this.props.asset.get("precision"));
    while (value.substring(0, 2) == "00")
      value = value.substring(1);
    if (value[0] === ".") value = "0" + value;
    else if (value.length) {
      let n = Number(value)
      if (isNaN(n)) {
          value = parseFloat(value);
          if (isNaN(value)) return "";
      }
      let parts = (value + "").split('.');
      value = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      if (parts.length > 1) value += "." + parts[1];
    }
    return value;
  },

  replace(v) {
    if (typeof v === "number") v = v.toString();
    return v.trim().replace(/,/g, "");
  },

  checkValidAmount(amount, min, max, precision) {

    min = (min === 0) ? 0 : (min || 5);
    max = max || 1000000;
    precision = precision || 4;     

    let amount_ = this.replace(amount);
    let amount_point_ = amount_.split(".")[1] ? amount_.split(".")[1].length : precision;
    if(Number(amount_) < min || Number(amount_) > max || amount_point_ > precision ) {
      let bTrue = false;
      if(Number(amount_) < min) {
          //amount = 50;
      }
      if(Number(amount_) > max) {
        amount = amount.substring(0, amount.length-1);
        bTrue = true;
      }
      if(amount_point_ > precision) {
        amount_ = Number(amount_).toFixed(precision);
        let parts = (amount_ + "").split('.');
        amount = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        if (parts.length > 1) amount += "." + parts[1];
        if(Number(amount_) < min) {
          ;
        } else {
          bTrue = true;
            //return {ret: true, valid_amount: amount}; 
        }
          
      }
      return {ret: bTrue, valid_amount: amount};
    }
    return {ret: true, valid_amount: amount};
  }
};
