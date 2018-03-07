import {Apis, Manager} from "assetfunjs-ws";
import {ChainStore} from "assetfunjs/es";

// Stores
//import { AsyncStorage } from "react-native";
//import iDB from "./idb-instance";
//import AccountRefsStore from "stores/AccountRefsStore";
//import WalletManagerStore from "stores/WalletManagerStore";
//import WalletDb from "stores/WalletDb";
//import SettingsStore from "stores/SettingsStore";

//import ls from "common/localStorage";
//const STORAGE_KEY = "__assetfun__";
//const ss = new ls(STORAGE_KEY);
const apiLatencies = {}; //ss.get("apiLatencies", {});
const latencyChecks = 1; //ss.get("latencyChecks", 1);
let apiLatenciesCount = 0; //Object.keys(apiLatencies).length;
// Actions
//import PrivateKeyActions from "actions/PrivateKeyActions";
//import {subjectInitCfg} from "actions/SubjectActions";

ChainStore.setDispatchFrequency(10);

let connect = true;
let connectionManager;

import { nodeList } from "../env";

const filterAndSortURLs = (count, latencies) => {
    let urls = nodeList //SettingsStore.getState().defaults.apiServer
    .filter(a => {
        /*
        * Since we don't want users accidentally connecting to the testnet,
        * we filter out the testnet address from the fallback list
        */
        //if (!__TESTNET__ && a.url.indexOf("testnet") !== -1) return false;
        /* Also remove the automatic fallback dummy url */
        if (a.url.indexOf("fake.automatic-selection") !== -1) return false;
        /* Use all the remaining urls if count = 0 */
        if (!count) return true;

        /* Only keep the nodes we were able to connect to */
        return !!latencies[a.url];
    })
    .sort((a, b) => {
        return latencies[a.url] - latencies[b.url];
    }).map(a => a.url);
    return urls;
};

const reNodeList = (urls, latencies) => {

    let nodes = [];
    nodeList.map(a => {
        if(!!latencies[a.url]) {
            a.latency = latencies[a.url];   
            a.status = 'can'; 
        } else {
            a.latency = 0;   
            a.status = 'offline'; 
        }
        // console.log("---------------->>>>>>>>>>>. App.NODE ", a);
        nodes.push(a);
    });
    return nodes;
};

const willTransitionTo = (nextState, replaceState, callback) => {
    /* if (connect) ss.set("latencyChecks", latencyChecks + 1); // Every 25 connect attempts we refresh the api latency list
    if (latencyChecks >= 25) {
        apiLatenciesCount = 0;
        ss.set("latencyChecks", 0);
    } */

    let urls = filterAndSortURLs(apiLatenciesCount, apiLatencies);
    
    /*
    * We use a fake connection url to force a fallback to the best of
    * the pre-defined URLs, ranked by latency
    */
    let connectionString = ""; //SettingsStore.getSetting("apiServer");
    if (!connectionString) connectionString = urls[0];
    if (connectionString.indexOf("fake.automatic-selection") !== -1) connectionString = urls[0];

    console.log("=====[routerTransition.js]::App.willTransitionTo - begin ", connectionString);

    if (!connectionManager) connectionManager = new Manager({url: connectionString, urls});
    /* if (nextState.location.pathname === "/init-error") {
        return Apis.reset(connectionString, true).init_promise
        .then(() => {
            var db;
            try {

                db = iDB.init_instance(window.openDatabase ? (shimIndexedDB || indexedDB) : indexedDB).init_promise;
            } catch(err) {
                console.log("db init error:", err);
            }
            return Promise.all([db, SettingsStore.init()]).then(() => {
                return callback();
            }).catch((err) => {
                console.log("err:", err);
                return callback();
            });
        }).catch((err) => {
            console.log("err:", err);
            return callback();
        });

    } */
    let connectionCheckPromise = !apiLatenciesCount ? connectionManager.checkConnections() : null;
    Promise.all([connectionCheckPromise]).then((res => {
        console.log("=====[routerTransition.js]::App.willTransitionTo - connectionCheckPromise -  ", res);

        if (connectionCheckPromise && res[0]) {
            let [latencies] = res;
            console.log("=====[routerTransition.js]::App.willTransitionTo - Connection latencies:", latencies);
            urls = filterAndSortURLs(0, latencies);
            console.log("=====[routerTransition.js]::App.willTransitionTo - Connection latencies:", urls);
            // ss.set("apiLatencies", latencies);
            connectionManager.urls = urls;
            // 初始化节点信息
            if(connectionManager.url) //有值才初始化
            callback(connectionManager.url, reNodeList(urls, latencies), 'init');
        }
        connectionManager.connectWithFallback(connect).then(() => {
            var db;
            try {
                console.log("=====[routerTransition.js]::App.willTransitionTo - db -  ", global.AsyncStorage);

                //db = iDB.init_instance(window.openDatabase ? (global.AsyncStorage || localStorage || global.shimIndexedDB || indexedDB) : indexedDB).init_promise;
            } catch(err) {
                console.log("db init error:", err);
            }

            console.log("=====[routerTransition.js]::App.willTransitionTo - connectWithFallback -  ", 
                connectionManager.url, connectionManager.urls.indexOf(connectionManager.url));

            return Promise.all([db]).then(() => {
                /* iDB.add_to_store("linked_accounts", {
                    name: "nathan", 
                    chainId: Apis.instance().chain_id
                }); */

                // 连接节点
                callback(connectionManager.url, null, 'connect');


            });
            /*
            return Promise.all([db, SettingsStore.init()]).then(() => {
                return Promise.all([
                    PrivateKeyActions.loadDbData().then(()=> AccountRefsStore.loadDbData()),
                    WalletDb.loadDbData().then(() => {
                        // if (!WalletDb.getWallet() && nextState.location.pathname === "/") {
                        //     replaceState("/dashboard");
                        // }
                        if (nextState.location.pathname.indexOf("/auth/") === 0) {
                            replaceState("/dashboard");
                        }
                    }).catch((error) => {
                        console.error("----- WalletDb.willTransitionTo error ----->", error);
                        replaceState("/init-error");
                    }),
                    WalletManagerStore.init()
                ]).then(()=> {
                    // 成功加载后获取主题相关配置
                    subjectInitCfg();
                    callback();
                });
            }); */
        }).catch( error => {
            console.error("=====[routerTransition.js]::App.willTransitionTo error ----->", error, (new Error).stack);
            if(error.name === "InvalidStateError") {
                if (__ELECTRON__) {
                    ; //replaceState("/dashboard");
                } else {
                    alert("Can't access local storage.\nPlease make sure your browser is not in private/incognito mode.");
                }
            } else {
                ;//replaceState("/init-error");
                if(connectionManager.url)
                    callback(connectionManager.url, null, 'init-error');

                let url = connectionManager.urls[0] || connectionString;
                Apis.reset(url, true).init_promise.then(()=>{
                    
                    console.log("=====[routerTransition.js]::App.willTransitionTo - reset url :", url);
                    callback(url, null, 'connect');

                }).catch(err => {
                    console.error("reset-error:", url, err);
                    return callback(url, null, 'reset-error');
                });
            }
        });

        /* Only try initialize the API with connect = true on the first onEnter */
        connect = false;
    }));


    // Every 25 connections we check the latencies of the full list of nodes
    if (connect && !apiLatenciesCount && !connectionCheckPromise) connectionManager.checkConnections().then((res) => {
        console.log("=====[routerTransition.js]::App.willTransitionTo - Connection latencies e:", res);
        //ss.set("apiLatencies", res);
        if(res && res[0]) {
            let [latencies] = res;
            let urls = filterAndSortURLs(0, latencies);
            callback(connectionManager.url, reNodeList(urls, latencies), 'check');
        }
        
    });

    console.log("=====[routerTransition.js]::App.willTransitionTo - end ");
};

export default willTransitionTo;
