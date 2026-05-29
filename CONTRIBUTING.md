# Contributing to GenAI Explorers

Thank you for your interest in contributing to GenAI Explorers! This document provides guidelines and instructions for contributing.

## 🤝 How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details (OS, browser, Node version)

### Suggesting Features

Feature requests are welcome! Please:
- Check if the feature already exists or is planned
- Provide a clear use case
- Explain why this feature would be valuable
- Include mockups or examples if possible

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with clear messages**
   ```bash
   git commit -m "Add: feature description"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open a Pull Request**

## 📝 Coding Standards

### JavaScript/React

- Use functional components with hooks
- Follow React best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components small and focused

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons
- Use ES6+ features
- Follow ESLint rules (if configured)

### File Organization

```
src/
├── components/     # Reusable UI components
├── pages/         # Page-level components
├── services/      # API and business logic
├── contexts/      # React contexts
├── data/          # Static data
└── utils/         # Utility functions
```

## 🧪 Testing

Before submitting:
- Test in development mode
- Build and test production build
- Test on different browsers
- Check responsive design
- Verify all features work

## 📋 Commit Message Guidelines

Use conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

Examples:
```
feat: add video search functionality
fix: resolve authentication redirect issue
docs: update API integration guide
```

## 🔍 Code Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, your PR will be merged
4. Your contribution will be credited

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 💬 Questions?

Feel free to open an issue for any questions or clarifications.

Thank you for contributing! 🎉