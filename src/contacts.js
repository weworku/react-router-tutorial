import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";

/**
 * 指定されたクエリに基づいて連絡先を取得します。
 *
 * @param {string} query - 検索クエリ
 * @returns {Promise<Array>} - 連絡先の配列を含むPromiseオブジェクト
 */
export async function getContacts(query) {
    await fakeNetwork(`getContacts:${query}`);
    let contacts = await localforage.getItem("contacts");
    if (!contacts) contacts = [];
    if (query) {
        contacts = matchSorter(contacts, query, { keys: ["first", "last"] });
    }
    return contacts.sort(sortBy("last", "createdAt"));
}

/**
 * 新しい連絡先を作成します。
 * @returns {Promise<Object>} 作成された連絡先オブジェクト
 */
export async function createContact() {
    await fakeNetwork();
    let id = Math.random().toString(36).substring(2, 9);
    let contact = { id, createdAt: Date.now() };
    let contacts = await getContacts();
    contacts.unshift(contact);
    await set(contacts);
    return contact;
}

/**
 * 指定されたIDの連絡先を取得します。
 * @param {string} id - 連絡先のID
 * @returns {Promise<Object|null>} - 指定されたIDの連絡先オブジェクトまたはnull
 */
export async function getContact(id) {
    await fakeNetwork(`contact:${id}`);
    let contacts = await localforage.getItem("contacts");
    let contact = contacts.find(contact => contact.id === id);
    return contact ?? null;
}

/**
 * 指定されたIDの連絡先を更新します。
 * @param {string} id - 更新する連絡先のID
 * @param {Object} updates - 更新するプロパティを含むオブジェクト
 * @returns {Promise<Object>} - 更新された連絡先オブジェクト
 * @throws {Error} - 指定されたIDの連絡先が見つからない場合にエラーがスローされます
 */
export async function updateContact(id, updates) {
    await fakeNetwork();
    let contacts = await localforage.getItem("contacts");
    let contact = contacts.find(contact => contact.id === id);
    if (!contact) throw new Error("No contact found for", id);
    Object.assign(contact, updates);
    await set(contacts);
    return contact;
}

/**
 * 指定されたIDの連絡先を削除します。
 * @param {string} id - 削除する連絡先のID
 * @returns {Promise<boolean>} - 削除が成功した場合はtrue、そうでない場合はfalse
 */
export async function deleteContact(id) {
    let contacts = await localforage.getItem("contacts");
    let index = contacts.findIndex(contact => contact.id === id);
    if (index > -1) {
        contacts.splice(index, 1);
        await set(contacts);
        return true;
    }
    return false;
}

/**
 * contactsを設定します。
 * @param {Array} contacts - 設定する連絡先の配列
 * @returns {Promise} - localforage.setItemのPromiseオブジェクト
 */
function set(contacts) {
    return localforage.setItem("contacts", contacts);
}

// fake a cache so we don't slow down stuff we've already seen
let fakeCache = {};

/**
 * ネットワークリクエストを模擬する非同期関数です。
 * @param {string} key - キャッシュのキー
 * @returns {Promise} - ネットワークリクエストの結果を表すPromiseオブジェクト
 */
async function fakeNetwork(key) {
    if (!key) {
        fakeCache = {};
    }

    if (fakeCache[key]) {
        return;
    }

    fakeCache[key] = true;
    return new Promise(res => {
        setTimeout(res, Math.random() * 800);
    });
}