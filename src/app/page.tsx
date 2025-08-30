import { CountryStateForm } from "@/components/country-state-form";

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <main className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Country & State Selector
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Select your country and state from the cascading dropdowns below
          </p>
        </div>
        
        <CountryStateForm />
      </main>
    </div>
  );
}
