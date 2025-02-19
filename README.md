# Serenity's Skeet Scheduler (S3)

Yes, I finally have a project to call S3 lol.

Pretty self-explanatory. It's a skeet (Bluesky tweet) scheduler built by me!

S3 is a [Vue](https://vuejs.org/) app that uses [Vue Router](https://router.vuejs.org/).

## Installation and Usage

TBD. Project WIP and not deployed yet.

## Contribution

PRs and Issues are welcome. Please create an issue before submitting a PR.

### Setup

1. Clone this repo `git clone https://github.com/NekoDrone/s3.git`
2. Enter the folder `cd s3`
3. Install dependencies `pnpm install`
4. Run the dev server `pnpm dev`

```sh
git clone https://github.com/NekoDrone/s3.git
cd s3
pnpm install
pnpm dev
```

## Development

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```

### Format with [Prettier](https://prettier.io/)
```sh
pnpm format
```

## Deployment

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Deployment Steps

The project is deployed on Vercel. (Might swap to self-hosted Coolify).

Pushing to the repository `main` branch should trigger a deployment run onto Vercel.