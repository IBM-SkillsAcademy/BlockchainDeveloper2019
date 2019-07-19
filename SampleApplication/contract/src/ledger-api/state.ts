/*
SPDX-License-Identifier: Apache-2.0
*/

import { Object as ContractObject, Property } from 'fabric-contract-api';
import { newLogger } from 'fabric-shim';

const logger = newLogger('STATE');

export interface IState<T> {
    new (...args: any[]): T;
    getClass(): string;
}
// Utility class for ledger state
/**
 * State class. States have a class, unique key, and a lifecycle current state
 * the current state is determined by the specific subclass (Vehicle , Order , ... )
 */
@ContractObject()
export class State  {

    private class: string;
    private subClass?: string;
    private key: string;

    constructor(stateClass: string, keyParts: string[]) {
        this.class = stateClass;
        this.key = State.makeKey(keyParts);
    }
      /**
     * Convert object to buffer containing JSON data serialization
     * Typically used before putState()ledger API
     * @param {Object} JSON object to serialize
     * @return {buffer} buffer with the data to store
     */
    public static serialize(object: object): Buffer {
        return Buffer.from(JSON.stringify(object));
    }
    /**
     * Deserialize object into one of a set of supported JSON classes
     * i.e. Covert serialized data to JSON object
     * Typically used after getState() ledger API
     * @param {data} data to deserialize into JSON object
     * @param (supportedClasses) the set of classes data can be serialized to
     * @return {json} json with the data to store
     */
    public static deserialize(data: Buffer, supportedClasses: Map<string, IState<State>>): State {
              const json = JSON.parse(data.toString());
              const objClass = supportedClasses.get(json.class);

              if (!objClass) {
            throw new Error(`Unknown class of ${json.class}`);
        }
              const object = new (objClass)(json);

              return object;

    }

      /**
     * Deserialize object into specific object class
     * Typically used after getState() ledger API
     * @param {data} data to deserialize into JSON object
     * @return {json} json with the data to store
     */
    public static deserializeClass<T extends State>(data: string, objClass: IState<T>): T {
        const json = JSON.parse(data.toString());
        const object = new (objClass)(json);
        return object;
    }
/**
     * Join the keyParts to make a unififed string
     * @param (String[]) keyParts
     */

    public static makeKey(keyParts: string[]): string {
        return keyParts.join(':');
    }

    public static splitKey(key: string): string[] {
        return key.split(':');
    }

    public getClass(): string {
        return this.class;
    }

    public getSubClass(): string {
        return this.subClass;
    }

    public getKey(): string {
        return this.key;
    }

    public getSplitKey(): string[] {
        return State.splitKey(this.key);
    }

    public serialize(): Buffer {
        return State.serialize(this);
    }

}
// tslint:disable:max-classes-per-file
// Container for returned result for getHistory for akey
@ContractObject()
export class IHistoricState<T extends State> {
    public value: T;

    @Property()
    public timestamp: number;

    @Property()
    public txId: string;

    constructor(timestamp: number, txId: string, value: T) {
        this.timestamp = timestamp;
        this.txId = txId;
        this.value = value;
    }

    public serialize(): Buffer {
        const obj = Object.assign(this, {value: JSON.parse(this.value.serialize().toString())});

        return Buffer.from(JSON.stringify(obj));
    }
}
