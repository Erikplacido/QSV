declare module 'express-mysql-session' {
  import { Store } from 'express-session';
  
  interface MySQLStoreOptions {
    host?: string;
    port?: number;
    user?: string;
    password?: string;
    database?: string;
    schema?: {
      tableName?: string;
      columnNames?: {
        session_id?: string;
        expires?: string;
        data?: string;
      };
    };
  }
  
  function MySQLStore(session: any): new (options: MySQLStoreOptions) => Store;
  
  export = MySQLStore;
}

