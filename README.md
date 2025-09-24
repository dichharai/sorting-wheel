# sorting-hat

A spinner to pick contestant order for [San Francisco Toastmasters club](https://www.toastmasters.org/Find-a-Club/00001771-san-francisco-toastmasters)'s bi-annual club contest.

## For Developer

The application is made using `Next.js`, a `React` framework.

**Development Setup**

Install `npm` using Node version manager like [`nvm`](https://github.com/nvm-sh/nvm).

Once `npm` is installed, install required packages:

You can install dependencies listed in `package.json` by running `npm install`

OR

You can manually install the project dependencies

```
npm install react@latest react-dom@latest next@latest
npm install tailwindcss @tailwindcss/postcss postcss
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier
npx @next/codemod@latest next-lint-to-eslint-cli
```
Start your development Node.js server:

`npm run dev`

**Command to run linter**

`npm run lint`

**Command to run formatter**

`npm run format`

You can access the **Sorting Hat** spinner [here](https://sorting-hat-dun.vercel.app/).
