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

@ContractObject()
export class State  {

    public static serialize(object: object): Buffer {
        return Buffer.from(JSON.stringify(object));
    }

    public static deserialize(data: Buffer, supportedClasses: Map<string, IState<State>>): State {
              const json = JSON.parse(data.toString());
              const objClass = supportedClasses[json.class];
              if (!objClass) {
            throw new Error(`Unknown class of ${json.class}`);
        }
              const object = new (objClass)(json);

              return object;

    }

    public static deserializeClass<T extends State>(data: string, objClass: IState<T>): T {
        const json = JSON.parse(data.toString());
        const object = new (objClass)(json);
        return object;
    }

    public static makeKey(keyParts: string[]): string {
        return keyParts.join(':');
    }

    public static splitKey(key: string): string[] {
        return key.split(':');
    }

    private class: string;
    private subClass?: string;
    private key: string;

    constructor(stateClass: string, keyParts: string[]) {
        this.class = stateClass;
        this.key = State.makeKey(keyParts);
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
