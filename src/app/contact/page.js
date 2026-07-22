'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Accordion, AccordionItem } from '../../components/ui/Accordion';
import { useToast } from '../../components/common/Toast';

export default function ContactPage() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      showToast('Thank you! Your message has been sent to our house directors.', 'success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 1500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 font-sans bg-background">
      
      {/* Page Title */}
      <div className="text-center mb-20 max-w-xl mx-auto">
        <span className="text-[10px] font-bold uppercase tracking-widest text-accent mb-2 block animate-pulse">CONNECT WITH US</span>
        <h1 className="text-4xl font-serif text-foreground font-light tracking-wide">House Directors</h1>
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
          Have questions about a custom blending process, shipping delays, or wholesale perfume supply? Drop us a note.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-start">
        
        {/* Contact info and location */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent">OUR BOUTIQUE</span>
            <h2 className="text-3xl font-serif font-light text-foreground tracking-wide">Aura Atelier</h2>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Our master perfumery atelier and packaging house is located in the heart of Dhaka. Visitors are welcome by appointment for private smelling sessions.
            </p>
          </div>

          <div className="flex flex-col gap-4 text-xs text-muted-foreground pl-1">
            <div className="flex items-center gap-3">
              <MapPin className="h-4.5 w-4.5 text-accent stroke-[1.5] shrink-0" />
              <span>Block E, Road 11, Banani, Dhaka, Bangladesh</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4.5 w-4.5 text-accent stroke-[1.5] shrink-0" />
              <span>+880 1712 345678</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4.5 w-4.5 text-accent stroke-[1.5] shrink-0" />
              <span>directors@aurashop.com</span>
            </div>
          </div>

          <div className="border-t border-border/40 pt-8 mt-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-foreground mb-4">Store Hours</h3>
            <ul className="text-xs text-muted-foreground space-y-2">
              <li className="flex justify-between max-w-xs"><span>Sunday - Thursday:</span> <span className="font-bold text-foreground">10:00 AM - 8:00 PM</span></li>
              <li className="flex justify-between max-w-xs"><span>Friday - Saturday:</span> <span className="font-bold text-foreground">2:00 PM - 9:00 PM</span></li>
            </ul>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-card border border-border/40 p-6 rounded-xs">
          <h3 className="text-xs font-bold uppercase tracking-widest text-foreground mb-6 border-b border-border/40 pb-4 flex items-center gap-2">
            <Send className="h-4 w-4 text-accent stroke-[1.5]" /> Send Us a Message
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[9px] font-bold uppercase tracking-widest text-accent block mb-2">Your Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs focus:border-accent focus:outline-none text-foreground placeholder:text-muted-foreground/50 transition-colors"
              />
            </div>

            <div>
              <label className="text-[9px] font-bold uppercase tracking-widest text-accent block mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs focus:border-accent focus:outline-none text-foreground placeholder:text-muted-foreground/50 transition-colors"
              />
            </div>

            <div>
              <label className="text-[9px] font-bold uppercase tracking-widest text-accent block mb-2">Subject</label>
              <input
                type="text"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                placeholder="Scent inquiry, order help, etc..."
                className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs focus:border-accent focus:outline-none text-foreground placeholder:text-muted-foreground/50 transition-colors"
              />
            </div>

            <div>
              <label className="text-[9px] font-bold uppercase tracking-widest text-accent block mb-2">Message</label>
              <textarea
                rows="5"
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                placeholder="Describe your inquiry in detail..."
                className="w-full rounded-xs border border-border bg-background px-3 py-2 text-xs focus:border-accent focus:outline-none text-foreground placeholder:text-muted-foreground/50 transition-colors"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3"
            >
              {loading ? 'Sending message...' : 'Send Message'}
            </Button>
          </form>
        </div>

      </div>

      {/* Accordion FAQ Section */}
      <section className="max-w-4xl border-t border-border/40 pt-16 mx-auto">
        <h2 className="text-xl font-serif text-foreground mb-8 text-center flex items-center justify-center gap-2">
          <HelpCircle className="h-5 w-5 text-accent stroke-[1.5]" /> Frequently Asked Questions
        </h2>
        
        <Accordion>
          <AccordionItem title="Are your inspired scents identical to original brands?">
            <p>Our inspired perfumes are created by matching the sillage and scent pyramids of iconic designer brands. While they smell extremely close (over 95% similarity), we fine-tune certain chemical transitions using high-grade organic maceration. This increases skin longevity and sillage projection.</p>
          </AccordionItem>
          <AccordionItem title="Can I customize a perfume formula online?">
            <p>Yes! With our **Custom Perfume Blend Kit**, we ship 5 absolute raw base oils to your home. You can test blending combinations. Once you find your preferred notes ratio, submit the recipe card online (or contact support), and our master perfumers will mix and bottle a 100ml batch for you.</p>
          </AccordionItem>
          <AccordionItem title="What is Cash on Delivery (COD) dispatch verification?">
            <p>To avoid fraudulent returns and delivery failures, our logistics directors make a quick phone call to verify shipping details before dispatching any parcel. COD orders are packed in luxury cardboard cylinders and delivered within 2-4 business days.</p>
          </AccordionItem>
        </Accordion>
      </section>

    </div>
  );
}
