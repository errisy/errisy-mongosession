//Data Service file generate by RPC compiler.
//All your data definitions should be in the same *.data.ts file.
import { 
		EntityCollection, DataSet, NumberQuery, StringQuery, BooleanQuery, NumberArrayQuery, StringArrayQuery, BooleanArrayQuery, IObjectArrayQuery,
		IArrayQuery, IObjectQuery, IArrayProject, Aggregation
	} from 'errisy-mongo';
import { SessionData } from './session.data';
import * as rpc from 'errisy-rpc';
export class SessionDataQuery {
	public _id?: StringQuery;
	public value?: StringQuery;
	public expiryTime?: NumberQuery;
	public $or?: SessionDataQuery[];
	public $and?: SessionDataQuery[];
}
export class SessionDataCollection extends EntityCollection<SessionData, SessionDataQuery, SessionDataProject> {
	public name: string = 'SessionData';
}
export class SessionDataProject {
	constructor() {
		let $dict: {[key: string]:any} = {};
	}
	public _id?: number;
	public value?: number;
	public expiryTime?: number;
}
export class sessionDataSet extends DataSet{
	public async SessionData(suffix?: string): Promise<SessionDataCollection> {
		if (!this.$db) await this.$connect();
		return new Promise<SessionDataCollection>((resolve, reject) => {
			resolve(new SessionDataCollection(this.$db, suffix));
		});
	}
	public get $Entities(): rpc.EntityDefinition[] {
		return [
			new rpc.EntityDefinition("SessionData",[
				new rpc.FieldDefinition("_id", "string"),
				new rpc.FieldDefinition("value", "string"),
				new rpc.FieldDefinition("expiryTime", "number")
			])
		];
	}
	public async $Collection(definition: rpc.EntityDefinition, suffix?: string): Promise<EntityCollection<any, any, any>> {
		switch (definition.Name) {
			case 'SessionData': return await this.SessionData(suffix);
		}
	}
	public async $initializeIndices(): Promise<boolean>{
		await (await this.SessionData()).createIndex({ _id: 1 });
		await (await this.SessionData()).createIndex({ expiryTime: 1 });
		return true;
	}
}
