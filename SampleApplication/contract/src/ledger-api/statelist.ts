/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';
import { Context } from 'fabric-contract-api';
import { newLogger } from 'fabric-shim';
import { IHistoricState, IState, State } from './state';
import { QueryPaginationResponse } from '../utils/queryPaginatedResponse';

const logger = newLogger('STATELIST');
// Utility class for collections of ledger states --  a state list
/**
 * StateList provides a named virtual container for a set of ledger states.
 * Each state has a unique key, which associates the state with the container, rather
 * than the container containing a link to the state. This approach minimizes collisions
 * for parallel transactions on different states.
 */
export class StateList<T extends State> {

    private ctx: Context;
    private name: string;
    private supportedClasses: Map<string, IState<T>>;

    constructor(ctx: Context, listName: string) {
        this.ctx = ctx;
        this.name = listName;
        this.supportedClasses = new Map();
    }

    public getCtx(): Context {
        return this.ctx;
    }

    /**
     * Add a state to the list. Creates a new state in world state with
     * appropriate composite key.  Note that state defines its own key.
     * State object is serialized before writing.
     */

    public async add(state: T) {
        const key = this.ctx.stub.createCompositeKey(this.name, state.getSplitKey());

        const data = state.serialize();

        const buff = await this.ctx.stub.getState(key);

        if (buff.length > 0) {
            throw new Error('Cannot create new state. State already exists for key ' + key);
        }

        await this.ctx.stub.putState(key, data);

    }
        /**
         * Get a state from the list by using the supplied keys. Form composite
         * keys to retrieve state from the world state. State data is deserialized
         * into JSON object before it is returned.
         */
    public async get(key: string): Promise<T> {
        const ledgerKey = this.ctx.stub.createCompositeKey(this.name, State.splitKey(key));
        const data = await this.ctx.stub.getState(ledgerKey);

        if (data.length === 0) {
            throw new Error(`Cannot get state. No state exists for key ${key} ${this.name}`);
        }
        const state = State.deserialize(data, this.supportedClasses) as T;

        return state;
    }

    // Return all states

    public async getAll(): Promise<T[]> {
        return this.query({});
    }

    /**
     * *** Exercise 3 > Part 3 ***
     *
     * @returns { Number }   count total number of assets of specific type
     * Get Count of specific state (Vehicle , Order , ...)
     */
    public async count(): Promise<number> {
       /*Queries the state in the ledger based on a given partial composite key.
       This function returns an iterator, which can be used to iterate over all composite keys
       whose prefix matches the given partial composite key */
        const data = await this.ctx.stub.getStateByPartialCompositeKey(this.name, []);
        let counter = 0;

        while (true) {
            const next = await data.next();

            if (next.value) {
                counter++;
            }

            if (next.done) {
                break;
            }
        }

        return counter;
    }

   /**
    * Generic function used across exercises to update assets
    * Updates a state in the list. Puts the new state in world state with the
    * appropriate composite key. Note that the state defines its own key.
    * A state is serialized before it is written. The logic is similar to
    * addState() but it is kept separate because it is semantically distinct.
    */

    public async update(state: any) {
        if (!(state instanceof State)) {
            throw new Error(`Cannot use ${state.constructor.name} as type State`);
        }

        const key = this.ctx.stub.createCompositeKey(this.name, state.getSplitKey());
        const data = state.serialize();

        const buff = await this.ctx.stub.getState(key);

        if (buff.length === 0) {
            throw new Error(`Cannot update state. No state exists for key ${key}`);
        }

        await this.ctx.stub.putState(key, data);
    }
    // Check whether the key exists
    public async exists(key: string) {
        try {
            // If the following function does not throw an exception, then return true.
            await this.get(key);
            return true;
        } catch (err) {
            return false;
        }
    }

    // Query to run advanced queries
    public async query(query: any) {
        const { stub } = this.ctx;
        if (!query.selector) {
            query.selector = {};
        }
        query.selector._id = {
            $regex: `.*${this.name}.*`,
        };

        const iterator = await stub.getQueryResult(JSON.stringify(query));
        let value = (await iterator.next()).value;

        const states: T[] = [];

        while (value) {
            const state = State.deserialize((value.getValue() as any).toBuffer(), this.supportedClasses) as T;
            logger.info(JSON.stringify(state));
            states.push(state);
            const next = await iterator.next();
            value = next.value;
        }
        return states;
    }
    // Delete state with Key
    public delete(key: string) {
        const ledgerKey = this.ctx.stub.createCompositeKey(this.name, State.splitKey(key));
        // Deletes the state variable key from the state store.
        return this.ctx.stub.deleteState(ledgerKey);
    }

    public getName(): string {
        return this.name;
    }

    public use(...stateClasses: Array<IState<T>>) {
        for (const stateClass of stateClasses) {
            if (!((stateClass as any).prototype instanceof State)) {
                throw new Error(`Cannot use ${(stateClass as any).name} as type State`);
            }
            this.supportedClasses.set(stateClass.getClass(), stateClass);
        }
    }

    /**
     * *** Exercise 06 > Part 3 > Step 5 ***
     * @param {T} state data object that will be stored in private data collection
     * @param {string} collection the name of the private data collection being used
     */
    public async updatePrivate(state: T, collection: string) {
        const key = this.ctx.stub.createCompositeKey(this.name, state.getSplitKey());
        // serialize object data to a buffer array before putting it to ledger
        const data = state.serialize();
        // putPrivateData puts the specified `key` and `value` into the transaction's private writeSet.
        await this.ctx.stub.putPrivateData(collection, key, data);
    }

    /**
     * *** Exercise 06 > Part 3 > Step 5 ***
     * @param {string} key: The vehicle key number used to store the price data object
     * @param {string} collection: The name of the private data collection
     * @returns {Promise<T>} price object as promise
     */
    public async getPrivate(key: string, collection: string): Promise<T> {
        const ledgerKey = this.ctx.stub.createCompositeKey(this.name, State.splitKey(key));
        // getPrivateData returns the value of the specified `key` from the specified `collection`
        const buffer = await this.ctx.stub.getPrivateData(collection, ledgerKey);
        // Check whether data exists
        if (buffer.length === 0) {
            throw new Error(`Cannot get state. No state exists for key ${key} ${this.name}`);
        }
        // Deserialize buffer array into supported class object
        const state = State.deserialize(buffer, this.supportedClasses) as T;
        return state;
    }

    /**
     * *** Exercise 3  > Part 4 ***
     * @param { string } key for which to return all history
     * @returns {Array<IHistoricState<T>} array of history state
     * The function returns history of all transactions over a key
     */
    public async getHistory(key: string): Promise<Array<IHistoricState<T>>> {
        const ledgerKey = this.ctx.stub.createCompositeKey(this.name, State.splitKey(key));
        /* Returns a history of key values across time. For each historic key update,
        the historic value and associated transaction ID and time stamp are returned.
        The time stamp is the time stamp provided by the client in the proposal header.
         This method requires peer configuration core.ledger.history.enableHistoryDatabase to be true.*/
        const keyHistory = await this.ctx.stub.getHistoryForKey(ledgerKey);
       // array of IHistoricState to hold query result
        const history: Array<IHistoricState<T>> = [];

        let value = (await keyHistory.next()).value;

        while (value) {
           // deserialize the state which convert object into one of a set of supported JSON classes
            const state = State.deserialize((value.getValue() as any).toBuffer(), this.supportedClasses);

            const historicState: IHistoricState<T> = new IHistoricState(
                (value.getTimestamp().getSeconds() as any).toInt(), value.getTxId(), state as T,
            );

            history.push(historicState);

            const next = await keyHistory.next();
            value = next.value;
        }

        return history;
    }
 /**
  * *** Exercise 3  > Part 5 ***
  *
  * @param { string } queryString: Query statment as string
  * @param { number } pageSize: Number of query result per page
  * @param { string } bookmark: When an empty string is passed as a value to the bookmark argument,
  * the returned iterator can be used to fetch the first `pageSize` of query results. When the bookmark is not an empty string,
  * the iterator can be used to fetch the first `pageSize` keys between the bookmark and the last key in the query result.
  * @returns { QueryPaginationResponse<T> }: Object of type QueryPaginationResponse T, which contains array of states, number of returned results, and bookmark.
  */
    public async queryWithPagination(queryString: string, pageSize: number, bookmark: string): Promise<QueryPaginationResponse<T>> {
        /*
        getQueryResultWithPagination, which performs a "rich" query against a state database. It is only supported for state databases that support rich query, for example,
        CouchDB. The query string is in the native syntax of the underlying state database.
       */
        const result = await this.ctx.stub.getQueryResultWithPagination(queryString, pageSize, bookmark);
        // Create object of custom type QueryPaginationResponse (which exists under folder util)
        const queryPaginatedRes: QueryPaginationResponse<T> = new QueryPaginationResponse(result.metadata.fetched_records_count, result.metadata.bookmark);
        // Fetch the first item from iterator
        let value = (await result.iterator.next()).value;
        // Create array of states to hold query result
        const states: T[] = [];
        // While the value has a defined value (exits and not null)
        while (value) {
            // Deserialize the state, which converts the object into one of a set of supported JSON classes
            const state = State.deserialize((value.getValue() as any).toBuffer(), this.supportedClasses) as T;
            logger.info(JSON.stringify(state));
            // Push the state to array as a new entry
            states.push(state);
            // Get the next item from iterator
            const next = await result.iterator.next();
            // Get next value from next item
            value = next.value;
        }
        queryPaginatedRes.value = states;
        return queryPaginatedRes;

    }

  /**
   * *** Exercise 3  > Part 4 ***
   *
   * @param { string } startKey: Start key used as starting point to search the ledger with
   * @param { string } endkey: End key used as end point to search the ledger with 
   * @returns T [] Array of states that exists in the range between start and end keys
   *  Query assets by range by using startkey and endkey. This function uses the API getStateByRange 
   */
    public async getAssetsByRange(startKey: string, endKey: string): Promise<T[]> {

        const ledgerStartKey = this.ctx.stub.createCompositeKey(this.name, State.splitKey(startKey));

        const ledgerEndKey = this.ctx.stub.createCompositeKey(this.name, State.splitKey(endKey));

        // Returns a range iterator (StateQueryIterator) over a set of keys in the ledger.
        // If the number of keys between startKey and endKey is greater than totalQueryLimit, 
        // which is defined in the peer's configuration file core.yaml,
        // this iterator cannot be used to fetch all keys (results are limited by the totalQueryLimit).
        const result = await this.ctx.stub.getStateByRange(ledgerStartKey, ledgerEndKey);

        // The iterator can be used to iterate over all keys between the startKey (inclusive) and endKey (exclusive).
        let value = (await result.next()).value;
        // Array of states
        const states: T[] = [];
        // while the value has a defined value (exits and not null)
        while (value) {
            // deserialize the state which converts the object into one of a set of supported JSON classes
            const state = State.deserialize((value.getValue() as any).toBuffer(), this.supportedClasses) as T;
            states.push(state);
            const next = await result.next();
            value = next.value;
        }
        // Call close() on the returned StateQueryIterator object when done
        result.close();

        return states;

    }
}
