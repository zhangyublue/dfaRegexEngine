export interface State {
  // 状态id
  id: number;
  // 转移路径 id
  transitions: number[];
}

export interface Transition {
  // 转移路径 id
  id: number;
  // 开始状态 id
  from: number;
  // 结束状态 id
  to: number;
  // 输入字符
  input: string;
}

export interface NFA {
  // 开始状态 id
  start: number;
  // 结束状态 id
  end: number;
  // 状态映射
  stateMap: Map<number, State>;
  // 转移路径映射
  transitionMap: Map<number, Transition>;
}

export interface Fragment {
  // 开始状态
  start: State;
  // 结束状态
  end: State;
}

