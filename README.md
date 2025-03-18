# Frontend Coding Challenge

# [Link on site](https://chocopieca.github.io/github_repo_list_vue3/)

This challenge will give us an idea about your coding skills. The challenge usually takes about 1-2 hours.

## Steps

- Bootstrap a new single page application with either Vue.js (preferred), React or Angular.
- Use the GitHub API to show [Nodejs's](https://github.com/orgs/nodejs) public repositories and parse the JSON response.
- Display a list of repositories, each entry should show
  - repo name
  - description
  - login of the owner
- Request only 10 repos at a time. Use an endless list with a load more mechanism. The load more should be triggered when the scrolling is close to reaching the end of the list. Check the pagination documentation.
- Show a light blue background if the has_wiki flag is false or missing, a white one otherwise.
- On a long click on a list item show a dialog to ask if go to repository html_url or owner html_url which is opened then in the browser.

## Additional notes

- We are intereseted in code efficiency, following of best practices & code readability.
- Don't focus too much on the UI design.
- Functionality above must be implemented using common architectural patterns.
- The business logic should at least be tested by a minimal set of unit tests.
- If your API request limit exceeds, you can generate and use a personal access token here and add ?access_token=<YOUR_ACCESS_TOKEN> to the request URLs.
- If you have any final comments about your result please let us know via NOTES.md in this repository.

## Bonus points

- Show the repositories in the viewport on a hard refresh.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
