import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";


export function Slider({ value, max = 100, step = 1, onValueChange }: {
value: number[];
max?: number;
step?: number;
onValueChange: (v: number[]) => void;
}) {
return (
<SliderPrimitive.Root
value={value}
max={max}
step={step}
onValueChange={onValueChange}
className="relative flex w-full touch-none select-none items-center h-5"
>
<SliderPrimitive.Track className="relative h-1 w-full grow rounded-full bg-gray-700">
<SliderPrimitive.Range className="absolute h-full bg-blue-500 rounded-full" />
</SliderPrimitive.Track>
<SliderPrimitive.Thumb
className="block h-4 w-4 rounded-full bg-white shadow-md transition-all hover:scale-110"
/>
</SliderPrimitive.Root>
);
}