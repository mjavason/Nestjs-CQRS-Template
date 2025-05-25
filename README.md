# Nestjs-CQRS-Template

NestJS starter with Command Query Responsibility Segregation (CQRS) architecture. Implements JWT and Google OAuth authentication, Swagger documentation, environment-based config, Mongoose for MongoDB, error monitoring via Telegram, caching, mailing, file uploads, rate limiting, and more. Designed for modularity and scalability.

## Features

- **CQRS Architecture**: Separation of commands (writes) and queries (reads) via `@nestjs/cqrs`.
- **Authentication**: JWT and session-based auth with Google OAuth strategy.
- **Validation**: Uses `class-validator` and `class-transformer` for DTO validation.
- **Mongoose ODM**: MongoDB integration via Mongoose with defined schemas and repositories.
- **Swagger**: API documentation auto-generated using Swagger.
- **Email System**: Preconfigured transactional email templates.
- **File Uploads**: Cloudinary integration, multer config.
- **Caching Layer**: Redis-compatible caching system.
- **Rate Limiting**: Request throttling for security.
- **Telegram Error Bot**: Remote error alert system via Telegram integration.
- **Logging**: Structured logging utility.
- **Environment Configuration**: Configured via `.env` and centralized config files.

## Installation

```bash
git clone https://github.com/mjavason/nestjs-cqrs-template.git
cd nestjs-cqrs-template
npm install
```

## Running

```bash
# Development
npm run start:dev

# Production
npm run start:prod

# Debugging
npm run start:debug
```

Ensure `.env` is configured. Reference `.env.sample` for required variables.

## Testing

```bash
# Unit tests
npm run test

# End-to-end tests
npm run test:e2e

# Coverage report
npm run test:cov
```

## Directory Overview

```
mjavason-nestjs-cqrs-template/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── auth/                  # Auth commands, strategies, guards, services
│   ├── bucket/                # File storage logic
│   ├── common/                # Global configs, utils, interceptors, decorators
│   ├── mail/                  # Email modules, templates, and subscriptions
│   ├── todo/                  # CQRS-based todo feature
│   ├── user/                  # User entities, services, DTOs
├── test/                      # E2E and unit tests
├── notes/                     # Design and development notes
├── .husky/                    # Git hooks
├── .prettierrc                # Code formatter config
├── package.json
├── tsconfig.json
└── README.md
```

## Status

Actively refactoring to adopt full CQRS pattern across all modules.
