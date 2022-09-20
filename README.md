# Simple file uploader

Simple REST API file upload service written in typescript

## Installation

Install with git

```bash
  git clone https://github.com/kamchibekov/file-upload-service.git
  cd file-upload-service
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT`

`DB_HOST`

`DB_PORT`

`DB_USER`

`DB_PASS`

`DB_NAME`

`JWT_TOKEN_SECRET`

`JWT_REFRESH_TOKEN`

## API Reference

#### Get all files of current user

```http
  GET /api/file/list?page=${page}&list_size=${list_size}
```

| Parameter   | Type     | Description                       |
| :---------- | :------- | :-------------------------------- |
| `page`      | `number` | **Optional**. Default value is 1  |
| `list_size` | `number` | **Optional**. Default value is 10 |

## Acknowledgements

- [TypeORM](https://typeorm.io/)
- [Expressjs](http://expressjs.com/)
- [Typescript](https://www.typescriptlang.org/)
- [Express validator](https://express-validator.github.io/)

## Authors

- [@kamchibekov](https://github.com/kamchibekov)
