# Contributing to Smart Mock Interview

Thank you for your interest in contributing to Smart Mock Interview! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in your interactions.

### Expected Behavior

- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git
- A code editor (VS Code recommended)

### Setting Up Development Environment

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Smart_mock_interview.git
   cd Smart_mock_interview/myapp
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Add your API keys
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Development Process

### Branching Strategy

- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Urgent production fixes

### Creating a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(analytics): add performance trend chart
fix(voice): resolve filler word detection issue
docs(readme): update installation instructions
```

## Pull Request Process

1. **Update your fork:**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Ensure your code:**
   - Follows the coding standards
   - Passes all tests
   - Includes appropriate documentation
   - Has no console errors or warnings

3. **Create a pull request:**
   - Provide a clear description of changes
   - Reference related issues
   - Include screenshots for UI changes
   - List any breaking changes

4. **PR Review:**
   - Address reviewer feedback
   - Keep the PR focused and concise
   - Update documentation if needed

## Coding Standards

### TypeScript

- Use TypeScript strict mode
- Define interfaces for all props and state
- Avoid `any` type unless absolutely necessary
- Use meaningful variable and function names

```typescript
// Good
interface UserPerformanceProps {
  score: number;
  userName: string;
}

// Avoid
interface Props {
  data: any;
}
```

### React Components

- Use functional components with hooks
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks
- Use meaningful component names

```typescript
// Good
const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ data }) => {
  // Component logic
};

export default AnalyticsDashboard;
```

### File Organization

```
myapp/
├── components/        # React components
├── utils/            # Utility functions
├── types.ts          # Type definitions
├── constants.ts      # Constants and configs
└── App.tsx           # Main app component
```

### Styling

- Use Tailwind CSS utility classes
- Follow mobile-first approach
- Maintain consistent spacing and colors
- Use semantic class names

```tsx
// Good
<div className="p-6 bg-white rounded-xl shadow-lg">
  <h2 className="text-2xl font-bold text-slate-800">Title</h2>
</div>
```

## Testing Guidelines

### Writing Tests

- Write tests for new features
- Maintain test coverage above 80%
- Test edge cases and error conditions
- Use descriptive test names

```typescript
describe('VoiceAnalyzer', () => {
  it('should detect filler words correctly', () => {
    // Test implementation
  });

  it('should calculate speech rate accurately', () => {
    // Test implementation
  });
});
```

### Running Tests

```bash
npm test              # Run all tests
npm test -- --watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

## Documentation

### Code Documentation

- Document complex functions and algorithms
- Use JSDoc comments for public APIs
- Keep comments up-to-date
- Explain "why" not "what"

```typescript
/**
 * Calculate XP earned from an interview
 * @param score - Interview score (0-100)
 * @param difficulty - Interview difficulty level
 * @param duration - Interview duration in minutes
 * @returns XP earned with difficulty multiplier applied
 */
export function calculateXP(
  score: number,
  difficulty: string,
  duration: number
): number {
  // Implementation
}
```

### README Updates

- Update README.md for new features
- Include usage examples
- Add screenshots for visual features
- Keep installation instructions current

## Feature Requests and Bug Reports

### Reporting Bugs

Include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, browser, Node version)
- Screenshots or error messages

### Suggesting Features

Include:
- Clear description of the feature
- Use cases and benefits
- Potential implementation approach
- Mockups or examples (if applicable)

## Questions?

Feel free to:
- Open a discussion on GitHub
- Reach out to maintainers
- Check existing issues and PRs

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to Smart Mock Interview! 🚀
