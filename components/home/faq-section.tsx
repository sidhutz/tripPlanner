import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQS = [
  {
    q: 'How does the AI trip planner work?',
    a: 'Our AI analyzes your travel dates, group size, budget, interests, and accommodation preferences. It then uses our verified database of Varanasi places and hotels to create a personalized day-by-day itinerary with cost estimates. The AI only uses real, verified information — it never invents places or prices.',
  },
  {
    q: 'Is the trip plan free?',
    a: 'Yes! Generating a personalized AI itinerary is completely free. You only pay for the actual bookings (hotels, transport, activities) if you choose to book through us. There is no obligation to book anything.',
  },
  {
    q: 'How accurate are the cost estimates?',
    a: 'Our cost estimates are based on verified database information for hotels, typical food costs, and activity fees. However, actual prices may vary based on season, availability, and your specific choices. We always recommend confirming prices before booking.',
  },
  {
    q: 'Can I customize my itinerary after it is generated?',
    a: 'Absolutely. The AI-generated itinerary is a starting point. You can contact our local team via WhatsApp, phone, or email to make any adjustments — from changing hotels to adding activities or modifying the schedule.',
  },
  {
    q: 'What is the best time to visit Varanasi?',
    a: 'October to March is the most pleasant time, with comfortable weather. If you want to experience Dev Deepawali (November) or Mahashivratri (February/March), plan accordingly. Summers (April-June) are very hot, and the monsoon (July-September) brings heavy rain.',
  },
  {
    q: 'Is Varanasi safe for tourists?',
    a: 'Varanasi is generally safe for tourists. Like any travel destination, exercise normal precautions — keep valuables secure, avoid isolated areas at night, and use registered transport. Our team provides safety tips in every itinerary and is available for assistance throughout your trip.',
  },
  {
    q: 'Do you arrange transportation within Varanasi?',
    a: 'Yes. Our itineraries include transport recommendations (e-rickshaw, auto, cab, boat) and we can arrange local transportation for you. Just mention your preference in the trip planner form or contact us after receiving your itinerary.',
  },
  {
    q: 'Can you plan trips to nearby destinations like Sarnath or Vindhyachal?',
    a: 'Yes! Our database includes nearby attractions like Sarnath, Ramnagar Fort, and Vindhyachal. Simply select "Nearby destinations" as an interest in the trip planner, and the AI will include them in your itinerary if time permits.',
  },
];

export function FaqSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container-narrow">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to know about planning your Varanasi trip with us.
          </p>
        </div>

        <div className="mt-12">
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-base font-semibold">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
