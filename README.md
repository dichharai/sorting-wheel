# sorting-wheel

A spinner to pick contestant order for [San Francisco Toastmasters club](https://www.toastmasters.org/Find-a-Club/00001771-san-francisco-toastmasters)'s bi-annual club contest.

You can access the **Sorting Wheel** spinner [here](https://sorting-wheel.vercel.app/).

## For User

This is the [User Guide](UserGuide.pdf) on the Sorting Wheel application.

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

## Acknowledgement

This project was completed as part of the High Performance Leadership level 5 requirement of the Toastmasters [Pathways Program](https://www.toastmasters.org/education/pathways).

I extend my sincere gratitude to my Guidance Committee members and Team Members for their unwavering support, invaluable feedback, and dedication to helping me bring this application to life.

**Guidance Committee Members**

- Nancy Tabor
- Terry Joyce

Thank you for supporting my vision, offering consistently valuable feedback, sacrificing your time for those early-morning weekend meetings, and for the key encouragement to sign up for my first speech! I am forever grateful for your mentorship.

**Team Members**

- Dennis Meng (Code Reviewer)
- Derek Sowers (Application Tester)

Thank you for diligently reviewing my code despite your demanding work schedules and for providing detailed, actionable feedback.

You all continue to be a profound source of inspiration.

### Credits

- Free icon [wheel](https://www.flaticon.com/free-icons/wheel)
