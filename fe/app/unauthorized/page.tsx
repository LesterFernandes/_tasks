export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center text-gray-900">
      <p className="text-sm font-medium text-gray-500">401</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">
        Access denied
      </h1>
      <p className="mt-2 max-w-sm text-sm text-gray-500">
        You don’t have permission to view this page or your session has expired.
      </p>
    </main>
  );
}
