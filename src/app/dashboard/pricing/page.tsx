"use client";

import { Icon } from "@iconify/react/dist/iconify.js";

export default function Pricing() {
  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-lg text-zinc-600">Choose the plan that works best for you</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Basic Plan */}
        <div className="bg-white p-8 rounded-2xl border hover:border-blue-500 transition-all">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Basic</h2>
            <p className="text-zinc-600">Perfect for getting started</p>
            <div className="mt-4">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-zinc-500">/month</span>
            </div>
          </div>

          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3 text-zinc-600">
              <Icon icon="tabler:check" className="size-5 text-green-500" />
              Up to 5 templates
            </li>
            <li className="flex items-center gap-3 text-zinc-600">
              <Icon icon="tabler:check" className="size-5 text-green-500" />
              Basic e-signatures
            </li>
            <li className="flex items-center gap-3 text-zinc-600">
              <Icon icon="tabler:check" className="size-5 text-green-500" />
              Email support
            </li>
          </ul>

          <button className="w-full py-3 rounded-xl bg-zinc-100 text-zinc-900 font-medium hover:bg-zinc-200 transition-colors">
            Get Started
          </button>
        </div>

        {/* Pro Plan */}
        <div className="bg-white p-8 rounded-2xl border-2 border-blue-500 relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
            Most Popular
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Pro</h2>
            <p className="text-zinc-600">For growing businesses</p>
            <div className="mt-4">
              <span className="text-4xl font-bold">$29</span>
              <span className="text-zinc-500">/month</span>
            </div>
          </div>

          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3 text-zinc-600">
              <Icon icon="tabler:check" className="size-5 text-green-500" />
              Unlimited templates
            </li>
            <li className="flex items-center gap-3 text-zinc-600">
              <Icon icon="tabler:check" className="size-5 text-green-500" />
              Advanced e-signatures
            </li>
            <li className="flex items-center gap-3 text-zinc-600">
              <Icon icon="tabler:check" className="size-5 text-green-500" />
              Priority support
            </li>
            <li className="flex items-center gap-3 text-zinc-600">
              <Icon icon="tabler:check" className="size-5 text-green-500" />
              Custom branding
            </li>
          </ul>

          <button className="w-full py-3 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors">
            Start Free Trial
          </button>
        </div>

        {/* Enterprise Plan */}
        <div className="bg-white p-8 rounded-2xl border hover:border-blue-500 transition-all">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Enterprise</h2>
            <p className="text-zinc-600">For large organizations</p>
            <div className="mt-4">
              <span className="text-4xl font-bold">Custom</span>
            </div>
          </div>

          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3 text-zinc-600">
              <Icon icon="tabler:check" className="size-5 text-green-500" />
              Everything in Pro
            </li>
            <li className="flex items-center gap-3 text-zinc-600">
              <Icon icon="tabler:check" className="size-5 text-green-500" />
              Dedicated account manager
            </li>
            <li className="flex items-center gap-3 text-zinc-600">
              <Icon icon="tabler:check" className="size-5 text-green-500" />
              Custom integrations
            </li>
            <li className="flex items-center gap-3 text-zinc-600">
              <Icon icon="tabler:check" className="size-5 text-green-500" />
              SLA & premium support
            </li>
          </ul>

          <button className="w-full py-3 rounded-xl bg-zinc-100 text-zinc-900 font-medium hover:bg-zinc-200 transition-colors">
            Contact Sales
          </button>
        </div>
      </div>
    </div>
  );
}