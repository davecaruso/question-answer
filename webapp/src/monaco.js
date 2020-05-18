import * as monaco from 'monaco-editor';
import 'monaco-editor/esm/vs/basic-languages/yaml/yaml.contribution';
import 'monaco-yaml/esm/monaco.contribution';
import 'monaco-yaml/esm/yamlMode';
import 'monaco-yaml/esm/languageFeatures';
import schema from './schema.json';

window.MonacoEnvironment = {
  getWorkerUrl(moduleId, label) {
    if (label === 'yaml') {
      return './static/js/runtime-yaml.worker/chunk.js';
    }
    return './static/js/runtime-editor.worker/chunk.js';
  },
};

// a made up unique URI for our model
export const modelUri = monaco.Uri.parse('qa://current-file.yaml');

export const model = monaco.editor.createModel('', 'yaml', modelUri);

monaco.editor.defineTheme('qa', {
	base: 'vs-dark',
	inherit: true,
	colors: {
    'editor.background': '#121212',
  },
  rules: [
    {
      token: 'type',
      foreground: '#e06c75',
    },
    {
      token: 'string',
      foreground: '#98c379',
    },
    {
      token: 'number',
      foreground: '#ff0000',
    },
    {
      token: 'keyword',
      foreground: '#ff0000',
    },
    {
      token: 'tag',
      foreground: '#ff0000',
    },
  ]
});

monaco.languages.yaml.yamlDefaults.setDiagnosticsOptions({
  validate: true,
  enableSchemaRequest: true,
  hover: true,
  completion: true,
  schemas: [
    {
      uri: window.location.origin + '/schema.json',
      fileMatch: ['*'],
      schema: schema
    },
  ],
});
