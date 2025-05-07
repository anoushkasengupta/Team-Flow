import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-white">Super Pricing Plan</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-white/10 backdrop-blur rounded-xl text-white">
            <CardHeader>
              <CardTitle>Free</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-2">$0</div>
              <ul className="mb-4 text-gray-200 space-y-2">
                <li>Up to 3 team members</li>
                <li>Unlimited tasks</li>
                <li>Basic support</li>
              </ul>
              <Button variant="outline" className="w-full">Get Started</Button>
            </CardContent>
          </Card>
          <Card className="border-2 border-blue-600 shadow-lg bg-white/20 backdrop-blur rounded-xl text-white">
            <CardHeader>
              <CardTitle>Pro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-2">$9<span className="text-lg font-normal">/mo</span></div>
              <ul className="mb-4 text-gray-200 space-y-2">
                <li>Up to 20 team members</li>
                <li>Priority support</li>
                <li>Advanced analytics</li>
                <li>Integrations</li>
              </ul>
              <Button className="w-full">Upgrade</Button>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur rounded-xl text-white">
            <CardHeader>
              <CardTitle>Enterprise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-2">Custom</div>
              <ul className="mb-4 text-gray-200 space-y-2">
                <li>Unlimited team members</li>
                <li>Dedicated support</li>
                <li>Custom integrations</li>
                <li>Onboarding & training</li>
              </ul>
              <Button variant="outline" className="w-full">Contact Sales</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
} 