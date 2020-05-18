import React from "react";
import QuestionRender from "./QuestionRender";

// you would have a system to import .data/answered/*
const questions = [
  {
    date: '2020-05-15T22_53_34-04_00',
    question: 'hi',
    answer: 'bye',
  }
]

export default function () {
  return (
    <>
      <link rel="stylesheet" href="/questions.css" />
      <div className="paper">
        <h1>
          sample q+a page
        </h1>

        <form
          action="/submit-question.php"
          method="POST"
          style={{ paddingBottom: "20px" }}
          id="form"
        >
          <div>
            <textarea
              name="question"
              id="textarea"
              maxLength={3000}
              style={{
                resize: "vertical",
                width: "100%",
                maxWidth: "500px",
                height: "100px",
              }}
            />
          </div>
          <div>
            <label>
              <div style={{ marginTop: "10px", marginBottom: "1px" }}>
                Email (optional, to get notified when responded)
              </div>
              <input type="email" name="email" />
            </label>
          </div>
          <br />
          <button type="submit" id="submit">
            SEND
          </button>
        </form>

        <hr style={{ border: "1px solid white", marginBottom: "20px" }} />

        <div id="questions">
          {questions.map((question) => {
            return <QuestionRender key={question.date} artifact={question} />;
          })}
        </div>
      </div>
    </>
  );
}
