// app.service.ts

import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  get(): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Proto Takehome API</title>
  <style>
    body {
      margin: 0;
      height: 100vh;
      background: linear-gradient(135deg, #00b4db, #0083b0);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .overlay {
      background: rgba(0, 0, 0, 0.8);
      padding: 4rem;
      border-radius: 8px;
      text-align: center;
      color: #ffffff;
      font-family: Arial, sans-serif;
    }

    a {
      color: #00b4db;
      text-decoration: none;
      font-weight: bold;
    }

    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="overlay">
    <h1>Welcome to the Proto Takehome API</h1>
    <p><a href="/docs">View API Documentation</a></p>
  </div>
</body>
</html>`;
  }
}
