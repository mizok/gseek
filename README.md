# Service Template

This is a template repository for building Node.js based CLI using [TypeScript](https://www.typescriptlang.org/) and [esbuild](https://esbuild.github.io/).

## Features

- **TypeScript:** Write your server-side code using TypeScript for better developer experience and static typing.
- **esbuild:** A fast JavaScript bundler that allows for efficient bundling and building of your TypeScript code.
- **Husky & Commitlint:** Enforce commit message conventions with Husky and Commitlint to maintain a clean and standardized Git history.
- **chalk.js:** For better and colorful console message/error.
- **@inquirer:** For better CLI user experience.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/)(16.17.0+)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/mizok/service-template.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Automatic Setup

   The `postinstall.ts` script automates the setup process by performing the following tasks:

   1. Executes `npx husky install` to set up Husky.
   2. Deletes the `postinstall` script from package.json.
   3. Deletes the `postinstall.ts` script itself.
   4. To execute this setup, it is automatically triggered during the installation process.

### build and pack

- To build CLI, use:

  ```bash
  npm run build
  ```

- To pack, run:

  ```bash
  npm run pack
  ```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Issues

If you encounter any issues or have questions, feel free to open an issue on the GitHub Issues page.
