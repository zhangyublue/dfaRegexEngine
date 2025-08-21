import { NFA } from "./NFA";
import { nfaToDfa } from "./NFA";
import { nfaToDotScript } from "./nfaToDotScript";
import { dfaToDotScript } from "./dfaToDotScript";
import { getStateMachine } from "./stateMachine";
import $ from "jquery";

// 类型声明已在types.d.ts中全局声明
let regStr: string = "";

const getNfa = (str: string) => {
  const nfa = NFA.createFromRegexp(str);
  if (!nfa) return null;
  return nfa.toJSON();
};

const getDfa = (str: string) => {
  const nfa = getNfa(str);
  if (!nfa) return null;
  return nfaToDfa(nfa);
};

const $graph = $("#graph");

$("#nfaGraphBtn").on("click", () => {
  regStr = $("#regexInput").val() as string;
  const nfa = getNfa(regStr);
  if (!nfa) return;
  const dot = nfaToDotScript(nfa);
  // NFA 图
  const nfaGraph = window.Viz(dot);
  $graph.html(nfaGraph);
});

$("#dfaGraphBtn").on("click", () => {
  regStr = $("#regexInput").val() as string;
  const dfa = getDfa(regStr);
  console.warn(dfa);
  if (!dfa) return;
  const dot = dfaToDotScript(dfa);
  // DFA 图
  const dfaGraph = window.Viz(dot);
  $graph.html(dfaGraph);
});

$("#test").on("click", () => {
  regStr = $("#regexInput").val() as string;
  const dfa = getDfa(regStr);
  if (!dfa) return;
  const stateMachine = getStateMachine(dfa);
  const str = $("#string").val() as string;

  str.split("").forEach((char: string) => {
    stateMachine.step(char);
  });

  if (dfa.acceptStates.includes(stateMachine.state)) {
    $("#result").text("true");
    $("#state").text(stateMachine.state);
  } else {
    $("#result").text("false");
    $("#state").text("");
  }
});
