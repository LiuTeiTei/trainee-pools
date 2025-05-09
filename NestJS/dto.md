# 全局验证传参

https://docs.nestjs.com/techniques/validation

```bash
$ npm i --save class-validator class-transformer
```

```js
// src/pipes/validation.pipe.ts

import { ValidationPipe } from '@nestjs/common'

export const globalValidationPipe = new ValidationPipe({
  forbidUnknownValues: true,
  transform: true,
})
```

```js
// src/main.ts

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  
  // Validate dto
  app.useGlobalPipes(globalValidationPipe)
  
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
```

