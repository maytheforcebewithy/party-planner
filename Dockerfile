# Reproducible environment for the WEB toolchain: install dependencies, run
# lint/typecheck/tests and produce the static Nuxt SPA that Capacitor packages.
#
# Native builds are intentionally out of scope here: Android needs the Android
# SDK and iOS requires macOS/Xcode — neither belongs in this image.

FROM node:22-bookworm-slim

ENV PNPM_HOME=/pnpm
ENV PATH="$PNPM_HOME:$PATH"
# Corepack ships with Node and pins the pnpm version from package.json.
RUN corepack enable

WORKDIR /app

# Copy the whole project first so the `postinstall: nuxt prepare` hook has the
# Nuxt config and app sources available during install.
COPY . .

RUN pnpm install --frozen-lockfile

EXPOSE 3000

# Default to the dev server. In practice you mount the working tree over /app
# (see .devcontainer) so edits are live.
CMD ["pnpm", "dev", "--host", "0.0.0.0"]
