import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API documentation for backend services')
    .setVersion('1.0.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      description: 'Enter JWT token',
      in: 'header',
    })
    .build();

  // Auto-generate from Nest
  const nestDocument = SwaggerModule.createDocument(app, config);

  // OPTIONAL: Merge custom additions
  const customDocPath = path.join(process.cwd(), 'src/docs/custom-swagger.json');

  let finalDocument = nestDocument;

  if (fs.existsSync(customDocPath)) {
    const customDoc = JSON.parse(fs.readFileSync(customDocPath, 'utf8'));

    // merge automatic + custom
    finalDocument = {
      ...nestDocument,
      ...customDoc,
      paths: {
        ...nestDocument.paths,
        ...customDoc.paths,
      },
      components: {
        ...nestDocument.components,
        ...customDoc.components,
      },
    };
  }

  SwaggerModule.setup('api-docs', app, finalDocument, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
    },
    customCss: `
      .swagger-ui .topbar { background-color: #4ad179ff; }
      body { background-color: #fbfdfdff !important; }
      .swagger-ui .opblock-summary-method { background-color: #f5f6f8ff !important; }
    `,
    customSiteTitle: 'API Docs',
  });

  // OPTIONAL: Export swagger.json (for clients, SDKs, etc.)
  const outputPath = path.join(process.cwd(), 'swagger.json');
  fs.writeFileSync(outputPath, JSON.stringify(finalDocument, null, 2));
  console.log('📄 Swagger JSON exported → swagger.json');
}
