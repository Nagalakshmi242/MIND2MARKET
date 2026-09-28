export interface PasswordRule {
  id: string;
  label: string;
  passed: boolean;
}

export interface PasswordAnalysis {
  score: number; // 0 to 4
  label: 'Too Short' | 'Weak' | 'Fair' | 'Good' | 'Strong';
  color: string;
  bgColor: string;
  progressPercent: number;
  rules: PasswordRule[];
}

export function evaluatePasswordStrength(password: string): PasswordAnalysis {
  const rules: PasswordRule[] = [
    {
      id: 'length',
      label: 'At least 8 characters',
      passed: password.length >= 8,
    },
    {
      id: 'lowercase',
      label: 'At least one lowercase letter (a-z)',
      passed: /[a-z]/.test(password),
    },
    {
      id: 'uppercase',
      label: 'At least one uppercase letter (A-Z)',
      passed: /[A-Z]/.test(password),
    },
    {
      id: 'number',
      label: 'At least one number (0-9)',
      passed: /[0-9]/.test(password),
    },
    {
      id: 'special',
      label: 'At least one special symbol (!@#$%^&*)',
      passed: /[^A-Za-z0-9]/.test(password),
    },
  ];

  if (!password) {
    return {
      score: 0,
      label: 'Too Short',
      color: 'text-slate-400',
      bgColor: 'bg-slate-200 dark:bg-slate-700',
      progressPercent: 0,
      rules,
    };
  }

  const passedCount = rules.filter((r) => r.passed).length;

  if (password.length < 6) {
    return {
      score: 1,
      label: 'Too Short',
      color: 'text-rose-500',
      bgColor: 'bg-rose-500',
      progressPercent: 20,
      rules,
    };
  }

  if (passedCount <= 2) {
    return {
      score: 1,
      label: 'Weak',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500',
      progressPercent: 40,
      rules,
    };
  }

  if (passedCount === 3) {
    return {
      score: 2,
      label: 'Fair',
      color: 'text-amber-500',
      bgColor: 'bg-amber-500',
      progressPercent: 60,
      rules,
    };
  }

  if (passedCount === 4) {
    return {
      score: 3,
      label: 'Good',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500',
      progressPercent: 80,
      rules,
    };
  }

  return {
    score: 4,
    label: 'Strong',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500',
    progressPercent: 100,
    rules,
  };
}
