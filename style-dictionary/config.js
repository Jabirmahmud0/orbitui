import { formats, transformGroups } from 'style-dictionary/enums';

export default {
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: transformGroups.css,
      buildPath: 'src/tokens/generated/',
      files: [
        {
          destination: 'variables.css',
          format: formats.cssVariables,
          options: {
            outputReferences: true,
          },
        },
      ],
    },
    js: {
      transformGroup: transformGroups.js,
      buildPath: 'src/tokens/generated/',
      files: [
        {
          destination: 'tokens.js',
          format: formats.javascriptEsm,
          options: {
            outputReferences: true,
          },
        },
      ],
    },
  },
};
