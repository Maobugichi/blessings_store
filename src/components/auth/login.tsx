import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '@/hooks/useAuth';
import { loginSchema } from '@/validation/auth.schema';

export const LoginPage = () => {
   const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const { mutate: login, isPending, error } = useLogin();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    const result = loginSchema.safeParse({ username, password });

    if (!result.success) {
      setFormError(result.error.issues[0].message);
      return;
    }

    login(result.data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              register with an invite code
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {(formError || error) && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-800">
                {formError ?? error?.message}
              </div>
            </div>
          )}

          <div className="rounded-md shadow-sm -space-y-px">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isPending}
              className="block w-full px-3 py-2 border border-gray-300 rounded-t-md"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isPending}
              className="block w-full px-3 py-2 border border-gray-300 rounded-b-md"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2 px-4 rounded-md bg-blue-600 text-white disabled:opacity-50"
          >
            {isPending ? 'Logging in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
};
