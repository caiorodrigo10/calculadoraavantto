import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface FormFieldProps {
  label: string;
  tooltipText: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  type?: "number" | "currency" | "percentage";
  max?: number;
  step?: number;
  labelClassName?: string;
}

export const FormField = ({
  label,
  tooltipText,
  value,
  onChange,
  prefix,
  type = "number",
  max = 100,
  step = 1,
  labelClassName = "",
}: FormFieldProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    onChange(value);
  };

  const handleSliderChange = (value: number[]) => {
    onChange(value[0]);
  };

  // Prevent scroll wheel from changing input value
  const preventScrollChange = (e: WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  if (type === "percentage") {
    return (
      <div className="input-group">
        <div className="flex items-center space-x-2 mb-2">
          <Label htmlFor={label} className={`text-lg font-normal ${labelClassName}`}>{label}</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-foreground/60" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-64">{tooltipText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="slider-wrapper">
          <Slider
            value={[value]}
            onValueChange={handleSliderChange}
            max={100}
            step={1}
            className="flex-1"
          />
          <span className="value-display">{value}%</span>
        </div>
      </div>
    );
  }

  return (
    <div className="input-group">
      <div className="flex items-center space-x-2 mb-2">
        <Label htmlFor={label} className={`text-lg font-normal ${labelClassName}`}>{label}</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-foreground/60" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="w-64">{tooltipText}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white pr-1">
            {prefix}
          </span>
        )}
        <Input
          type="number"
          value={value || ""}
          onChange={handleChange}
          max={max}
          step={step}
          className={`h-12 text-xl font-bold bg-background text-white border-white ${prefix ? 'pl-8' : ''}`}
          onWheel={preventScrollChange}
        />
      </div>
    </div>
  );
};