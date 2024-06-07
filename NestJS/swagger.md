https://docs.nestjs.com/openapi/introduction

https://github.com/nestjs/swagger?tab=readme-ov-file



### 自动给每个 api 加上 @ApiResponse，不需要手动的一个个加：

+ 类型写在 .dto.ts 文件中；

+ 类型定义写法是 export class XXX {} 而不是 interface；

+ api return 的时候如果不能简单推算出类型，要手动声明下；

+ 配置：

  ```js
  // nest-cli.json
  {
    "collection": "@nestjs/schematics",
    "sourceRoot": "src",
    "compilerOptions": {
      "plugins": ["@nestjs/swagger"]
    }
  }
  
  // or
  {
    "collection": "@nestjs/schematics",
    "sourceRoot": "src",
    "compilerOptions": {
      "plugins": [
        {
          "name": "@nestjs/swagger/plugin",
          "options": {
            "classValidatorShim": true,
            "introspectComments": true,
            "dtoFileNameSuffix": [
              ".entity.ts",
              ".dto.ts",
              ".model.ts"
            ]
          }
        }
      ]
    }
  }
  ```





### 包装 response

改造 @ApiResponse

https://cloud.tencent.com/developer/article/2348282

https://juejin.cn/post/7274182001933172772#heading-7



全局包装

```js
/**
 * @infra-node-kit/core will wrapper the response data to { data, code: number, status: number, message: string}
 * but swagger not follow this wrapping, so it needs to be converted manually.
 */
const addResponseWrapper = (document: OpenAPIObject) => {
  for (const path of Object.keys(document.paths)) {
    const pathItem = document.paths[path]
    if (!pathItem) {
      continue
    }
    for (const method of Object.keys(pathItem)) {
      const responses = (document.paths[path] as unknown as any)[method].responses
      if (!responses) {
        continue
      }
      for (const status of Object.keys(responses)) {
        if (responses[status].content) {
          const content = responses[status].content
          for (const contentType in content) {
            if (content[contentType].schema && content[contentType].schema.$ref) {
              content[contentType].schema = {
                type: 'object',
                properties: {
                  data: content[contentType].schema,
                  code: { type: 'number' },
                  status: { type: 'number' },
                  message: { type: 'string' }
                }
              }
            }
          }
        }
      }
    }
  }

  return document
}

const getSwaggerDocument = (app: INestApplication): OpenAPIObject => {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Low Code Platform API')
    .setDescription('Low Code Platform API')
    .setVersion('1.0')
    .build()
  return addResponseWrapper(SwaggerModule.createDocument(app, swaggerConfig))
}

export const setupSwagger = (app: INestApplication) => {
  const serverConfigService = app.get(ServerConfigService)
  const path = serverConfigService.get<string>('swaggerPath') || '/swagger'
  const document = getSwaggerDocument(app)
  SwaggerModule.setup(path, app, document)
}
```





### 改 ui 样式

```js
// main.ts
import * as express from 'express'
import { NestFactory } from '@nestjs/core'
import { NestApplicationOptions } from '@nestjs/common'
import { AllExceptionsFilter } from './common/exceptions/all-exceptions.filter'
import { LoggerModule, loggerConfig } from './logger'
import { PrometheusExporterModule } from './prometheus-exporter/prometheus-exporter.module'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { DOC_ROUTE } from './common/constants/routes'
import { logBuildInfo } from './common/utils/build-info'
import { getSwaggerDocument, setupAPIRoute } from './common/swagger'
import { globalValidationPipe } from './common/pipes'

async function bootstrap() {
  const applicationOptions: NestApplicationOptions = {}
  if (process.env.NODE_ENV === 'production') {
    applicationOptions.logger = LoggerModule.createLogger(loggerConfig)
  }
  const app = await NestFactory.create(AppModule, applicationOptions)

  const httpAdapter = app.getHttpAdapter()
  app.use(express.json({ limit: '1mb' }))
  app.useGlobalPipes(globalValidationPipe)
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter))
  app.useGlobalFilters(new HttpExceptionFilter())

  const document = getSwaggerDocument(app)
  setupAPIRoute(DOC_ROUTE, app, document)

  let appPort = Number(process.env.APP_PORT)

  if (!appPort || isNaN(appPort)) {
    appPort = 9123
  }

  await app.listen(appPort)
}

async function prometheusBootstrap() {
  const app = await NestFactory.create(PrometheusExporterModule)

  let prometheusPort = Number(process.env.PROMETHEUS_EXPORTER_PORT)

  if (!prometheusPort || isNaN(prometheusPort)) {
    prometheusPort = 9124
  }

  await app.listen(prometheusPort)
}

// eslint-disable-next-line @typescript-eslint/no-extra-semi
;(async () => {
  await bootstrap()
  prometheusBootstrap()
  logBuildInfo()
})()
```

```js
// swagger.index.ts
import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger'
import * as dayjs from 'dayjs'
import { SHOULD_SHOW_FULL_SWAGGER } from '../constants/swagger'
import { getSwaggerHTML } from './helpers'
import { OPEN_API_LIST } from './open-api-list'

export const getSwaggerDocument = (app: INestApplication) => {
  const swaggerConfig = new DocumentBuilder()
    .addServer('https://monitoring.infra.sz.shopee.io/', 'Live')
    .addServer('https://monitoring.test.shopee.io/', 'Nonlive')
    .setTitle('Node API')
    .setDescription(
      `Monitoring Platform OpenAPI (Node API Service) \n\n Document Update time: ${dayjs().format(
        'YYYY/MM/DD HH:mm:ss',
      )}`,
    )
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    include: SHOULD_SHOW_FULL_SWAGGER ? undefined : OPEN_API_LIST,
    operationIdFactory: (controllerKey: string, methodKey: string) =>
      `${methodKey}_${controllerKey}`,
  })

  // Handle colon in paths
  const paths = {}
  for (const key in document.paths) {
    paths[key.replace(/\[\:\]/g, ':')] = document.paths[key]
  }

  document.paths = paths

  return document
}

export const setupAPIRoute = (path: string, app: INestApplication, document: OpenAPIObject) => {
  const httpAdapter = app.getHttpAdapter()
  const finalPath = path.charAt(0) !== '/' ? '/' + path : path
  httpAdapter.get(finalPath, (_req, res) => res.send(getSwaggerHTML(document)))
  httpAdapter.get(finalPath + '-json', (_req, res) => res.json(document))
}
```

```js
// swagger.helper.ts
import { OpenAPIObject } from '@nestjs/swagger'

export const getSwaggerHTML = (document: OpenAPIObject) => {
  return `
<!DOCTYPE html><html><head><title>OpenAPI - Monitoring Platform</title><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"><style>body {margin: 0;padding: 0;}</style></head><body><div id="redoc-container"></div><script src="https://cdn.jsdelivr.net/npm/redoc@2.0.0-rc.57/bundles/redoc.standalone.js"> </script>
<script>
  // We make some custom configs here
  Redoc.init(${JSON.stringify(document)}, {
    theme: {
      sidebar: {
        width: '330px',
      },
    },
  }, document.getElementById('redoc-container'))
</script></body></html>
  `
}
```

