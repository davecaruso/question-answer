import React, { useCallback, useRef, useState, useEffect } from 'react';
import MonacoEditor from 'react-monaco-editor';
import { model } from './monaco';
import yaml from 'yaml';
import schema from './schema.json';
import ajv from 'ajv';
import QuestionRender from './implementation/QuestionRender';
import * as api from './api';
import {ErrorBoundary} from 'react-error-boundary'

const validate = new ajv().compile(schema);

function escapeYamlString(s) {
  if (s.includes(':') || s.startsWith('[') || s.startsWith('-') || s.startsWith('"')|| s.startsWith('\'') || s.includes('\\') || s.match(/^[0-9]/)) {
    return `"${s.replace(/(["\\])/g, '\\$1').replace(/: /g, ':\\ ')}"`
  }
  return s;
}

function genCode(q) {
  return `${q.date}:\n  - question: ${escapeYamlString(q.question)}\n  - answer: ""`;
}

function ErrorFallback({error, componentStack, resetErrorBoundary}) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <pre>{componentStack}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function App() {
  const [loading, setLoading] = useState(false);
  const [hasDoneFetch, setDoneFetch] = useState(null);
  const [isDirty, setDirty] = useState(null);
  const [questionCount, setQuestionCount] = useState(null);
  const [question, setQuestion] = useState(null);
  const [code,setCode] = useState('hi:\n  - question: hi\n  - answer: bye');

  useEffect(() => {
    if(!loading && !hasDoneFetch) {
      api.fetchQuestions().then(() => {
        setDoneFetch(true)
        setLoading(false);
      })
    } else if (!loading && isDirty === null) {
      setLoading(true);
      api.getIsDirty().then(dirty => {
        setDirty(dirty);
        setLoading(false);
      })
    } else if (!loading && questionCount === null) {
      setLoading(true);
      api.getQuestionCount().then(count => {
        setQuestionCount(count);
        setLoading(false);
      })
    } else if (!loading && questionCount >= 1 && !question) {
      setLoading(true);
      api.getNextQ().then(q => {
        setQuestion(q);
        const c = genCode(q);
        setCode(c);
        model.setValue(c);
        setLoading(false);
      })
    }
  }, [question, loading, questionCount, isDirty]);

  const answer = useCallback(() => {
    if(!loading) {
      let parsed = null;
      try {
        parsed = yaml.parse(code);
        if(!validate(parsed)) throw new Error();
      } catch (error) {
        return
      }
      parsed = parsed[Object.keys(parsed)[0]];

      let ans;
      if(parsed.length > 2) {
        ans = {
          conversation: parsed.map(x => Object.entries(x)).flat()
        }
      } else {
        ans = {
          question: parsed.find(x => 'question' in x).question,
          answer: parsed.find(x => 'answer' in x).answer,
        };
      }
      
      setLoading(true);
      
      api.answer(ans).then(() => {
        setQuestionCount(questionCount - 1);
        setQuestion(null);
        setLoading(false);
        setDirty(true);
      })
    }
  }, [question, questionCount, loading, code])
  const deny = useCallback(() => {
    if(!loading) {
      setLoading(true);
      api.deny().then(() => {
        setQuestionCount(questionCount - 1);
        setQuestion(null);
        setLoading(false);
        if(question.email) {
          setDirty(true);
        }
      })
    }
  }, [question, questionCount, loading])
  const publish = useCallback(() => {
    if(!loading) {
      setLoading(true);
      api.publish().then(() => {
        setQuestionCount(null);
        setQuestion(null);
        setDirty(false);
        setLoading(false);
      })
    }
  }, [question, questionCount, loading, isDirty])

  const editorRef = useRef();
  
  const editorDidMount = useCallback(
    (editor) => {
      editorRef.current = editor;

      model.setValue(code);

      editor.setModel(model);
    },
    [code, editorRef]
  );
  const onCodeChange = useCallback(
    (code) => {
      setCode(code)
    },
    []
  );

  let parsed = null;
  let err = null;
  try {
    parsed = yaml.parse(code);
    if(!validate(parsed)) throw new Error();
  } catch (error) {
    parsed = null;
    err = error;
  }

  return (
    <>
      <div className="paper">
        <h1>Question Dashboard</h1>
        <p>
          You have <strong><code>{questionCount}</code></strong> question{questionCount !== 1 && 's'} in your inbox.
        </p>
        {
          loading && <h2>LOADING</h2>
        }
        <div>
          {
            question && <>
              <button onClick={answer} style={{ background: '#090' }}>ANSWER</button>
              {' '}
              <button onClick={deny} style={{ background: '#900' }}>DENY</button>
              {' '}
            </>
          }
          <button onClick={publish} disabled={!isDirty}>PUBLISH</button>
        </div>
      </div>
      {
        question && <div className="app">
        <div className="flexbox">
          <MonacoEditor
            height={500} 
            theme='qa'
            language='yaml'
            editorDidMount={editorDidMount}
            onChange={onCodeChange}
          />
        </div>
        <div className="flexbox right">
          {
          parsed
            ? <div>
              {
                Object.keys(parsed).map((k) => {
                  return <ErrorBoundary
                    FallbackComponent={ErrorFallback}
                    resetKeys={[code]}
                  >
                    <QuestionRender artifact={{
                      date: k,
                      type: 'question',
                      conversation: parsed[k].map(x => Object.entries(x)).flat()
                    }} />
                  </ErrorBoundary>
                })
              }
            </div>
            : <div>
              <h1>[[error]]</h1>
              <p>
                does not follow schema / bad parse
              </p>
              <pre>
                <code>
                  {err.toString()}
                </code>
              </pre>
              <pre>
                <code>
                  {JSON.stringify(parsed, null, 21)}
                </code>
              </pre>
            </div>
          }
        </div>
      </div>
      }
    </>
  );
}

export default App;
