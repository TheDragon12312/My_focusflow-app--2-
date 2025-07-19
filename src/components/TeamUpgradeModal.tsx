
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, CreditCard, Users, Zap, Crown } from 'lucide-react';
import { paddleService } from '@/lib/paddle-service';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface TeamUpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TeamUpgradeModal: React.FC<TeamUpgradeModalProps> = ({
  open,
  onOpenChange,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      id: 'team_monthly',
      name: 'Team - Maandelijks',
      price: '€19,99',
      period: '/maand',
      description: 'Perfect voor kleine teams',
      features: [
        'Tot 10 teamleden',
        'Onbeperkte team sessies',
        'Realtime samenwerking',
        'Team statistieken',
        'Gedeelde doelen',
        'Premium support'
      ],
      popular: false,
    },
    {
      id: 'team_yearly',
      name: 'Team - Jaarlijks',
      price: '€199,99',
      period: '/jaar',
      description: 'Bespaar 17% met jaarlijks abonnement',
      features: [
        'Tot 10 teamleden',
        'Onbeperkte team sessies',
        'Realtime samenwerking',
        'Team statistieken',
        'Gedeelde doelen',
        'Premium support',
        'Advanced analytics',
        'Custom integraties'
      ],
      popular: true,
    },
  ];

  const handleUpgrade = async (planId: string) => {
    if (!user) {
      toast.error('Je moet ingelogd zijn om te upgraden');
      return;
    }

    setLoading(true);
    try {
      await paddleService.openCheckout({
        items: [{ priceId: planId }],
        customer: { email: user.email },
      });
    } catch (error) {
      console.error('Upgrade error:', error);
      toast.error('Er ging iets mis bij het upgraden');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl">
            <Crown className="h-6 w-6 mr-2 text-yellow-600" />
            Upgrade naar Team
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative ${plan.popular ? 'border-2 border-blue-500 shadow-lg' : ''}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white">
                  Meest Populair
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>
                <p className="text-gray-600 mt-2">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={loading}
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                      : ''
                  }`}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  {loading ? 'Bezig...' : 'Upgrade Nu'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-start space-x-3">
            <Zap className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div>
              <h4 className="font-semibold">Waarom upgraden naar Team?</h4>
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                <li>• Verhoog je productiviteit met teamgenoten</li>
                <li>• Deel doelen en motiveer elkaar</li>
                <li>• Krijg inzicht in team prestaties</li>
                <li>• Synchroniseer focus sessies in realtime</li>
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
