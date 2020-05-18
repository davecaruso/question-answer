// This file handles rendering of the question markup. On davecode.me, it's a very complex
// component that deals with the custom components, and integrates with the artifact types.

// Artifact Format
// {
//    type: 'question',
//    date: '2020-05-15T18:16:00-04:00',
//    // case A
//    convesation: [
//      ["question", "hello?"],
//      ["answer", "hello."],
//      ["question", "i am thinking."],
//      ["answer", "yes you are"]
//    ]
//    // case B
//    question: 'hello?',
//    answer: 'hello.',
// }
import React from 'react';

function QuestionRender({ artifact }) {
  const conversation =
    'conversation' in artifact
      ? artifact.conversation
      : [
          ['question', artifact.question],
          ['answer', artifact.answer],
        ];

  return (
    <>
      <span className='d'>{artifact.date.replace(/(....-..-..)T(..:..):.*$/, '$1 $2')}</span>
      {conversation.map(([speaker, text], i) => {
        if (speaker === 'question') {
          return (
            <div key={i} className='q' style={{ "--color": 'white' }}>
              <p>
                {text}
              </p>
            </div>
          );
        }
        if (speaker === 'answer') {
          return (
            <div key={i} className='a' style={{ "--color": '#81ff61' }}>
              <p>
                {text}
              </p>
            </div>
          );
        }
        return null;
      })}
    </>
  );
}

export default QuestionRender;
