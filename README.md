# Notes Backend

This repository is used as a starting point for an assignment. Originally it is from the amazing MOOC [FullStackOpen](https://fullstackopen.com/)

## Usage of this repository

### Inital installation
```bash
npm install
```

### Start the application
```bash
npm start
```

### Start with Hot-Reload
```bash
npm run dev
```

## Quality & Tooling

Run locally before pushing:

```bash
npm run lint           # ESLint quality gate (--max-warnings 0)
npm run test:coverage  # Jest unit + integration tests, fails under 80% coverage
docker build -t noteapp-backend:latest .   # hardened multi-stage image
```

## DevOps Pipeline

CI/CD runs on every pull request and on every push to `main`
([.github/workflows/devops-ci-cd.yml](.github/workflows/devops-ci-cd.yml)):

- **Lint & Test Application** — ESLint, Jest unit + integration tests, and an 80% coverage
  threshold. The coverage report is archived as the `test-coverage-report` artifact.
- **Docker Build, Scan & Publish** — builds the hardened multi-stage Alpine image, scans it with
  **Trivy** (CRITICAL/HIGH, results uploaded to the Security tab as SARIF), and pushes a tagged
  image (`latest`, `sha-<sha>`, `<semver>`) to GHCR on pushes to `main`.

### Static analysis

This project uses **CodeQL** ([.github/workflows/codeql.yml](.github/workflows/codeql.yml)) for static
code analysis with quality gates, rather than SonarCloud. CodeQL is GitHub-native, requires no external
account or token, performs deep semantic data-flow analysis, and surfaces findings in the same Security
tab as the Trivy container scan.

### Dependency updates

**Dependabot** ([.github/dependabot.yml](.github/dependabot.yml)) opens weekly grouped update PRs for the
`npm`, `github-actions`, and `docker` ecosystems; every bump runs through the full pipeline above.