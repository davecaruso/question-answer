const PORT = 6482;
const URL_BASE = `http://localhost:${PORT}`;
const URL_QUESTION_COUNT = `${URL_BASE}/question-count`;
const URL_PUBLISH = `${URL_BASE}/publish`;
const URL_PEEK_QUESTION = `${URL_BASE}/peek-question`;
const URL_ANSWER_QUESTION = `${URL_BASE}/answer-question`;
const URL_DENY_QUESTION = `${URL_BASE}/deny-question`;
const URL_IS_DIRTY = `${URL_BASE}/is-dirty`;
const URL_FETCH = `${URL_BASE}/fetch-new-questions`;

export function getQuestionCount() {
  return fetch(URL_QUESTION_COUNT).then((x) => x.text()).then(x => parseInt(x))
}

export function getIsDirty() {
  return fetch(URL_IS_DIRTY).then((x) => x.text()).then(x => Boolean(x))
}

export function getNextQ() {
  return fetch(URL_PEEK_QUESTION).then((x) => x.json());
}

export function answer(q) {
  return fetch(URL_ANSWER_QUESTION, {
    method: 'POST',
    body: JSON.stringify(q),
    headers: {
      "Content-Type": "application/json"
    }
  })
}

export function deny(q) {
  return fetch(URL_DENY_QUESTION, {
    method: 'POST',
    body: JSON.stringify(q),
    headers: {
      "Content-Type": "application/json"
    }
  })
}

export function publish(q) {
  return fetch(URL_PUBLISH, { method: 'POST' });
}
export function fetchQuestions(q) {
  return fetch(URL_FETCH);
}
