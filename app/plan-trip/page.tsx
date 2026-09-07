import type { Metadata } from "next";
import PlanTripForm from "@/components/PlanTripForm";

export const metadata: Metadata = {
  title: "Plan Your Trip | Varanasi",
  description:
    "Create your personalized Varanasi travel plan based on your dates, budget and interests.",
};

export default function PlanTripPage() {
  return (
    <main className="min-h-screen">
      <section className="px-4 pb-12 pt-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider">
              Smart Trip Planner
            </p>

            <h1 className="text-4xl font-bold md:text-5xl">
              Plan Your Varanasi Trip
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Tell us about your trip and interests.
              We'll use your information to create a
              personalized Varanasi travel experience.
            </p>
          </div>

          <PlanTripForm />
        </div>
      </section>
    </main>
  );
}