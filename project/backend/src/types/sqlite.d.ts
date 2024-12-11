declare module 'sqlite3' {
  export interface Database {
    run(sql: string, params: any[], callback?: (err: Error | null) => void): this;
    get(sql: string, params: any[], callback?: (err: Error | null, row: any) => void): this;
    all(sql: string, params: any[], callback?: (err: Error | null, rows: any[]) => void): this;
    exec(sql: string, callback?: (err: Error | null) => void): this;
    prepare(sql: string): Statement;
    close(callback?: (err: Error | null) => void): void;
  }

  export interface Statement {
    run(...params: any[]): this;
    get(...params: any[]): any;
    all(...params: any[]): any[];
    finalize(callback?: (err: Error | null) => void): void;
  }

  export default {
    Database: class implements Database {
      constructor(filename: string, callback?: (err: Error | null) => void);
      run(sql: string, params: any[], callback?: (err: Error | null) => void): this;
      get(sql: string, params: any[], callback?: (err: Error | null, row: any) => void): this;
      all(sql: string, params: any[], callback?: (err: Error | null, rows: any[]) => void): this;
      exec(sql: string, callback?: (err: Error | null) => void): this;
      prepare(sql: string): Statement;
      close(callback?: (err: Error | null) => void): void;
    }
  };
}