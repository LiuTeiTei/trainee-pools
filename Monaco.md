Monaco Editor Playground

https://microsoft.github.io/monaco-editor/playground.html?source=v0.48.0#example-extending-language-services-configure-javascript-defaults



API

https://microsoft.github.io/monaco-editor/docs.html#interfaces/languages.typescript.LanguageServiceDefaults.html#addExtraLib



```
monaco.languages.typescript.typescriptDefaults.getExtraLibs()
monaco.languages.typescript.javascriptDefaults.getExtraLibs()
```



```
const contents = await new AcquireTypes('', monaco, 'javascript').getDTSContent(
    [
      { module: 'dayjs', version: '1.11.11' },
      // { module: 'moment', version: '2.24.0' },
      { module: 'moment', version: '2.30.1' },
      // TODO @type 的版本和本身不是对应的，例如 lodash 的 @type 就没有 4.6.1
      // { module: 'lodash', version: '4.6.1' },
      // { module: 'lodash', version: '4.17.1' },
    ],
    1,
  )
  const contentsArr = contents.map(({ path, content }) => ({
    filePath: `file://${path}`,
    content,
  }))

  return contentsArr
  .concat({
    filePath: 'moment.d.ts',
    content: `
      import originalMoment from 'file:///node_modules/moment/moment'

      declare global {
        var moment: typeof originalMoment
        interface Window {
          moment: typeof originalMoment
        }
      }
      `,
  })
```

