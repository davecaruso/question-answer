# Dave's Question Answer System
> Code to run davecode.me/q+a

This is most of the code used to run the qa service. It is composed of:
- **Question Submitter** (PHP) see ./server
- **Question Fetcher** (Shell) see ./bin/questiond-fetch
- **Question Daemon** (Node) see ./bin/questiond
- **Extracted Question Renderer** (React) see ./implementation/QuestionRender.js
- **Extracted Question CSS** (CSS) see ./implementation/questions.css
- **Sample Question Page** (React) see ./implementation/sample_q+a.html.tsx
- **Responder Web App** (React) see ./webapp
- **Responder Email Tool** (Node) see ./bin/questiond-sendmail
- **Polybar Question Counter** (Shell) see ./bin/polybar-questiond

## Install
For best results, use a linux system.

- Clone the repository
- Run `npm install`
- Run `npm run web-build`
- Add ./bin to your `$PATH`
- Modify server/submit-question.php to have the file path have your username in it.
- Host server/submit-question.php
- Configure questiond.json
- Start `questiond`
- Configure your website to load files from `.data/answered/*`
- Configure ./implementation/on_publish to publish your website.
- Configure sendgrid token in `~/.ssh/sendgrid.token`
- Bind a keyboard key to open `http://localhost:6482`

## Structure
- **.data**: the question data
- **bin**: programs that can be run
- **server**: files that would be on the server-side
- **webapp**: a create-react-app project with the webapp
- **implementaiton**: files that are different per person, but an example one is given.

## Contributions
This is a program I use on a very regular basis to automate my own workflow,
so I'd love any contribution to help the project be better. Feel free to open
any GitHub issues or pull requests for any features or bugs you want. 
