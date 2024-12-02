[React iframes的最佳实践](https://juejin.cn/post/7068240431141617695) 

[import Frame from 'react-frame-component'](https://github.com/ryanseddon/react-frame-component) 

+ [scss module styles are not working](https://github.com/ryanseddon/react-frame-component/issues/241#issuecomment-1473071876) 
+ [how to use external css or ant design component inside the iframe](https://github.com/ryanseddon/react-frame-component/issues/251) 



## ReactDOM.createRoot or React.render

Antd5 样式加载

https://ant.design/docs/react/compatible-style-cn#shadow-dom-%E5%9C%BA%E6%99%AF

```js
import React, { useCallback } from 'react'
import ReactDOM from 'react-dom/client'
import * as infrad from 'infrad'
import * as monaco from '@shopee/lowcode-plugin-base-monaco-editor'

const styleFrags = `
<link rel="stylesheet" href="https://unpkg.shopee.io/infrad@5.21.6-alpha.4/dist/reset.css" />
`
const scriptFrags = `<script data-id="react">window.React=parent.React;window.ReactDOM=parent.ReactDOM;window.__is_simulator_env__=true;</script>
<script>window.PropTypes=parent.PropTypes;React.PropTypes=parent.PropTypes; window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.parent.__REACT_DEVTOOLS_GLOBAL_HOOK__;</script>
`

const mountScriptAndStyle = (iframe) => {
  const iframeD = iframe?.contentWindow?.document
  const iframeW = iframe?.contentWindow
  if (iframeW) {
    iframeW.infrad = infrad
    iframeW.monaco = monaco
  }

  if (iframeD) {
    iframeD.open()
    iframeD.write(`
<!doctype html>
<html class="engine-design-mode">
<head><meta charset="utf-8"/>
  ${styleFrags}
</head>
<body>
  ${scriptFrags}
</body>
</html>`)
    iframeD.close()
  }
}

interface IReactRenderIframeProps {
  children: React.ReactNode
  style?: React.CSSProperties
  className?: string
}

const ReactRenderIframe: React.FC<IReactRenderIframeProps> = ({ children, ...props }) => {
  const mountChildren = useCallback(
    (iframe) => {
      const iframeD = iframe?.contentWindow?.document
      if (iframeD) {
        const containerId = 'app'
        let container = iframeD.getElementById(containerId)
        if (!container) {
          container = iframeD.createElement('div')
          iframeD.body.appendChild(container)
          container.id = containerId
        }

        const root = ReactDOM.createRoot(container)
        // root.render(<StyleProvider container={container}>{children}</StyleProvider>)
        root.render(children)
      }
    },
    [children],
  )

  const handleRef = useCallback(
    (ref) => {
      mountScriptAndStyle(ref)
      mountChildren(ref)
    },
    [mountChildren],
  )

  return <iframe {...props} ref={handleRef} />
}

export default ReactRenderIframe
```



## ReactDOM.createPortal

```js
import { useCallback, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

const ReactPortalIframe = ({ children, ...props }) => {
  const [contentRef, setContentRef] = useState<any>()

  const mountNode = useMemo(
    () => contentRef?.contentWindow?.document?.body,
    [contentRef?.contentWindow?.document?.body],
  )

  const handleRef = useCallback(async (ref) => {
    console.log(
      '%c [ handleRef ]-13',
      'font-size:13px; background:pink; color:#bf2c9f;',
      'ReactPortalIframe',
    )
    setContentRef(ref)
    // await mountScriptAndStyle(ref)
  }, [])

  return (
    <iframe {...props} ref={handleRef}>
      {mountNode && createPortal(<div id="app">{children}</div>, mountNode)}
    </iframe>
  )
}

export default ReactPortalIframe
```



## Iframe.srcDoc

```js
import { forwardRef, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

// https://vwood.xyz/archive/6fb6e255-cf4e-46f7-b65a-7ee57793d305
export default memo(
  forwardRef<HTMLIFrameElement, any>((props, forwardRef) => {
    const { srcDoc, mountSelector, children, title = '', ...resetComplete } = props
    const _frameRef = useRef<HTMLIFrameElement>(null)
    const [loaded, setLoaded] = useState(false)

    const iframeSrcDoc = useMemo(
      () =>
        srcDoc ||
        `
          <!DOCTYPE html>
          <html>
            <meta charset="UTF-8">
            <head>
            </head>
            <body><div id="iframe-root"></div></body>
          </html>
        `,
      [srcDoc],
    )

    useEffect(() => {
      if (forwardRef) {
        if (typeof forwardRef === 'function') {
          forwardRef(_frameRef.current)
        } else {
          forwardRef.current = _frameRef.current
        }
      }
    }, [forwardRef])

    const getDocument = useCallback(() => _frameRef.current?.contentWindow?.document || null, [])

    const onLoad = useCallback(() => {
      if (!loaded) {
        props.onLoad?.(getDocument())
        setLoaded(true)
      }
    }, [getDocument, loaded, props])

    const renderContent = useCallback(() => {
      const doc = getDocument()
      if (!doc) {
        return null
      }
      const target = doc.querySelector(mountSelector || '#iframe-root')
      if (!target) {
        return null
      }
      return createPortal(typeof children === 'function' ? children(doc) : children, target)
    }, [getDocument, children, mountSelector])

    return (
      <iframe
        {...resetComplete}
        title={title}
        srcDoc={iframeSrcDoc}
        ref={_frameRef}
        onLoad={onLoad}
      >
        {loaded && renderContent()}
      </iframe>
    )
  }),
)
```

