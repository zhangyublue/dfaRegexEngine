// var regStr = "(a|b)*(a|c)*";
let regStr = "";

const str = "1abcd";

const getNfa = (str) => {
  return NFA.createFromRegexp(str).toJSON();
};

const getDfa = (str) => {
  const nfa = getNfa(str);
  return nfaToDfa(nfa);
};

const $graph = $("#graph");

$("#nfaGraphBtn").click(() => {
  regStr = $("#regexInput").val();
  const dot = nfaToDotScript(getNfa(regStr));
  // NFA 图
  const nfaGraph = Viz(dot);
  $graph.html(nfaGraph);
});

$("#dfaGraphBtn").click(() => {
  regStr = $("#regexInput").val();
  const dot = dfaToDotScript(getDfa(regStr));
  // DFA 图
  const dfaGraph = Viz(dot);
  $graph.html(dfaGraph);
});

$("#test").click(() => {
  regStr = $("#regexInput").val();
  const dfa = getDfa(regStr);
  const stateMachine = getStateMachine(dfa);
  const str = $("#string").val();
  str.split("").forEach((char) => {
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
