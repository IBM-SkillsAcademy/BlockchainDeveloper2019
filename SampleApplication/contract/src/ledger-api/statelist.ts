/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';
import { Context } from 'fabric-contract-api';
import { newLogger } from 'fabric-shim';
import { IState, State } from './state';

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
}
