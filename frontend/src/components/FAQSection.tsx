import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "How accurate is the symptom checker?",
    answer: "Our symptom checker uses advanced AI algorithms and is regularly updated with the latest medical knowledge. While it provides helpful insights, it's designed to be a preliminary tool and should not replace professional medical advice.",
  },
  {
    question: "Is my health data secure?",
    answer: "Yes, we take data security seriously. All your health information is encrypted and stored securely following HIPAA guidelines. We never share your personal information without your explicit consent.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your subscription at any time. If you cancel, you'll continue to have access to your premium features until the end of your billing period.",
  },
  {
    question: "How do I get support if I need help?",
    answer: "We offer multiple support channels including in-app chat and email support. Premium users get priority support with faster response times.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-20 bg-gradient-to-br from-slate-50 to-emerald-50/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our platform.
          </p>
        </motion.div>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible>
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <AccordionItem value={`item-${index}`} className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-lg px-4 mb-4 shadow-sm hover:shadow-md transition-shadow">
                  <AccordionTrigger className="py-4 hover:no-underline">
                    <span className="text-left font-medium text-gray-800">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}