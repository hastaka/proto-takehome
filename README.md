# Project & Task Management API

This is a **NestJS** + **TypeORM** REST API for managing **Projects** and their related **Tasks**.  
The system supports CRUD operations for both entities, with proper validation, OpenAPI docs, and PostgreSQL persistence.

---

## 📌 **Features**

- **Projects**
  - Create, retrieve, update, and delete projects
  - Retrieve all tasks for a given project

- **Tasks**
  - Create, retrieve, update, and delete tasks
  - Enforce tasks must belong to a valid project

- **Validation & Error Handling**
  - Input DTOs for type-safe request bodies
  - Proper HTTP exceptions for bad input and missing resources

- **API Documentation**
  - Fully documented using **Swagger** (`/docs`)

- **Logging**
  - Each controller logs incoming requests for traceability
  - All warnings, errors, and other key items (such as create data) is also logged

---

## 🗄️ **Tech Stack**

- [NestJS](https://nestjs.com/) - backend framework
- [TypeORM](https://typeorm.io/) - ORM for PostgreSQL
- [PostgreSQL](https://www.postgresql.org/) - relational database
  - [Neon](neon.com) - database platform used for testing
  - [Supabase](supabase.com) - database platform used for testing
- [Swagger](https://swagger.io/) - auto-generated API docs
- [Jest](https://jestjs.io/) + [Supertest](https://github.com/visionmedia/supertest) - E2E tests

---

## ⚙️ **Database**

This project uses PostgreSQL as its relational database, with TypeORM as the ORM for managing entities, migrations, and schema synchronization.

### 📌 Database Schema

**projects Table**
|Column|Type|Constraints|Description|
|-|-|-|-|
|id|UUID|PRIMARY KEY, DEFAULT uuid*generate_v4()|Unique project identifier, auto-generated|
|name|VARCHAR|NOT NULL|Name of the project|
|description|VARCHAR||Project description|
|created_at|TIMESTAMP|DEFAULT now()|Timestamp when the project was created|
|updated_at|TIMESTAMP|DEFAULT now() on update|Timestamp when the project was last updated|
|*tasks*|-|*One-to-many to tasks*|*Virtual column - not stored in DB; defines relation in ORM*|

**tasks Table**
|Column|Type|Constraints|Description|
|-|-|-|-|
|id|UUID|PRIMARY KEY, DEFAULT uuid_generate_v4()|Unique task identifier, auto-generated|
|title|VARCHAR|NOT NULL|Short title of the task|
|description|VARCHAR||Task description|
|status|VARCHAR/ENUM|NOT NULL|Allowed: 'todo', 'in-progress', 'done'|
|due_date|DATE||Date the task is due|
|project_id|UUID|NOT NULL, FOREIGN KEY → projects.id|Reference to the parent project|
|created_at|TIMESTAMP|DEFAULT now()|Timestamp when the task was created|
|updated_at|TIMESTAMP|DEFAULT now() on update|Timestamp when the task was last updated|

### Entity relations

- One **Project** → Many **Tasks**

### Migrations

All migrations are handled by TypeORM.  
> **Note:** Make sure you run migrations or sync schema on first launch. This can be done by updating the flag `synchronize: true` in `src/app.module.ts`. Leaving the sync flag true may cause tests to time out, if the connection with your database is slow.

---

## 🚀 **Running Locally**

### 1️⃣ **Clone & Install**

```bash
git clone github.com/hastaka/proto-takehome
cd proto-takehome
npm install
```

### 2️⃣ Configure .env

Create an `.env` file in the root, using `.env.example` as the template. Adjust as needed for your PostgreSQL.

### 3️⃣ Run Database

Ensure PostgreSQL is running, and the database exists:

```psql
createdb <your db name>
```

Or use your preferred DB tool.

### 4️⃣ Start

Run `npm run start:dev`. The API will be available at [http://localhost:3000](http://localhost:3000)

### 5️⃣ API Docs

Visit [http://localhost:3000/docs](http://localhost:3000/docs) to view interactive Swagger docs.

## ✅ Testing

Tests are available for the following:
|Test Name|Command|
|-|-|
|E2E Tests|`npm run test:e2e`|
|Unit Tests|`npm run test:unit`|
|All Tests|`npm run test:all`|


### ProjectController E2E Tests

These tests verify the full lifecycle of a Project:

- Create Project

      POST /projects
      Confirms a project can be created with valid input.

- Get All Projects

      GET /projects
      Confirms that the list of all projects can be fetched.

- Get Project by ID

      GET /projects/:id
      Confirms that an existing project can be fetched by its UUID.

- Update Project

      PATCH /projects/:id
      Confirms that an existing project can be updated with new data.

- Delete Project

      DELETE /projects/:id
      Confirms that an existing project can be deleted by ID.

- Error Handling

      Confirms that invalid or non-existent IDs return 404 or appropriate error responses.

### TaskController E2E Tests

These tests verify the full lifecycle of a Task in the context of its parent Project:

- Create Project (Dependency)

      Automatically creates a parent project before testing tasks.

- Create Task

      POST /tasks
      Confirms a task can be created under an existing project.

- Get All Tasks

      GET /tasks
      Confirms that all tasks can be listed.

- Get Task by ID

      GET /tasks/:id
      Confirms that a specific task can be retrieved by its UUID.

- Update Task

      PATCH /tasks/:id
      Confirms that an existing task can be updated with new fields.

- Delete Task

      DELETE /tasks/:id
      Confirms that a task can be deleted by its UUID.

- Error Handling After Delete

      GET /tasks/:id after deletion
      Confirms that fetching a deleted task returns a 404 Not Found.

### ProjectService Unit Tests
- create()

      Successfully creates and saves a project.
      Throws BadRequestException if saving the project fails.

- findAll()

      Returns all projects successfully.
      Throws InternalServerErrorException if fetching projects fails.

- findOne(id)

      Returns a project by ID if found.
      Throws NotFoundException if the project does not exist.
      Throws InternalServerErrorException on other errors.

- findOneTasks(id)

      Returns the list of tasks for a given project.
      Throws NotFoundException if the project is not found.
      Throws InternalServerErrorException on other errors.

- update(id, dto)

      Successfully updates a project.
      Throws NotFoundException if the project to update does not exist.
      Throws BadRequestException on other update errors.

- remove(id)

      Successfully deletes a project.
      Throws NotFoundException if the project to delete does not exist.
      Throws InternalServerErrorException on other deletion errors.

### TaskService Unit Tests

- create()

      Successfully creates and saves a task when the associated project exists.
      Throws NotFoundException if the project specified in project_id does not exist.
      Throws BadRequestException on other errors during creation.

- findAll()

      Returns all tasks successfully.
      Throws InternalServerErrorException if fetching tasks fails.

- findOne(id)

      Returns a task by ID if found.
      Throws NotFoundException if the task is not found.
      Throws InternalServerErrorException on other errors.

- update(id, updateDto)

      Successfully updates a task.
      Throws NotFoundException if no task was updated (task not found).
      Throws BadRequestException on other errors during update.

- remove(id)

      Successfully deletes a task.
      Throws NotFoundException if no task was deleted (task not found).
      Throws InternalServerErrorException on other errors during deletion.

## 📦 NPM run Scripts

- `start:dev` - runs dev server with hot reload
- `start` - runs server without hot reload
- `test:e2e` - runs all E2E tests using Jest & Supertest

## 🗂️ Key Project Structure

```
src/
 ├── app.*.ts             # Root module, controller, service
 ├── project/             # 'Project' entity, module, controller, service, DTO
 ├── task/                # 'Task' entity, module, controller, service, DTO
 └── main.ts              # App bootstrap
test/
 ├── app.e2e-spec.ts      # Health check test
 ├── project.e2e-spec.ts  # 'Project' E2E tests
 └── task.e2e-spec.ts     # 'Task' E2E tests
.env                      # Environment file
.env.example              # Sample environment file
```

## 📣 Notes

- Make sure your DB credentials are correct.
- The app expects UUID primary keys for both Projects and Tasks.
- Creating a Task requires a valid Project ID. Ensure you create a project first.
