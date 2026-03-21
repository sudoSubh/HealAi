import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const plans = [
  {
    name: "Free",
    price: "0",
    description: "Perfect for getting started",
    features: [
      "Basic health tracking",
      "Community access",
      "Resource directory",
      "Health articles",
    ],
  },
  {
    name: "Premium",
    price: "9.99",
    description: "Most popular for individuals",
    features: [
      "Advanced symptom analysis",
      "Personalized insights",
      "Custom notifications",
      "24/7 chat support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For organizations and businesses",
    features: [
      "Custom solutions",
      "API access",
      "Dedicated support",
      "Employee analytics",
      "Custom integrations",
    ],
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose the plan that best fits your needs. No hidden fees.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card key={plan.name} className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold mb-2">
                  {plan.price === "Custom" ? (
                    "Custom"
                  ) : (
                    <>
                      ${plan.price}
                      <span className="text-base font-normal text-gray-600">/month</span>
                    </>
                  )}
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full">{plan.price === "Custom" ? "Contact Us" : "Get Started"}</Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}