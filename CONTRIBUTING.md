# Contributing to ThnkAndGrow Blog

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

Be respectful, inclusive, and professional in all interactions with other contributors and maintainers.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/yourusername/thnkandgrow-fe.git
   cd thnkandgrow-fe
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/original-owner/thnkandgrow-fe.git
   ```
4. Follow the [Setup Guide](./SETUP.md) to configure your environment

## Development Workflow

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and test them:
   ```bash
   npm run dev
   ```

3. Run linting:
   ```bash
   npm run lint
   ```

4. Commit your changes with clear messages:
   ```bash
   git commit -m "feat: add new feature" -m "Description of what changed and why"
   ```

5. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

6. Open a Pull Request on GitHub

## Commit Message Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, semicolons, etc.)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Example:
```
feat: add text-to-speech reader functionality

- Implemented Web Speech API integration
- Added player controls for pause/resume
- Supports multiple languages
```

## Pull Request Process

1. Update documentation if needed
2. Add tests for new functionality
3. Ensure all tests pass: `npm run lint`
4. Provide a clear description of your changes
5. Link any related issues
6. Request review from maintainers

## Areas for Contribution

### Code
- Bug fixes
- Performance improvements
- New features aligned with project goals
- TypeScript improvements
- Accessibility enhancements

### Documentation
- README improvements
- Setup guide updates
- Code comments and JSDoc
- Troubleshooting guides

### Testing
- Unit tests
- Integration tests
- E2E tests

## Reporting Issues

1. Check existing issues to avoid duplicates
2. Use a clear, descriptive title
3. Include:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Environment details (Node version, OS, etc.)
   - Screenshots if relevant

## Coding Standards

### TypeScript
- Use strict mode
- Avoid `any` types
- Use proper type definitions
- Write JSDoc comments for exported functions

### React Components
- Use functional components with hooks
- Keep components small and focused
- Prop types should be well-typed
- Use meaningful variable names

### Styling
- Use CSS Modules for component styles
- Follow BEM naming convention
- Maintain responsive design
- Test on multiple screen sizes

### Performance
- Optimize bundle size
- Use code splitting where appropriate
- Implement proper caching strategies
- Profile and benchmark changes

## Environment Variables

**Never commit `.env.local`** files with sensitive data.

- Always use `.env.example` as a template
- Document all environment variables in SETUP.md
- Use `NEXT_PUBLIC_` prefix for client-side variables only
- Sensitive data should use plain variable names

## Testing

Run tests before submitting a PR:

```bash
npm run lint
```

## Questions?

- Check existing documentation
- Search closed issues and discussions
- Open a discussion for questions
- Contact maintainers if needed

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT).

Thank you for contributing!
