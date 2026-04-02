import { ShipmentStep } from '@/context/OrderContext';
import { Check, Loader2, Clock } from 'lucide-react';

export default function TrackingTimeline({ steps }: { steps: ShipmentStep[] }) {
  return (
    <div className="space-y-0">
      {steps.map((step, i) => (
        <div key={i} className="flex gap-4">
          {/* Line + icon */}
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
              step.status === 'completed' ? 'bg-green-500/20 text-green-400' :
              step.status === 'active' ? 'bg-primary/20 text-primary pulse-ring' :
              'bg-muted text-muted-foreground'
            }`}>
              {step.status === 'completed' ? <Check className="h-5 w-5" /> :
               step.status === 'active' ? <Loader2 className="h-5 w-5 animate-spin" /> :
               <Clock className="h-5 w-5" />}
            </div>
            {i < steps.length - 1 && (
              <div className={`w-0.5 h-16 ${
                step.status === 'completed' ? 'bg-green-500/40' : 'bg-border'
              }`} />
            )}
          </div>
          {/* Content */}
          <div className="pb-8">
            <h4 className={`font-semibold text-sm ${
              step.status === 'active' ? 'text-primary' :
              step.status === 'completed' ? 'text-foreground' :
              'text-muted-foreground'
            }`}>{step.label}</h4>
            <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
            <p className="text-xs text-muted-foreground/70 mt-0.5">{step.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
