// 声明外部库的类型
declare global {
  interface Window {
    Viz: (dot: string) => string;
    StateMachine: new (config: any) => any;
  }
}

export {};
